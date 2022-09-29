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
  private baseURL: string;
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

    //TODO
    this.baseURL = this.messengerConfig?.hostname
      ? `${this.messengerConfig?.hostname}/adm/api`
      : '';
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
      //TODO how to check if this machine is registered correctly: probably a)
      let response = await fetch(`${this.baseURL}/machines`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.loginToken}`
        }
      });
      if (response.ok) {
        this.serverStatus.registration = 'notregistered';
        const data = await response?.json();
        //@ts-ignore
        if (data.err || data.erd) {
          //TBD
        }
        //TODO: check if this machine is registered
        if (data.msg) {
          let listOfRegisteredMachinesInMessenger = data.msg;
          winston.debug(this.configManager.config.general.serialNumber);
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
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          User: this.messengerConfig.username,
          Pass: this.messengerConfig.password
        })
      });
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
      const response = await fetch(`${this.baseURL}/machinecatalog`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.loginToken}`
        }
      });
      if (response.ok) {
        const data = await response?.json();
        //@ts-ignore
        if (data.err || data.erd) {
          //TBD
        }
        //@ts-ignore
        this.machineCatalog = data.msg;
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
      const response = await fetch(`${this.baseURL}/machines/new`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.loginToken}`
        }
      });

      if (response.ok) {
        const data = await response?.json();
        //@ts-ignore
        if (data.err || data.erd) {
          //TBD
        }
        //@ts-ignore
        const machineObject = data.msg;
        this.defaultTimezoneId = machineObject.TimeZoneId;
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
      const response = await fetch(`${this.baseURL}/orgunits`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.loginToken}`
        }
      });

      if (response.ok) {
        const data = await response?.json();
        //@ts-ignore
        if (data.err || data.erd) {
          //TBD
        }
        //@ts-ignore
        this.organizationUnits = data.msg;
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
      const response = await fetch(`${this.baseURL}/classifiers/timezones`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.loginToken}`
        }
      });
      if (response.ok) {
        const data = await response?.json();
        //@ts-ignore
        if (data.err || data.erd) {
          //TBD
        }
        //@ts-ignore
        this.timezones = data.msg;
      } else {
        if (response.status === 401 || response.status === 403) {
          this.serverStatus.server = 'invalidauth';
        } else {
          winston.warn(
            `${logPrefix} Get Timezones: Unhandled response status ${response.status} ${response.statusText} ${response}`
          );
        }
      }
    } catch (err) {
      winston.warn(`${logPrefix} Cannot read timezones ${err}`);
      return;
    }

    //Create machine
    try {
      const response = await fetch(`${this.baseURL}/machines`, {
        method: 'POST',
        body: JSON.stringify({
          MachineName: '',
          SerialNumber: this.configManager.config.general.serialNumber,
          LicenseNumber: '', //TBD
          MachineCatalogId: '',
          MachineImage: '',
          TimeZoneId: 'givenTimezone' || this.defaultTimezoneId,
          MTConnectAgentManagementMode: 'UA',
          MTConnectUrl: '',
          OrgUnitId: ''
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.loginToken}`
        }
      });
      if (response.ok) {
        const data = await response?.json();
        //@ts-ignore
        if (data.err || data.erd) {
          //TBD
        }
        if (data.msg) {
          this.serverStatus.registration = 'registered';
          winston.debug(
            `${logPrefix} Machine has been registered to Messenger successfully.`
          );
        } else {
          winston.warn(`${logPrefix} Could not successfully create machine`);
        }
      } else {
        if (response.status === 401 || response.status === 403) {
          this.serverStatus.server = 'invalidauth';
        } else {
          winston.warn(
            `${logPrefix} Get Timezones: Unhandled response status ${response.status} ${response.statusText} ${response}`
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
