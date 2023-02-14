import { promises as promisefs } from 'fs';
import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import { generateKeyPair } from 'crypto';
import fetch from 'node-fetch';

import {
  DataSinkProtocols,
  DataSourceProtocols,
  DeviceLifecycleEventTypes,
  EventLevels,
  IErrorEvent,
  ILifecycleEvent
} from '../../common/interfaces';
import { EventBus } from '../EventBus';
import {
  IDefaultTemplates,
  IConfig,
  IAuthConfig,
  IConfigManagerParams,
  IDataSinkConfig,
  IDataSourceConfig,
  IRuntimeConfig,
  isDataPointMapping,
  IAuthUser,
  IAuthUsersConfig,
  IDefaultTemplate,
  IMessengerServerConfig,
  IVirtualDataPointConfig
} from './interfaces';
import TypedEmitter from 'typed-emitter';
import winston from 'winston';
import { System } from '../System';
import { DataSinksManager } from '../Northbound/DataSinks/DataSinksManager';
import { DataSourcesManager } from '../Southbound/DataSources/DataSourcesManager';
import { areObjectsEqual } from '../Utilities';
import { factoryConfig } from './factoryConfig';
import { runtimeConfig } from './runtimeConfig';

const promisifiedGenerateKeyPair = promisify(generateKeyPair);

interface IConfigManagerEvents {
  newRuntimeConfig: (config: IRuntimeConfig) => void;
  configChange: () => void;
  configsLoaded: () => void;
}

type ChangeOperation = 'insert' | 'update' | 'delete';

const defaultS7DataSource: IDataSourceConfig = {
  dataPoints: [],
  protocol: DataSourceProtocols.S7,
  enabled: false,
  type: 'nck',
  connection: {
    ipAddr: '192.168.214.1',
    port: 102,
    rack: 0,
    slot: 2
  }
};
const defaultIoShieldDataSource: IDataSourceConfig = {
  dataPoints: [],
  protocol: DataSourceProtocols.IOSHIELD,
  enabled: false,
  type: 'ai-100+5di'
};
const defaultEnergyDataSource: IDataSourceConfig = {
  dataPoints: [],
  protocol: DataSourceProtocols.ENERGY,
  enabled: false,
  type: 'PhoenixEMpro',
  connection: {
    ipAddr: ''
  }
};
const defaultOpcuaDataSink: IDataSinkConfig = {
  dataPoints: [],
  enabled: false,
  protocol: DataSinkProtocols.OPCUA
};

const defaultDataHubDataSink: IDataSinkConfig = {
  dataPoints: [],
  enabled: false,
  protocol: DataSinkProtocols.DATAHUB
};

const defaultMtconnectDataSink: Omit<IDataSinkConfig, 'auth'> = {
  dataPoints: [],
  enabled: false,
  protocol: DataSinkProtocols.MTCONNECT
};

/**
 * Config for managing the app's config
 */
export class ConfigManager extends (EventEmitter as new () => TypedEmitter<IConfigManagerEvents>) {
  public id: string | null = null;

  private mdcFolder = process.env.MDC_LIGHT_FOLDER || process.cwd();
  private configFolder = path.join(this.mdcFolder, '/config');
  private keyFolder = path.join(this.mdcFolder, 'jwtkeys');
  private sslFolder = path.join(this.mdcFolder, 'sslkeys');
  private runtimeFolder = path.join(this.mdcFolder, 'runtime-files');
  private certificateFolder = path.join(this.mdcFolder, 'certs');

  private configName = 'config.json';
  private authUsersConfigName = 'auth.json';
  private privateKeyName = 'jwtRS256.key';
  private publicKeyName = 'jwtRS256.key.pub';

  private _runtimeConfig: IRuntimeConfig;
  private _config: IConfig;
  private _defaultTemplates: IDefaultTemplates;
  private _authConfig: IAuthConfig;
  private _authUsers: IAuthUsersConfig;
  #resolveConfigChanged = null;
  #configChangeCompletedPromise = null;
  private pendingEvents: string[] = [];

