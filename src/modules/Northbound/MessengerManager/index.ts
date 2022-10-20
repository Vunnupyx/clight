import fetch from 'node-fetch';
import winston from 'winston';
import { ConfigManager } from '../../ConfigManager';
import {
  IMessengerMetadata,
  IMessengerServerConfig,
  IMessengerServerStatus
} from '../../ConfigManager/interfaces';
import NetworkManagerCliController from '../../NetworkManager';
import { System } from '../../System';
import { areObjectsEqual } from '../../Utilities';

interface IMachineCatalog {
  name: string;
  id: number;
  imageFileName: string;
}

interface IOrganizationUnit {
  name: string;
  id: string;
}

interface ITimezone {
  [key: string]: string;
}

export class MessengerManager {
  public serverStatus: IMessengerServerStatus = {
    server: 'not_configured',
    registration: 'unknown',
    registrationErrorReason: null
  };
  public messengerConfig: IMessengerServerConfig;

  private configManager: ConfigManager;
  private loginToken: string;
  private registeredMachineId: string;
  private machineCatalog: Array<IMachineCatalog>;
  private defaultTimezoneId: number;
  private organizationUnits: Array<IOrganizationUnit>;
  private timezones: ITimezone;
  private ipAddress: string;
  protected name = MessengerManager.name;

  constructor(options) {
    this.messengerConfig = options.messengerConfig;
    this.configManager = options.configManager;
    this.configManager.on('configChange', this.handleConfigChange.bind(this));
    this.getIpAddress();
  }

  private async getIpAddress() {
    this.ipAddress =
      process.env.NODE_ENV === 'development'
        ? 'localhost'
        : (await NetworkManagerCliController.getConfiguration('eth0'))
            ?.ipAddress;
  }

  /**
   * Initializes Messenger Manager by checking if any configuration exists and testing and updating configuration if needed
   */
  public async init() {
    const logPrefix = `${this.name}::init`;

    winston.debug(`${logPrefix} Messenger Manager is initializing`);

    if (
      this.messengerConfig &&
      this.messengerConfig.hostname?.length > 0 &&
      this.messengerConfig.username?.length > 0 &&
      this.messengerConfig.password?.length > 0
    ) {
      winston.debug(`${logPrefix} Messenger configuration is available.`);
      await this.checkStatus();

      if (!this.loginToken) {
        winston.warn(
          `${logPrefix} Cannot setup Messenger as login token could not be obtained.`
        );
      } else {
        if (this.serverStatus.registration === 'registered') {
          winston.debug(
            `${logPrefix} Messenger configuration is already set correctly.`
          );
        } else if (this.serverStatus.registration !== 'error') {
          winston.debug(
            `${logPrefix} The configuration has not been registered yet, starting setup process.`
          );
          await this.registerMachine();
        }
      }
    } else {
      this.serverStatus.server = 'not_configured';
      winston.debug(`${logPrefix} No messenger configuration found.`);
    }
  }

  /**
   * Checks the registration and server status of Messenger
   */
  public async checkStatus() {
    const logPrefix = `${this.name}::checkStatus`;
    winston.debug(`${logPrefix} checking status`);

    if (
      !this.messengerConfig ||
      !this.messengerConfig?.hostname ||
      !this.messengerConfig?.username ||
      !this.messengerConfig?.password
    ) {
      this.serverStatus.server = 'not_configured';
      winston.debug(`${logPrefix} Not configured`);
      return;
    }

    await this.getLoginToken();

    if (!this.loginToken || this.serverStatus.server === 'invalid_host') {
      this.serverStatus.registration = 'unknown';
      return;
    }
    await this.readMetadataFromMessenger();
    if (
      this.configManager.config.general.serialNumber === '' ||
      !this.configManager.config.general.serialNumber
    ) {
      this.serverStatus.registration = 'error';
      this.serverStatus.registrationErrorReason = 'missing_serial';
      winston.debug(`${logPrefix} Missing serial number`);
    }
    if (
      this.messengerConfig.model &&
      !this.machineCatalog.find((m) => m.id === this.messengerConfig.model)
    ) {
      this.serverStatus.registration = 'error';
      this.serverStatus.registrationErrorReason = 'invalid_model';
      winston.debug(`${logPrefix} Invalid model`);
    }
    if (
      this.messengerConfig.organization &&
      !this.organizationUnits.find(
        (m) => m.id === this.messengerConfig.organization
      )
    ) {
      this.serverStatus.registration = 'error';
      this.serverStatus.registrationErrorReason = 'invalid_organization';
      winston.debug(`${logPrefix} Invalid organization`);
    }
    if (
      this.messengerConfig.timezone &&
      !this.timezones[`${this.messengerConfig.timezone}`]
    ) {
      this.serverStatus.registration = 'error';
      this.serverStatus.registrationErrorReason = 'invalid_timezone';
      winston.debug(`${logPrefix} Invalid timezone`);
    }

    if (this.serverStatus.registration === 'error') {
      return;
    }

    await this.checkRegistration();
  }

