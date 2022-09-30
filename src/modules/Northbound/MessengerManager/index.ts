import fetch from 'node-fetch';
import winston from 'winston';
import { ConfigManager } from '../../ConfigManager';
import {
  IMessengerServerConfig,
  IMessengerServerStatus
} from '../../ConfigManager/interfaces';

export class MessengerManager {
  public serverStatus: IMessengerServerStatus = {
    server: 'notconfigured',
    registration: 'unknown'
  };
  public messengerConfig: IMessengerServerConfig;

  private configManager: ConfigManager;
  private loginToken: string;
  private machineCatalog: Array<Object>;
  private defaultTimezoneId: string;
  private organizationUnits: Array<Object>;
  private timezones: Array<{ [key: string]: string }>;
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

    if (
      this.messengerConfig &&
      this.messengerConfig.hostname &&
      this.messengerConfig.username &&
      this.messengerConfig.password
    ) {
      winston.debug(`${logPrefix} Messenger configuration is available.`);
      await this.checkStatus();

      if (!this.loginToken) {
        winston.warn(
          `${logPrefix} Cannot setup Messenger as login token could not be obtained.`
        );
      } else if (this.serverStatus.registration !== 'registered') {
        winston.debug(
          `${logPrefix} The configuration has not been registered yet, starting setup process.`
        );
        await this.registerMachine();
      } else {
        winston.debug(
          `${logPrefix} Messenger configuration is already set correctly.`
        );
      }
    } else {
      this.serverStatus.server = 'notconfigured';
      winston.debug(`${logPrefix} No messenger configuration found.`);
    }
  }

  /**
   * Checks the registration and server status of Messenger
   */
  public async checkStatus() {
    const logPrefix = `${this.name}::checkStatus`;
    winston.debug(`${logPrefix} checking status`);

    if (!this.messengerConfig) {
      this.serverStatus.server = 'notconfigured';
      return;
    }
    if (!this.messengerConfig.hostname) {
      this.serverStatus.server = 'notconfigured';
      return;
    }
    if (!this.messengerConfig.username || !this.messengerConfig.password) {
      this.serverStatus.server = 'notconfigured';
      return;
    }
    if (!this.loginToken) {
      await this.getLoginToken();
    }

    if (!this.loginToken || this.serverStatus.registration !== 'unknown') {
      return;
    }
    await this.checkRegistration();
    // TBD: should it try to register after checking too?
  }

  /**
   * Checks if this machine is registered correctly
   */
  public async checkRegistration() {
    const logPrefix = `${this.name}::checkRegistration`;
    winston.debug(`${logPrefix} checking registration status`);
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
        this.serverStatus.registration = 'notregistered';
        const data = await response?.json();
        //@ts-ignore
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
          }
        }
      } else {
        if (response.status === 401 || response.status === 403) {
          this.serverStatus.server = 'invalidauth';
        } else {
          winston.warn(
            `${logPrefix} Get MachineCatalog: Unhandled response status ${response.status} ${response.statusText} ${response}`
          );
        }
      }
    } catch (err) {
      winston.warn(`${logPrefix} Cannot read machine token ${err}`);
    }
  }

  /**
   * Updates the registration to Messenger
   */
  public async getLoginToken() {
    const logPrefix = `${this.name}::getLoginToken`;
    winston.debug(logPrefix);
    if (this.loginToken) {
      return;
    }
    try {
      const response = await fetch(
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
      if (response.ok) {
        const data = await response.json();
        //@ts-ignore
        this.loginToken = data.jwt;
        if (this.loginToken) {
          this.serverStatus.server = 'available';
        }
      } else {
        if (response.status === 401 || response.status === 403) {
          this.serverStatus.server = 'invalidauth';
        } else if (response.status === 404) {
          this.serverStatus.server = 'invalidhost';
        } else {
          winston.warn(
            `${logPrefix}  Unhandled response status ${response.status} ${response.statusText} ${response}`
          );
        }
      }
    } catch (err) {
      this.serverStatus.server = 'invalidhost';
      winston.warn(`${logPrefix} Error getting login token ${err}`);
      return;
    }
  }
  /**
   * Updates the registration to Messenger
   */
  public async registerMachine() {
    const logPrefix = `${this.name}::registerMachine`;

    winston.debug(`${logPrefix} initiated`);

    if (this.serverStatus.registration === 'registered') {
      return;
    }
    this.serverStatus.registration = 'notregistered';
    //TODO: check config file if it is correct content before starting setup

    if (!this.loginToken) {
      await this.getLoginToken();
    }

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
        //@ts-ignore
        if (data.err || data.erd) {
          //TBD
        }
        //@ts-ignore
        this.machineCatalog = data.msg;
        winston.debug(`${logPrefix} Machine Catalog read successfully.`);
      } else {
        if (response.status === 401 || response.status === 403) {
          this.serverStatus.server = 'invalidauth';
        } else {
          winston.warn(
            `${logPrefix} Get MachineCatalog: Unhandled response status ${response.status} ${response.statusText} ${response}`
          );
        }
      }
    } catch (err) {
      winston.warn(`${logPrefix} Cannot read machine catalog ${err}`);
      return;
    }

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
        //@ts-ignore
        if (data.err || data.erd) {
          //TBD
        }
        //@ts-ignore
        const machineObject = data.msg;
        this.defaultTimezoneId = machineObject.TimeZoneId;
        winston.debug(`${logPrefix} Machine Object read successfully.`);
      } else {
        if (response.status === 401 || response.status === 403) {
          this.serverStatus.server = 'invalidauth';
        } else {
          winston.warn(
            `${logPrefix} Get MachineCatalog: Unhandled response status ${response.status} ${response.statusText} ${response}`
          );
        }
      }
    } catch (err) {
      winston.warn(`${logPrefix} Cannot read machine object ${err}`);
      return;
    }

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
        //@ts-ignore
        if (data.err || data.erd) {
          //TBD
        }
        //@ts-ignore
        this.organizationUnits = data.msg;
        winston.debug(`${logPrefix} Organization Units read successfully.`);
      } else {
        if (response.status === 401 || response.status === 403) {
          this.serverStatus.server = 'invalidauth';
        } else {
          winston.warn(
            `${logPrefix} Get OrganizationUnits: Unhandled response status ${response.status} ${response.statusText} ${response}`
          );
        }
      }
    } catch (err) {
      winston.warn(`${logPrefix} Cannot read organization units ${err}`);
      return;
    }

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
        //@ts-ignore
        if (data.err || data.erd) {
          //TBD
        }
        //@ts-ignore
        this.timezones = data.msg;
        winston.debug(`${logPrefix} Timezones read successfully.`);
      } else {
        if (response.status === 401 || response.status === 403) {
          this.serverStatus.server = 'invalidauth';
        } else {
          winston.warn(
            `${logPrefix} Get Timezones: Unhandled response status ${response.status} ${response.statusText} ${response.text}`
          );
        }
      }
    } catch (err) {
      winston.warn(`${logPrefix} Cannot read timezones ${err}`);
      return;
    }

    //Create machine
    try {
      const newMachineConfig = JSON.stringify({
        MachineName: this.messengerConfig.name,
        SerialNumber: this.configManager.config.general.serialNumber,
        LicenseNumber: this.configManager.config.general.serialNumber, //TBD
        MachineCatalogId: Number(this.messengerConfig.model),
        MachineImage: `/adm/api/machinecatalog/image/${
          this.machineCatalog.find(
            //@ts-ignore
            (machine) => machine.Id === Number(this.messengerConfig.model)
            //@ts-ignore
          )?.ImageFileName
        }`, //TBD
        TimeZoneId: this.messengerConfig.timezone ?? this.defaultTimezoneId,
        MTConnectAgentManagementMode: 'UA',
        MTConnectUrl: `http://${this.messengerConfig.name}:15404`, // `DMG_MORI_${'12345'}/`, //TBD
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
        //@ts-ignore

        if (typeof data === 'string') {
          this.serverStatus.registration = 'registered';
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
        if (response.status === 401 || response.status === 403) {
          this.serverStatus.server = 'invalidauth';
        } else {
          winston.warn(
            `${logPrefix} Create machine: Unhandled response status (potentially license error): ${
              response.status
            } ${response.statusText} ${
              //@ts-ignore
              await response.text()
            }`
          );
        }
      }
    } catch (err) {
      winston.warn(`${logPrefix} Cannot create machine ${err}`);
    }
  }

  /**
   *
   */
  private async handleConfigChange() {
    const logPrefix = `${this.name}::handleConfigChange`;
    this.serverStatus.registration = 'unknown';
    this.serverStatus.server = 'notconfigured';

    //check if anything changed in the new config
    await this.checkRegistration();

    //Config changed
    await this.checkStatus();

    await this.registerMachine();
  }
}
