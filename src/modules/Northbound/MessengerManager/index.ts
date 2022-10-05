import fetch from 'node-fetch';
import winston from 'winston';
import { ConfigManager } from '../../ConfigManager';
import {
  IMessengerMetadata,
  IMessengerServerConfig,
  IMessengerServerStatus
} from '../../ConfigManager/interfaces';
import { System } from '../../System';

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
  private machineCatalog: Array<IMachineCatalog>;
  private defaultTimezoneId: number;
  private organizationUnits: Array<IOrganizationUnit>;
  private timezones: ITimezone;
  protected name = MessengerManager.name;

  constructor(options) {
    this.messengerConfig = options.messengerConfig;
    this.configManager = options.configManager;
    this.configManager.on('configChange', this.handleConfigChange.bind(this));
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
      return;
    }

    await this.getLoginToken();

    if (!this.loginToken) {
      return;
    }
    await this.readMetadataFromMessenger();
    if (
      this.messengerConfig.model &&
      !this.machineCatalog.find((m) => m.id === this.messengerConfig.model)
    ) {
      this.serverStatus.registration = 'error';
      this.serverStatus.registrationErrorReason = 'invalid_model';
    }
    if (
      this.messengerConfig.organization &&
      !this.organizationUnits.find(
        (m) => m.id === this.messengerConfig.organization
      )
    ) {
      this.serverStatus.registration = 'error';
      this.serverStatus.registrationErrorReason = 'invalid_organization';
    }
    if (
      this.messengerConfig.timezone &&
      !this.timezones[`${this.messengerConfig.timezone}`]
    ) {
      this.serverStatus.registration = 'error';
      this.serverStatus.registrationErrorReason = 'invalid_timezone';
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

    await this.readMetadataFromMessenger();

    let metadaData: IMessengerMetadata = {
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

    return metadaData;
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
        const data = await response?.json();
        if (data) {
          let listOfRegisteredMachinesInMessenger = data;
          if (
            listOfRegisteredMachinesInMessenger.find?.(
              (registeredMachine) =>
                registeredMachine.SerialNumber ===
                this.configManager.config.general.serialNumber
            )
          ) {
            this.serverStatus.registration = 'registered';
            this.serverStatus.registrationErrorReason = null;
          }
        }
      } else {
        if (response.status === 401 || response.status === 403) {
          this.serverStatus.server = 'invalid_auth';
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
        } else if (response.status === 404) {
          this.serverStatus.server = 'invalid_host';
        } else {
          winston.warn(
            `${logPrefix}  Unhandled response status ${response.status} ${response.statusText} ${response}`
          );
        }
      }
    } catch (err) {
      this.serverStatus.server = 'invalid_host';
      winston.warn(`${logPrefix} Error getting login token ${err}`);
      return;
    }
  }

  /**
   * Ready the metada from Messenger
   */
  private async readMetadataFromMessenger() {
    const logPrefix = `${this.name}::readMetadataFromMessenger`;

    if (!this.loginToken) {
      await this.getLoginToken();
    }
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
              imageFileMame: machine.ImageFileName
            }));
            winston.debug(`${logPrefix} Machine Catalog read successfully.`);
          } else {
            await this.errorHandler(
              response,
              `${logPrefix} [Read MachineCatalog]`
            );
          }
          resolve();
        } catch (err) {
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
            await this.errorHandler(
              response,
              `${logPrefix} [Read MachineObject]`
            );
          }
          resolve();
        } catch (err) {
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

            winston.debug(`${logPrefix} Organization Units read successfully.`);
          } else {
            await this.errorHandler(
              response,
              `${logPrefix} [Get OrganizationUnits]`
            );
          }
          resolve();
        } catch (err) {
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
            await this.errorHandler(response, `${logPrefix} [Read Timezones]`);
          }
          resolve();
        } catch (err) {
          winston.warn(`${logPrefix} Cannot read timezones ${err}`);
          reject();
        }
      })
    ]);
  }
  /**
   * Updates the registration to Messenger
   */
  private async registerMachine() {
    const logPrefix = `${this.name}::registerMachine`;

    winston.debug(`${logPrefix} started`);

    if (this.serverStatus.registration === 'registered') {
      return;
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
      const hostname = await new System().getHostname();

      const newMachineConfig = JSON.stringify({
        MachineName: this.messengerConfig.name,
        SerialNumber: this.configManager.config.general.serialNumber,
        LicenseNumber: this.configManager.config.general.serialNumber, //TBD
        MachineCatalogId: this.messengerConfig.model,
        MachineImage: `/adm/api/machinecatalog/image/${
          this.machineCatalog.find(
            (machine) => machine.id === this.messengerConfig.model
          )?.imageFileName
        }`,
        TimeZoneId: this.messengerConfig.timezone ?? this.defaultTimezoneId,
        MTConnectAgentManagementMode: 'UA',
        MTConnectUrl: `http://${hostname}:15404`,
        OrgUnitId: this.messengerConfig.organization,
        IsHidden: false,
        DisplayInMessenger: true,
        ProcessMTConnectWarningsAsFaults: false
      });
      winston.debug(
        `${logPrefix} Creating machine with the config: ${newMachineConfig}`
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
          this.serverStatus.registration = 'registered';
          this.serverStatus.registrationErrorReason = null;
          winston.debug(
            `${logPrefix} Machine has been registered to Messenger successfully. Machine Id: ${data}`
          );
        } else if (data.err || data.erd) {
          winston.warn(
            `${logPrefix} Error during create machine. data.err:${data.err} data.erd:${data.erd}`
          );
          //TBD
        }
      } else {
        await this.errorHandler(response, logPrefix);
      }
    } catch (err) {
      winston.warn(`${logPrefix} Cannot create machine ${err}`);
    }
  }

  /**
   * Handles errors from Messenger server
   */
  private async errorHandler(response, logPrefix) {
    const errorMessage = JSON.parse(await response.text())?.ExceptionMessage;

    winston.warn(
      `${logPrefix} Error in response: [${response.status} ${response.statusText}] ${errorMessage}`
    );

    if (response.status === 401 || response.status === 403) {
      this.serverStatus.server = 'invalid_auth';
      if (response.status === 401 && this.loginToken) {
        //Potentially login token expired
        this.loginToken = null;
        await this.getLoginToken();
      }
    }
  }

  /**
   * Handles changes in config
   */
  private async handleConfigChange() {
    const logPrefix = `${this.name}::handleConfigChange`;
    const newMessengerConfig = this.configManager.config.messenger;

    if (
      JSON.stringify(newMessengerConfig) ===
      JSON.stringify(this.messengerConfig)
    ) {
      return;
    }
    //Config changed
    this.messengerConfig = newMessengerConfig;
    this.serverStatus.registration = 'unknown';
    this.serverStatus.server = 'not_configured';
    this.serverStatus.registrationErrorReason = null;

    await this.init();
  }
}