  private readonly errorEventsBus: EventBus<IErrorEvent>;
  private readonly lifecycleEventsBus: EventBus<ILifecycleEvent>;
  private _dataSinksManager: DataSinksManager;
  private _dataSourcesManager: DataSourcesManager;

  private static className: string = ConfigManager.name;

  public get config(): IConfig {
    return this._config;
  }

  public set config(config: IConfig) {
    this._config = config;
    this.saveConfigToFile();
  }

  public get authConfig(): IAuthConfig {
    return this._authConfig;
  }

  public get runtimeConfig(): IRuntimeConfig {
    return this._runtimeConfig;
  }

  private set runtimeConfig(config: IRuntimeConfig) {
    this._runtimeConfig = config;
    this.emit('newRuntimeConfig', this._runtimeConfig);
  }

  public get defaultTemplates(): IDefaultTemplates {
    return this._defaultTemplates;
  }

  public get authUsers(): IAuthUser[] {
    return this._authUsers.users;
  }

  public get configPath(): string {
    return path.join(this.configFolder, this.configName);
  }
  /**
   * Creates config and check types
   */
  constructor(params: IConfigManagerParams) {
    super();
    const { errorEventsBus, lifecycleEventsBus } = params;
    this.errorEventsBus = errorEventsBus;
    this.lifecycleEventsBus = lifecycleEventsBus;

    // Initial values
    this._runtimeConfig = runtimeConfig;

    this._authConfig = {
      secret: null,
      public: null
    };

    this._authUsers = {
      users: []
    };
  }

