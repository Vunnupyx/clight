import axios from 'axios';
import winston from 'winston';
import { IMessengerServerConfig } from '../../ConfigManager/interfaces';

export class MessengerManager {
  public isMachineRegistered: boolean = false;
  public messengerConfig: IMessengerServerConfig;

  private baseURL: string;
  private loginToken: string;
  private machineCatalog;
  private machineObject;
  private timezoneId: string;
  private organizationUnits: Array<string>;
  private timezones: Array<string>;
  protected name = MessengerManager.name;

  constructor(options) {
    this.messengerConfig = options.messengerConfig;
    this.baseURL = this.messengerConfig?.hostname
      ? `${this.messengerConfig?.hostname}/adm/api`
      : '';
  }

  /**
   * Initializes Messenger Manager by checking if any configuration exists and testing and updating configuration if needed
   */

  public async init() {
    const logPrefix = `${this.name}::init`;

    if (this.messengerConfig && this.messengerConfig.password) {
      winston.debug(`${logPrefix} Messenger configuration is available.`);
      await this.checkMessengerRegistration();

      if (!this.loginToken) {
        winston.warn(
          `${logPrefix} Cannot setup Messenger as login token could not be obtained.`
        );
      } else if (!this.isMachineRegistered) {
        winston.debug(
          `${logPrefix} The configuration has not been registered yet, starting setup process.`
        );
        await this.setupMessengerRegistration();
      } else {
        winston.debug(
          `${logPrefix} Messenger configuration is already set correctly.`
        );
      }
    } else {
      winston.debug(`${logPrefix} No messenger configuration found.`);
    }
  }
  /**
   * Checks whether machine is registered correctly in Messenger
   */
  public async checkMessengerRegistration() {
    const logPrefix = `${this.name}::checkMessengerRegistration`;

    try {
      this.loginToken = (
        await axios.request({
          baseURL: this.baseURL,
          url: `/auth/login`,
          method: 'POST',
          data: {
            User: this.messengerConfig.username,
            Pass: this.messengerConfig.password
          }
        })
      ).data;
    } catch (err) {
      winston.warn(`${logPrefix} Cannot get login token ${err}`);
    }

    if (!this.loginToken) {
      return;
    }
    //Get machine information to check registration
    try {
      let response = (
        await axios.request({
          baseURL: this.baseURL,
          url: '/machines',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.loginToken}`
          }
        })
      ).data;

      if (response) {
        //TODO
        this.isMachineRegistered = true;
      }
    } catch (err) {
      winston.warn(`${logPrefix} Cannot read machine token ${err}`);
    }
  }
  /**
   * Updates the registration to Messenger
   */
  public async setupMessengerRegistration() {
    const logPrefix = `${this.name}::setupMessengerRegistration`;

    if (!this.loginToken) {
      //Get token
      try {
        this.loginToken = (
          await axios.request({
            baseURL: this.baseURL,
            url: '/auth/login',
            method: 'POST',
            data: {
              User: this.messengerConfig.username,
              Pass: this.messengerConfig.password
            }
          })
        ).data;
      } catch (err) {
        winston.warn(`${logPrefix} Cannot get login token ${err}`);
        return;
      }
    }

    //Read MachineCatalog
    try {
      this.machineCatalog = (
        await axios.request({
          baseURL: this.baseURL,
          url: '/machinecatalog',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.loginToken}`
          }
        })
      ).data;
    } catch (err) {
      winston.warn(`${logPrefix} Cannot read machine catalog ${err}`);
      return;
    }

    //Read MachineObject for TimezoneID
    try {
      this.machineObject = (
        await axios.request({
          baseURL: this.baseURL,
          url: '/machines/new',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.loginToken}`
          }
        })
      ).data;
    } catch (err) {
      winston.warn(`${logPrefix} Cannot read machine object ${err}`);
      return;
    }

    // Read organization units
    try {
      this.organizationUnits = (
        await axios.request({
          baseURL: this.baseURL,
          url: '/orgunits',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.loginToken}`
          }
        })
      ).data;
    } catch (err) {
      winston.warn(`${logPrefix} Cannot read organization units ${err}`);
      return;
    }

    // Read timezones
    try {
      this.timezones = (
        await axios.request({
          baseURL: this.baseURL,
          url: '/classifiers/timezones',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.loginToken}`
          }
        })
      ).data;
    } catch (err) {
      winston.warn(`${logPrefix} Cannot read timezones ${err}`);
      return;
    }

    //Create machine
    try {
      let response = (
        await axios.request({
          baseURL: this.baseURL,
          url: '/machines',
          method: 'POST',
          data: {
            MachineName: '',
            SerialNumber: '',
            LicenseNumber: '',
            MachineCatalogId: '',
            MachineImage: '',
            TimeZoneId: '',
            MTConnectAgentManagementMode: '',
            MTConnectUrl: '',
            OrgUnitId: ''
          },
          headers: {
            Authorization: `Bearer ${this.loginToken}`
          }
        })
      ).data;

      if (response) {
        this.isMachineRegistered = true;
        winston.debug(
          `${logPrefix} Machine has been registered to Messenger successfully.`
        );
      } else {
        winston.warn(`${logPrefix} Could not successfully create machine`);
      }
    } catch (err) {
      winston.warn(`${logPrefix} Cannot create machine ${err}`);
    }
  }
}