  /**
   * Prepares and returns metadata
   */
  public async getMetadata() {
    const logPrefix = `${this.name}::getMetadata`;
    if (this.serverStatus.server !== 'available') {
      return { organizations: [], models: [], timezones: [] };
    }
    await this.readMetadataFromMessenger();

    let metadataData: IMessengerMetadata = {
      organizations: this.organizationUnits,
      models: this.machineCatalog.map((machine) => ({
        id: machine.id,
        name: machine.name
      })),
      timezones: Object.entries(this.timezones).map(([id, name]) => ({
        id: Number(id),
        name
      }))
    };

    return metadataData;
  }

  /**
   * Checks if this machine is registered correctly
   */
  private async checkRegistration() {
    const logPrefix = `${this.name}::checkRegistration`;
    winston.debug(`${logPrefix} checking registration`);
    if (!this.loginToken) {
      await this.getLoginToken();
    }
    try {
      let response = await fetch(
        `${this.messengerConfig?.hostname}/adm/api/machines`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.loginToken}`
          }
        }
      );
      if (response.ok) {
        this.serverStatus.registration = 'not_registered';
        this.serverStatus.registrationErrorReason = null;
        const machinesList = await response?.json();
        if (machinesList) {
          let listOfRegisteredMachinesInMessenger = machinesList;
          const matchingRegisteredMachineFromMessenger =
            listOfRegisteredMachinesInMessenger.find?.(
              (registeredMachine) =>
                registeredMachine.SerialNumber ===
                this.configManager.config.general.serialNumber
            );

          if (matchingRegisteredMachineFromMessenger) {
            //Check detail info with secondary API call to verify if they are the same or duplicate
            try {
              let response = await fetch(
                `${this.messengerConfig?.hostname}/adm/api/machines/${matchingRegisteredMachineFromMessenger.Id}`,
                {
                  method: 'GET',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.loginToken}`
                  }
                }
              );
              if (response.ok) {
                const matchingMachineDetailInfo = (await response?.json())?.msg;
                if (
                  matchingMachineDetailInfo.err ||
                  matchingMachineDetailInfo.erd
                ) {
                  winston.warn(
                    `${logPrefix} Error reading machine catalog. machineDetailResponseData.err:${matchingMachineDetailInfo.err} machineDetailResponseData.erd:${matchingMachineDetailInfo.erd}`
                  );
                  //TBD
                }
                const isManagedMode =
                  matchingMachineDetailInfo.MTConnectAgentManagementMode ===
                  'NA';

                // To be same machine: IP and Port must match with managed mode OR MTConnect URL must match with not managed mode
                if (
                  (!isManagedMode &&
                    matchingMachineDetailInfo.MTConnectUrl?.includes(
                      this.ipAddress //TBD: is hostname usable instead?
                    )) ||
                  (isManagedMode &&
                    matchingMachineDetailInfo.IpAddress === this.ipAddress &&
                    matchingMachineDetailInfo.Port === 7878)
                ) {
                  this.serverStatus.registration = 'registered';
                  this.serverStatus.registrationErrorReason = null;
                  this.registeredMachineId = matchingMachineDetailInfo.Id;
                  winston.debug(`${logPrefix} machine is registered`);
                } else {
                  this.serverStatus.registration = 'error';
                  this.serverStatus.registrationErrorReason = 'duplicated';
                }
              }
            } catch (err) {
              winston.warn(
                `${logPrefix} Error getting detail info for matching machine: ${err.message}`
              );
            }
          }
        }
      } else {
        if (response.status === 401 || response.status === 403) {
          this.serverStatus.server = 'invalid_auth';
          this.serverStatus.registration = 'unknown';
        } else {
          winston.warn(
            `${logPrefix} Unhandled response status ${response.status} ${response.statusText} ${response}`
          );
        }
      }
    } catch (err) {
      winston.warn(`${logPrefix} Cannot check registration ${err}`);
    }
  }

  /**
   * Updates the registration to Messenger
   */
  private async getLoginToken() {
    const logPrefix = `${this.name}::getLoginToken`;

    if (this.loginToken) {
      return;
    }

    try {
      let response;
      let timer;
      await Promise.race([
        new Promise<void>(async (resolve, reject) => {
          timer = setTimeout(() => {
            winston.warn(
              `${logPrefix} timed out while waiting for server response`
            );
            reject();
          }, 10000);
        }),
        new Promise<void>(async (resolve, reject) => {
          try {
            response = await fetch(
              `${this.messengerConfig?.hostname}/adm/api/auth/login`,
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  User: this.messengerConfig.username,
                  Pass: this.messengerConfig.password
                })
              }
            );
            clearTimeout(timer);
            resolve();
          } catch (err) {
            clearTimeout(timer);
            if (err.message?.includes('ECONNREFUSED')) {
              this.serverStatus.server = 'invalid_host';
              this.serverStatus.registration = 'unknown';
            }
            winston.warn(
              `${logPrefix} Error with login request: ${err.message}`
            );
            reject();
          }
        })
      ]);

      if (response.ok) {
        const data = await response.json();
        this.loginToken = data.jwt;
        if (this.loginToken) {
          this.serverStatus.server = 'available';
        }
      } else {
        if (response.status === 401 || response.status === 403) {
          this.serverStatus.server = 'invalid_auth';
          this.serverStatus.registration = 'unknown';
          winston.debug(`${logPrefix} Invalid Auth`);
        } else if (response.status === 404) {
          this.serverStatus.server = 'invalid_host';
          this.serverStatus.registration = 'unknown';
          winston.debug(`${logPrefix} Invalid Host`);
        } else {
          winston.warn(
            `${logPrefix}  Unhandled response status ${response.status} ${response.statusText} ${response}`
          );
        }
      }
    } catch (err) {
      this.serverStatus.server = 'invalid_host';
      this.serverStatus.registration = 'unknown';
      winston.warn(
        `${logPrefix} Error getting login token error:${err}, server:${this.serverStatus.server}`
      );
      return;
    }
  }

  /**
   * Ready the metadata from Messenger
   */
  private async readMetadataFromMessenger() {
    const logPrefix = `${this.name}::readMetadataFromMessenger`;

    if (!this.loginToken) {
      await this.getLoginToken();
    }
    try {
      await Promise.all([
        new Promise<void>(async (resolve, reject) => {
          //Read MachineCatalog
          try {
            const response = await fetch(
              `${this.messengerConfig?.hostname}/adm/api/machinecatalog`,
              {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${this.loginToken}`
                }
              }
            );
            if (response.ok) {
              const data = await response?.json();
              if (data.err || data.erd) {
                winston.warn(
                  `${logPrefix} Error reading machine catalog. data.err:${data.err} data.erd:${data.erd}`
                );
                //TBD
              }
              this.machineCatalog = data.msg.map((machine) => ({
                name: machine.Name,
                id: machine.Id,
                imageFileName: machine.ImageFileName
              }));
              winston.debug(`${logPrefix} Machine Catalog read successfully.`);
            } else {
              await this.responseNotOKHandler(
                response,
                `${logPrefix} [Read MachineCatalog]`
              );
            }
            resolve();
          } catch (err) {
            if (err.message?.includes('ECONNREFUSED')) {
              this.serverStatus.server = 'invalid_host';
              this.serverStatus.registration = 'unknown';
            }
            winston.warn(`${logPrefix} Cannot read machine catalog ${err}`);
            reject();
          }
        }),
        new Promise<void>(async (resolve, reject) => {
          //Read MachineObject for TimezoneID
          try {
            const response = await fetch(
              `${this.messengerConfig?.hostname}/adm/api/machines/new`,
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${this.loginToken}`
                }
              }
            );

            if (response.ok) {
              const data = await response?.json();
              if (data.err || data.erd) {
                winston.warn(
                  `${logPrefix} Error reading machine object. data.err:${data.err} data.erd:${data.erd}`
                );
                //TBD
              }
              const machineObject = data.msg;
              this.defaultTimezoneId = Number(machineObject.TimeZoneId);
              winston.debug(`${logPrefix} Machine Object read successfully.`);
            } else {
              await this.responseNotOKHandler(
                response,
                `${logPrefix} [Read MachineObject]`
              );
            }
            resolve();
          } catch (err) {
            if (err.message?.includes('ECONNREFUSED')) {
              this.serverStatus.server = 'invalid_host';
              this.serverStatus.registration = 'unknown';
            }
            winston.warn(`${logPrefix} Cannot read machine object ${err}`);
            reject();
          }
        }),
        new Promise<void>(async (resolve, reject) => {
          // Read organization units
          try {
            const response = await fetch(
              `${this.messengerConfig?.hostname}/adm/api/orgunits`,
              {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${this.loginToken}`
                }
              }
            );

            if (response.ok) {
              const data = await response?.json();
              if (data.err || data.erd) {
                winston.warn(
                  `${logPrefix} Error reading organization units. data.err:${data.err} data.erd:${data.erd}`
                );
                //TBD
              }
              this.organizationUnits = data.msg.map((org) => ({
                name: org.Name,
                id: org.Id
              }));

              winston.debug(
                `${logPrefix} Organization Units read successfully.`
              );
            } else {
              await this.responseNotOKHandler(
                response,
                `${logPrefix} [Get OrganizationUnits]`
              );
            }
            resolve();
          } catch (err) {
            if (err.message?.includes('ECONNREFUSED')) {
              this.serverStatus.server = 'invalid_host';
              this.serverStatus.registration = 'unknown';
            }
            winston.warn(`${logPrefix} Cannot read organization units ${err}`);
            reject();
          }
        }),
        new Promise<void>(async (resolve, reject) => {
          // Read timezones
          try {
            const response = await fetch(
              `${this.messengerConfig?.hostname}/adm/api/classifiers/timezones`,
              {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${this.loginToken}`
                }
              }
            );
            if (response.ok) {
              const data = await response?.json();
              if (data.err || data.erd) {
                winston.warn(
                  `${logPrefix} Error reading timezones. data.err:${data.err} data.erd:${data.erd}`
                );
                //TBD
              }
              this.timezones = data.msg;
              winston.debug(`${logPrefix} Timezones read successfully.`);
            } else {
              await this.responseNotOKHandler(
                response,
                `${logPrefix} [Read Timezones]`
              );
            }
            resolve();
          } catch (err) {
            if (err.message?.includes('ECONNREFUSED')) {
              this.serverStatus.server = 'invalid_host';
              this.serverStatus.registration = 'unknown';
            }
            winston.warn(`${logPrefix} Cannot read timezones ${err}`);
            reject();
          }
        })
      ]);
    } catch (err) {
      winston.warn(`${logPrefix} Error reading metadata from server ${err}`);
    }
  }
  /**
   * Updates the registration to Messenger
   */
  private async registerMachine() {
    const logPrefix = `${this.name}::registerMachine`;

    winston.debug(`${logPrefix} started`);
    let isUpdating = false;

    if (this.serverStatus.registration === 'registered') {
      isUpdating = true;
    }

    if (
      !this.messengerConfig.name ||
      this.messengerConfig.name === '' ||
      !this.messengerConfig.organization ||
      this.messengerConfig.organization === '' ||
      !this.messengerConfig.model ||
      !this.messengerConfig.timezone
    ) {
      winston.debug(
        `${logPrefix} Cannot register machine because metadata is missing to start registration.`
      );
      return;
    }

    if (!this.loginToken) {
      await this.getLoginToken();
    }

    //Create machine
    try {
      const newMachineConfig = JSON.stringify({
        Id: isUpdating ? this.registeredMachineId : undefined,
        ChannelNumber: 1, // By default 0, but then Messenger UI doesn't let user to update anything because Messenger UI always sends channel id 1 and ids mismatch.
        MachineName: this.messengerConfig.name,
        SerialNumber: this.configManager.config.general.serialNumber,
        LicenseNumber: this.configManager.config.general.serialNumber,
        MachineCatalogId: this.messengerConfig.model,
        MachineImage: `/adm/api/machinecatalog/image/${
          this.machineCatalog.find(
            (machine) => machine.id === this.messengerConfig.model
          )?.imageFileName
        }`,
        TimeZoneId: this.messengerConfig.timezone ?? this.defaultTimezoneId,
        MTConnectAgentManagementMode: 'NA', // NA = managed mode, UA = not managed mode
        IpAddress: this.ipAddress, // TBD: is hostname usable instead?
        Port: 7878,
        OrgUnitId: this.messengerConfig.organization,
        IsHidden: false,
        DisplayInMessenger: true,
        ProcessMTConnectWarningsAsFaults: false
      });
      winston.debug(
        `${logPrefix} ${
          isUpdating ? 'Updating' : 'Creating'
        } machine with the config: ${newMachineConfig}`
      );
      const response = await fetch(
        `${this.messengerConfig?.hostname}/adm/api/machines`,
        {
          method: 'POST',
          body: newMachineConfig,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.loginToken}`
          }
        }
      );
      if (response.ok) {
        const data = await response?.json();

        if (typeof data === 'string') {
          const machineId = data;
          this.serverStatus.registration = 'registered';
          this.serverStatus.registrationErrorReason = null;
          this.registeredMachineId = machineId;
          winston.debug(
            `${logPrefix} Machine has been ${
              isUpdating ? 'updated' : 'registered to Messenger'
            } successfully. Machine Id: ${machineId}`
          );
        } else if (data.err || data.erd) {
          winston.warn(
            `${logPrefix} Error during create machine. data.err:${data.err} data.erd:${data.erd}`
          );
          //TBD
        }
      } else {
        await this.responseNotOKHandler(response, logPrefix);
      }
    } catch (err) {
      winston.warn(`${logPrefix} Cannot create machine ${err}`);
      this.serverStatus.registration = 'error';
      this.serverStatus.registrationErrorReason = 'unexpected_error';
    }
  }

  /**
   * Handles errors from Messenger server
   */
  private async responseNotOKHandler(response, logPrefix) {
    const errorMessage = JSON.parse(await response.text())?.ExceptionMessage;

    winston.warn(
      `${logPrefix} Error in response: [${response.status} ${response.statusText}] ${errorMessage}`
    );

    if (response.status === 401 || response.status === 403) {
      this.serverStatus.server = 'invalid_auth';
      this.serverStatus.registration = 'unknown';
      if (response.status === 401 && this.loginToken) {
        //Potentially login token expired
        this.loginToken = null;
        await this.getLoginToken();
      }
    } else {
      this.serverStatus.registration = 'error';
      this.serverStatus.registrationErrorReason = 'unexpected_error';
    }
  }

  /**
   * Handles changes in config
   */
  public async handleConfigChange() {
    const logPrefix = `${this.name}::handleConfigChange`;
    const newMessengerConfig = this.configManager.config.messenger;

    if (areObjectsEqual(newMessengerConfig, this.messengerConfig)) {
      winston.debug(
        `${logPrefix} Config change has no update to messenger configuration`
      );
      if (this.serverStatus.registration === 'not_registered') {
        winston.debug(
          `${logPrefix} Machine is not registered and same configuration resubmitted, trying to register the machine`
        );
        await this.init();
      } else {
        return;
      }
    }
    //Config changed
    if (
      this.messengerConfig.hostname !== newMessengerConfig.hostname ||
      this.messengerConfig.username !== newMessengerConfig.username ||
      this.messengerConfig.password !== newMessengerConfig.password
    ) {
      // status must be reset
      this.serverStatus.registration = 'unknown';
      this.serverStatus.server = 'not_configured';
      this.loginToken = null;
      this.serverStatus.registrationErrorReason = null;

      this.messengerConfig = newMessengerConfig;
      await this.init();
    } else {
      // User is updating the config
      this.messengerConfig = newMessengerConfig;
      await this.registerMachine();
    }
  }
}