  /**
   * Initializes and parses config items
   * @param factoryReset True would indicate initialization after factory reset, default false
   */
  public async init(factoryReset = false): Promise<void> {
    const logPrefix = `${ConfigManager.className}::init`;
    winston.info(`${logPrefix} initializing.`);
    if (!factoryReset) {
      this._dataSinksManager.on(
        'dataSinksRestarted',
        this.onDataSinksRestarted.bind(this)
      );
      this._dataSourcesManager.on(
        'dataSourcesRestarted',
        this.onDataSourcesRestarted.bind(this)
      );
    } else {
      winston.warn(`${logPrefix} Factory reset requested`);

      // Remove saved auth users after factory reset
      this._authUsers = {
        users: []
      };
    }
    await this.checkConfigFolder();

    return Promise.allSettled([
      this.loadConfig<IConfig>(this.configName, factoryConfig),
      this.loadConfig<IAuthUsersConfig>(
        this.authUsersConfigName,
        this._authUsers
      ).catch(() => this._authUsers),
      this.loadTemplates(),
      this.checkJwtKeyPair()
    ])
      .then(
        ([
          configResult,
          authUsersResult,
          loadTemplatesResult,
          checkJwtKeyPairResult
        ]) => {
          if (!(configResult.status === 'rejected')) {
            this._config = configResult.value;
          }
          if (!(authUsersResult.status === 'rejected')) {
            this._authUsers = authUsersResult.value;
          }

          return this.loadJwtKeyPair();
        }
      )
      .then((keys) => {
        this._authConfig = {
          secret: keys.privateKey,
          public: keys.publicKey
        };
        this.setupDefaultDataSources();
        this.setupDefaultDataSinks();
      })
      .then(() => {
        this.checkType(
          this.runtimeConfig.mtconnect.listenerPort,
          'number',
          'runtime.mtconnect.listenerPort'
        );
        this.checkType(
          this.runtimeConfig.restApi.port,
          'number',
          'runtime.restApi.port'
        );
      })
      .then(() => {
        winston.info(`${logPrefix} config loaded.`);
        this.emit('configsLoaded');
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  /**
   * Creates config folder if not existing
   */
  async checkConfigFolder() {
    if (!fs.existsSync(this.configFolder)) {
      fs.mkdirSync(this.configFolder);
    }
  }

  /**
   * Adds missing data sources on startup
   */
  public setupDefaultDataSources() {
    const sources = [
      defaultS7DataSource,
      defaultIoShieldDataSource,
      defaultEnergyDataSource
    ];

    this._config = {
      ...this._config,
      dataSources: [
        ...this._config.dataSources,
        // Add missing sources
        ...sources.filter(
          (source) =>
            !this._config.dataSources.some(
              (x) => x.protocol === source.protocol
            )
        )
      ]
    };
  }

  /**
   * Adds missing data sink on startup
   */
  public setupDefaultDataSinks() {
    const sinks = [
      defaultOpcuaDataSink,
      defaultMtconnectDataSink,
      defaultDataHubDataSink
    ];

    this._config = {
      ...this._config,
      dataSinks: [
        ...this._config.dataSinks,
        // Add missing sinks
        ...sinks.filter(
          (sink) =>
            !this._config.dataSinks.some((x) => x.protocol === sink.protocol)
        )
      ]
    };
  }

  /**
   * Factory reset. Possible errors are handled by the caller, in BootstrapManager.start()
   */
  public async factoryResetConfiguration() {
    const authConfig = path.join(this.configFolder, this.authUsersConfigName);

    const confAgentAddress =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:1884'
        : 'http://172.17.0.1:1884';

    const factoryProxy = {
      enabled: false,
      host: '',
      port: 0,
      username: '',
      password: '',
      whitelist: ['']
    };
    await fetch(`${confAgentAddress}/network/proxy`, {
      method: 'PUT',
      body: JSON.stringify(factoryProxy)
    });

    const factoryNtp = [''];
    await fetch(`${confAgentAddress}/network/ntp`, {
      method: 'PUT',
      body: JSON.stringify(factoryNtp)
    });

    const factoryNetworkAdapters = [
      {
        id: 'enoX1',
        displayName: '',
        enabled: true,
        ipv4Settings: {
          enabled: true,
          dhcp: true,
          ipAddresses: [
            {
              Address: '',
              Netmask: ''
            }
          ],
          defaultGateway: '',
          dnsserver: ['']
        },
        ipv6Settings: {
          enabled: false,
          dhcp: false,
          ipAddresses: [
            {
              Address: '',
              Netmask: ''
            }
          ],
          defaultGateway: '',
          dnsserver: ['']
        },
        macAddress: '',
        ssid: ''
      },
      {
        id: 'enoX2',
        displayName: '',
        enabled: true,
        ipv4Settings: {
          enabled: true,
          dhcp: false,
          ipAddresses: [
            {
              Address: '192.168.214.230',
              Netmask: '24'
            }
          ],
          defaultGateway: '',
          dnsserver: ['']
        },
        ipv6Settings: {
          enabled: false,
          dhcp: false,
          ipAddresses: [
            {
              Address: '',
              Netmask: ''
            }
          ],
          defaultGateway: '',
          dnsserver: ['']
        },
        macAddress: '',
        ssid: ''
      }
    ];

    await Promise.all(
      factoryNetworkAdapters.map((adapterSettings) =>
        fetch(`${confAgentAddress}/network/adapters/${adapterSettings.id}`, {
          method: 'PUT',
          body: JSON.stringify(adapterSettings)
        })
      )
    );

    await promisefs.rm(authConfig, { force: true });
    await promisefs.rm(path.join(this.keyFolder, this.privateKeyName), {
      force: true
    });
    await promisefs.rm(path.join(this.keyFolder, this.publicKeyName), {
      force: true
    });
    await promisefs.rm(path.join(this.sslFolder, 'ssl.crt'), { force: true });
    await promisefs.rm(path.join(this.sslFolder, 'ssl_private.key'), {
      force: true
    });

    if (fs.existsSync(this.certificateFolder)) {
      let certFiles = await promisefs.readdir(this.certificateFolder);
      await Promise.all(
        certFiles.map((fileOrFolderName) =>
          promisefs.rm(path.join(this.certificateFolder, fileOrFolderName), {
            recursive: true,
            force: true
          })
        )
      );
    }
    await this.saveConfig(factoryConfig, true);
    await this.init(true);
  }

  /**
   * Applies template settings.
   */
  public applyTemplate(templateFileName: string) {
    const template = this._defaultTemplates.templates.find(
      (x) => x.id === templateFileName
    );

    this._config = {
      ...this._config,
      ...template,
      quickStart: {
        completed: true,
        currentTemplate: templateFileName,
        currentTemplateName: template.name
      }
    };

    this.setupDefaultDataSources();
    this.setupDefaultDataSinks();

    this.config = this._config;
  }

  /**
   * Filters mapping array depends on enabled dataSources & dataSinks.
   */
  public getFilteredMapping() {
    const dataSourceDataPoints: string[] = [];
    this.config.dataSources.forEach((dataSource) =>
      dataSource.dataPoints.forEach((dp) => dataSourceDataPoints.push(dp.id))
    );

    const dataSinkDataPoints: string[] = [];
    this.config.dataSinks.forEach((dataSink) =>
      dataSink.dataPoints.forEach((dp) => dataSinkDataPoints.push(dp.id))
    );

    const vdps: string[] = this.config.virtualDataPoints.map((vdp) => vdp.id);

    return this.config.mapping.filter((m) => {
      // Remove mappings if the source or target data point doesn't exist.
      // TODO: That shouldn't happen at all. Modify "delete" handlers of sinks and sources to remove mappings if a removed data point was mapped.
      const sourceExists =
        dataSourceDataPoints.includes(m.source) || vdps.includes(m.source);
      const targetExists = dataSinkDataPoints.includes(m.target);

      return sourceExists && targetExists;
    });
  }

  /**
   * Checks type of configuration value.
   */
  private checkType(value: any, type: string, name: string) {
    if (!(typeof value === type)) {
      const error = `Value for ${name} must be of type ${type}!`;
      this.errorEventsBus.push({
        id: 'device',
        type: DeviceLifecycleEventTypes.ErrorOnParseLocalConfig,
        level: EventLevels.Device,
        payload: error
      });
      throw new Error(error);
    }
  }

  /**
   * Loads config files by filename and adds missing values
   */
  private loadConfig<ConfigType>(
    configName: string,
    defaultConfig: any
  ): Promise<ConfigType> {
    const logPrefix = `${ConfigManager.className}::loadConfig`;
    const configPath = path.join(this.configFolder, configName);

    winston.debug(`${logPrefix} loading config ${configPath}`);

    return promisefs
      .readFile(configPath, { encoding: 'utf-8' })
      .catch(() => {
        this.lifecycleEventsBus.push({
          id: 'device',
          type: DeviceLifecycleEventTypes.DeviceConfigDoesNotExists,
          level: EventLevels.Device,
          payload: `Configuration file does not exist!`
        });
        return Promise.reject(
          new Error(
            `${logPrefix} error due to ${DeviceLifecycleEventTypes.DeviceConfigDoesNotExists}`
          )
        );
      })
      .then((file) => {
        return JSON.parse(file);
      })
      .catch((error) => {
        winston.error(
          `${logPrefix} Invalid json file ${configPath}. Using default config`
        );
        return defaultConfig;
      })
      .then((parsedFile) => {
        // Make a copy of the defaultConfig to avoid overwriting it
        const mergedFile = this.mergeDeep(
          JSON.parse(JSON.stringify(defaultConfig)),
          parsedFile
        );
        return mergedFile;
      })
      .catch((error) => {
        this.lifecycleEventsBus.push({
          id: 'device',
          type: DeviceLifecycleEventTypes.ErrorOnParseLocalConfig,
          level: EventLevels.Device,
          payload: `Error loading config file ${configPath}`
        });
        return Promise.reject(error);
      });
  }

  private async loadJwtKeyPair(): Promise<{
    privateKey: string;
    publicKey: string;
  }> {
    const logPrefix = `${ConfigManager.className}::loadJwtPrivateKey`;
    winston.info(`${logPrefix} loading jwt key pair.`);

    try {
      const privateKeyPath = path.join(this.keyFolder, this.privateKeyName);
      const publicKeyPath = path.join(this.keyFolder, this.publicKeyName);
      const privateKey = await promisefs.readFile(privateKeyPath, 'utf8');
      const publicKey = await promisefs.readFile(publicKeyPath, 'utf8');

      return {
        privateKey,
        publicKey
      };
    } catch (err) {
      return null;
    }
  }

  /**
   * Loads default template by filename
   */
  private async loadTemplate(templateName) {
    try {
      const configPath = path.join(
        this.runtimeFolder,
        'templates',
        templateName
      );
      return JSON.parse(
        await promisefs.readFile(configPath, { encoding: 'utf-8' })
      );
    } catch (err) {
      return null;
    }
  }

  private async loadTemplates() {
    try {
      const templateNames = await promisefs.readdir(
        path.join(this.runtimeFolder, 'templates'),
        { encoding: 'utf-8' }
      );

      const templates = await Promise.all<IDefaultTemplate>(
        templateNames.map((template) =>
          this.loadTemplate(template).then((data) => ({
            ...data,
            id: template
          }))
        )
      );

      this._defaultTemplates = {
        templates
      };
    } catch {
      this._defaultTemplates = {
        templates: []
      };
    }
  }

  /**
   * Simple object check.
   * @param item
   * @returns {boolean}
   */
  private isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Deep merge two objects.
   */
  private mergeDeep(target: object, ...sources: object[]) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.mergeDeep(target, ...sources);
  }

  /**
   * bulk config dataSource changes.
   */
  public async bulkChangeDataSourceDataPoints(
    protocol: DataSourceProtocols,
    changes: any
  ): Promise<void> {
    const { created, updated, deleted } = changes;

    const dataSource = this._config.dataSources.find(
      (ds) => ds.protocol === protocol
    );

    if (created) {
      dataSource.dataPoints.push(
        ...Object.values<any>(created).map((item) => ({
          ...item,
          id: uuidv4()
        }))
      );
    }

    if (updated) {
      dataSource.dataPoints.forEach((dp) => {
        if (updated[dp.id]) {
          Object.assign(dp, updated[dp.id]);
        }
      });
    }

    if (deleted) {
      dataSource.dataPoints = dataSource.dataPoints.filter(
        (dp) => !deleted.includes(dp.id)
      );
    }

    await this.saveConfigToFile();
  }

  /**
   * bulk config dataSink changes.
   */
  public async bulkChangeDataSinkDataPoints(
    protocol: DataSinkProtocols,
    changes: any
  ): Promise<void> {
    const { created, updated, deleted } = changes;

    const dataSink = this._config.dataSinks.find(
      (ds) => ds.protocol === protocol
    );

    if (created) {
      dataSink.dataPoints.push(
        ...Object.values<any>(created).map((item) => ({
          ...item,
          id: uuidv4()
        }))
      );
    }

    if (updated) {
      dataSink.dataPoints.forEach((dp) => {
        if (updated[dp.id]) {
          Object.assign(dp, updated[dp.id]);
        }
      });
    }

    if (deleted) {
      dataSink.dataPoints = dataSink.dataPoints.filter(
        (dp) => !deleted.includes(dp.id)
      );
    }

    await this.saveConfigToFile();
  }

  /**
   * Update messenger config
   */
  public async updateMessengerConfig(
    incomingMessengerConfig: IMessengerServerConfig
  ): Promise<void> {
    const logPrefix = `${ConfigManager.name}::updateMessengerConfig`;
    const config = this._config;
    let newMessengerConfig = {
      ...config.messenger,
      ...incomingMessengerConfig,
      password:
        incomingMessengerConfig.password?.length > 0
          ? incomingMessengerConfig.password
          : config.messenger.password
    };
    if (
      newMessengerConfig.hostname.length > 5 &&
      !newMessengerConfig.hostname.startsWith('http://') &&
      !newMessengerConfig.hostname.startsWith('https://')
    ) {
      newMessengerConfig.hostname = `http://${incomingMessengerConfig.hostname}`;
    }
    if (
      areObjectsEqual(newMessengerConfig, config.messenger) &&
      this._dataSinksManager.messengerManager.serverStatus.registration ===
        'registered'
    ) {
      winston.debug(
        `${logPrefix} Config change has no update to messenger configuration`
      );
      return;
    }

    config.messenger = newMessengerConfig;
    await this.saveConfigToFile();
    await this.configChangeCompleted();
  }

  /**
   * bulk config mapping changes.
   */
  public async bulkChangeMapings(changes: any): Promise<void> {
    const { created, updated, deleted } = changes;

    if (created) {
      this._config.mapping.push(
        ...Object.values<any>(created).map((item) => ({
          ...item,
          id: uuidv4()
        }))
      );
    }

    if (updated) {
      this._config.mapping.forEach((dp) => {
        if (updated[dp.id]) {
          Object.assign(dp, updated[dp.id]);
        }
      });
    }

    if (deleted) {
      this._config.mapping = this._config.mapping.filter(
        (dp) => !deleted.includes(dp.id)
      );
    }

    await this.saveConfigToFile();
  }

  /**
   * change the config with a given object or change it.
   */
  public changeConfig<
    Category extends keyof IConfig,
    DataType extends IConfig[Category]
  >(
    operation: ChangeOperation,
    configCategory: Category,
    // @ts-ignore // TODO Remove ts-ignore
    data: DataType[number] | string,
    // @ts-ignore // TODO Remove ts-ignore
    selector: (item: DataType[number]) => string = (item) => item.id
  ) {
    const logPrefix = `${this.constructor.name}::changeConfig`;
    if (operation === 'delete' && typeof data !== 'string')
      throw new Error(`${logPrefix} error due try to delete without id.`); // Combination actually not defined in type def.

    const categoryArray = this.config[configCategory];

    if (!Array.isArray(categoryArray)) return;

    switch (operation) {
      case 'insert': {
        if (typeof data !== 'string') {
          // @ts-ignore TODO: Fix data type
          const index = categoryArray.findIndex(
            (entry) => selector(entry) === selector(data)
          );
          if (index < 0) {
            //@ts-ignore
            categoryArray.push(data);
          }
        }
        break;
      }
      case 'update': {
        if (typeof data === 'string' || isDataPointMapping(data))
          throw new Error();
        // @ts-ignore
        const index = categoryArray.findIndex(
          (entry) => selector(entry) === selector(data)
        );
        if (index < 0) throw Error(`No Entry found`); //TODO:
        const change = categoryArray[index];
        categoryArray.splice(index, 1);
        //@ts-ignore
        categoryArray.push(data);
        break;
      }
      case 'delete': {
        const index = categoryArray.findIndex(
          (entry) => selector(entry) === data
        );
        if (index < 0) throw Error(`No Entry found`); //TODO:
        const change = categoryArray[index];
        categoryArray.splice(index, 1);
        break;
      }
      default: {
        throw new Error();
      }
    }
    this.saveConfigToFile();
  }

  /**
   * Save the current data from config property into a JSON config file on hard drive
   */
  private saveConfigToFile(): Promise<void> {
    const logPrefix = `${ConfigManager.className}::saveConfigToFile`;

    const file = path.join(this.configFolder, this.configName);
    const content = JSON.stringify(this._config, null, 2);

    winston.debug(
      `${logPrefix} Saving ${content.length} bytes to config ${file}`
    );

    return promisefs
      .writeFile(file, content, { encoding: 'utf-8' })
      .then(() => {
        winston.info(
          `${logPrefix} Saved ${content.length} bytes to config ${file}`
        );

        this.addPendingConfigChangedEvents();
        this.emit('configChange');
      })
      .catch((err) => {
        winston.error(`${logPrefix} error due to ${err.message}`);
      });
  }

  /**
   * Save the current data from config property into a JSON config file on hard drive
   * @param obj full or partial config object to use for saving
   * @param replace True would replace existing config with given obj. Default is false and it merges obj and existing config
   */
  public saveConfig(
    obj: Partial<IConfig> = null,
    replace = false
  ): Promise<void> {
    const logPrefix = `${ConfigManager.className}::saveConfig`;

    if (obj) {
      if (replace) {
        this._config = obj as IConfig;
      } else {
        this._config = this.mergeDeep(this._config, obj);
      }
    }

    winston.debug(`${logPrefix}`);

    return this.saveConfigToFile();
  }

  // reads terms and conditions
  async getTermsAndConditions(lang: string) {
    const terms = await promisefs
      .readFile(
        path.join(this.runtimeFolder, 'terms', 'eula', `eula_${lang}.txt`),
        { encoding: 'utf-8' }
      )
      .then((data) => data)
      .catch(() => '');

    return terms;
  }

  /**
   * Save the current data from auth config property into a JSON config file on hard drive
   */
  saveAuthConfig(): Promise<void> {
    const logPrefix = `${ConfigManager.className}::saveAuthConfig`;

    return promisefs
      .writeFile(
        path.join(this.configFolder, this.authUsersConfigName),
        JSON.stringify(this._authUsers, null, 2),
        { encoding: 'utf-8' }
      )
      .then(() => {
        winston.info(
          `${ConfigManager.className}::saveConfigToFile saved new config to file`
        );
      })
      .catch((err) => {
        winston.error(`${logPrefix} error due to ${JSON.stringify(err)}`);
      });
  }

  /**
   * Save configFile content into config
   */
  restoreConfigFile(configFile) {
    const buffer = configFile.data;

    this.config = JSON.parse(buffer.toString());
  }

  /**
   * Returns system information
   */
  public async getSystemInformation() {
    const system = new System();
    const osVersion = await system.readOsVersion();
    return [
      {
        title: 'General system information',
        items: [
          // {
          //   key: 'Board serial number',
          //   keyDescription: '',
          //   value: await system.readSerialNumber(),
          //   valueDescription: 'Serial number'
          // },
          {
            key: 'Mac address X1',
            keyDescription: '',
            value: await system.readMacAddress('eth0'),
            valueDescription: 'Mac address'
          },
          {
            key: 'Mac address X2',
            keyDescription: '',
            value: await system.readMacAddress('eth1'),
            valueDescription: 'Mac address'
          }
        ]
      },
      {
        title: 'Installed software components',
        items: [
          {
            key: 'IoT connector flex runtime version',
            keyDescription: 'Software component',
            value: process.env.MDC_LIGHT_RUNTIME_VERSION || 'unknown',
            valueDescription: null
          },
          {
            key: 'IoT connector flex ui version',
            keyDescription: 'Software component',
            value: '$ui_version$', // to be replaces inside frontend
            valueDescription: null
          },
          {
            key: 'CELOS version',
            keyDescription: 'Operating System',
            value: osVersion,
            valueDescription: null
          },
          {
            key: 'MTConnect agent version',
            keyDescription: 'Software component',
            value: '1.7.0.7',
            valueDescription: 'Schema version: 1.3'
          }
        ]
      }
    ];
  }

  set dataSinksManager(manager: DataSinksManager) {
    this._dataSinksManager = manager;
  }

  set dataSourcesManager(manager: DataSourcesManager) {
    this._dataSourcesManager = manager;
  }

  /**
   * Adds all required pending events to the list
   */
  private addPendingConfigChangedEvents() {
    this.addPendingEvent('dataSourcesRestarted');
    this.addPendingEvent('dataSinksRestarted');
  }

  /**
   * Handle the "dataSourcesRestarted" event
   * @param error
   */
  private onDataSourcesRestarted(error: Error | null) {
    const logPrefix = `${ConfigManager.className}::onDataSourcesRestarted`;
    winston.info(`${logPrefix} data sources restarted!`);
    this.removePendingEvent('dataSourcesRestarted');
    this.resolveConfigChanged(error);
  }

  /**
   * Hanldes the "dataSinksRestarted" event
   * @param error
   */
  private onDataSinksRestarted(error: Error | null) {
    const logPrefix = `${ConfigManager.className}::onDataSinksRestarted`;
    winston.info(`${logPrefix} data sinks restarted!`);
    this.removePendingEvent('dataSinksRestarted');
    this.resolveConfigChanged(error);
  }

  /**
   * Adds a pending event to the list
   * @param eventName
   */
  private addPendingEvent(eventName: string) {
    if (!this.pendingEvents.includes(eventName))
      this.pendingEvents.push(eventName);
  }

  /**
   *
   * @param eventName Removes an pending event for the list
   */
  private removePendingEvent(eventName: string) {
    this.pendingEvents = this.pendingEvents.filter(
      (tmpEventName) => tmpEventName !== eventName
    );
  }

  /**
   * Should be called after every restarted event.
   * Rejects if an error was thrown during restart.
   * Resolves if all restart events where fired
   * @param error
   */
  private resolveConfigChanged(error: Error | null) {
    const logPrefix = `${ConfigManager.className}::resolveConfigChanged`;

    if (error) {
      winston.warn(
        `${logPrefix} rejecting configuration change with error: ${JSON.stringify(
          error
        )}`
      );
      if (this.#resolveConfigChanged) this.#resolveConfigChanged();
    }

    if (this.pendingEvents.length === 0) {
      winston.info(`${logPrefix} resolving configuration change!`);
      if (this.#resolveConfigChanged) this.#resolveConfigChanged();
      this.#resolveConfigChanged = null;
      this.#configChangeCompletedPromise = null;
      this.pendingEvents = [];
    }
  }

  /**
   * Waits for restarting events after an configuration change. Timeout if not all events were fired in 60sec
   * @returns
   */
  public configChangeCompleted(): Promise<void> {
    const logPrefix = `${ConfigManager.className}::configChangeCompleted`;

    if (this.#configChangeCompletedPromise)
      return this.#configChangeCompletedPromise;

    if (this.pendingEvents.length === 0) return;

    this.#configChangeCompletedPromise = Promise.race([
      new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          winston.warn(
            `${logPrefix} timed out while waiting for config change.`
          );
          this.#resolveConfigChanged = null;
          this.#configChangeCompletedPromise = null;
          resolve();
        }, 60000);
      }),
      new Promise((resolve, reject) => {
        this.#resolveConfigChanged = resolve;
      })
    ]);

    return this.#configChangeCompletedPromise;
  }

  async checkJwtKeyPair() {
    const logPrefix = `${ConfigManager.className}::checkJwtKeyPair`;

    winston.debug(`${logPrefix} checking JWT keys.`);
    if (fs.existsSync(this.keyFolder)) {
      const files = (await fs.readdirSync(this.keyFolder)) as string[];
      if (
        files.includes(this.publicKeyName) &&
        files.includes(this.privateKeyName)
      ) {
        winston.info(`${logPrefix} valid jwt key pair found.`);
        return;
      }
    }

    winston.info(`${logPrefix} no valid jwt key pair found.`);

    await this.generateJwtKeyPair();
  }

  async generateJwtKeyPair() {
    const logPrefix = `${ConfigManager.className}::generateJwtKeyPair`;
    winston.info(`${logPrefix} generating jwt key pair.`);

    if (!fs.existsSync(this.keyFolder)) fs.mkdirSync(this.keyFolder);

    const modulusLength = 4096;
    const publicKeyEncoding: any = {
      type: 'spki',
      format: 'pem'
    };
    const privateKeyEncoding: any = {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: ''
    };

    const { publicKey, privateKey } = await promisifiedGenerateKeyPair('rsa', {
      modulusLength,
      privateKeyEncoding,
      publicKeyEncoding
    });

    const publicKeyPath = path.join(this.keyFolder, this.publicKeyName);
    const privateKeyPath = path.join(this.keyFolder, this.privateKeyName);

    await promisefs.writeFile(publicKeyPath, publicKey);
    await promisefs.writeFile(privateKeyPath, privateKey);
  }
}
