import { promises as fs } from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
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
  IDefaultTemplate
} from './interfaces';
import TypedEmitter from 'typed-emitter';
import winston from 'winston';
import { System } from '../System';
import { DataSinksManager } from '../Northbound/DataSinks/DataSinksManager';
import { DataSourcesManager } from '../Southbound/DataSources/DataSourcesManager';

interface IConfigManagerEvents {
  newConfig: (config: IConfig) => void;
  newRuntimeConfig: (config: IRuntimeConfig) => void;
  configChange: () => void;
  configsLoaded: () => void;
}

type ChangeOperation = 'insert' | 'update' | 'delete';

const defaultS7DataSource: IDataSourceConfig = {
  name: '',
  dataPoints: [],
  protocol: DataSourceProtocols.S7,
  connection: {
    ipAddr: '192.168.214.1',
    port: 102,
    rack: 0,
    slot: 2
  },
  enabled: false
};
const defaultIoShieldDataSource: IDataSourceConfig = {
  name: '',
  dataPoints: [],
  protocol: DataSourceProtocols.IOSHIELD,
  enabled: false
};
const defaultOpcuaDataSink: IDataSinkConfig = {
  name: '',
  dataPoints: [],
  enabled: false,
  protocol: DataSinkProtocols.OPCUA
};

const defaultDataHubDataSink: IDataSinkConfig = {
  name: '',
  dataPoints: [],
  enabled: false,
  protocol: DataSinkProtocols.DATAHUB,
  datahub: {
    provisioningHost: '',
    scopeId: '',
    regId: '',
    symKey: ''
  }
};

const defaultMtconnectDataSink: Omit<IDataSinkConfig, 'auth'> = {
  name: '',
  dataPoints: [],
  enabled: false,
  protocol: DataSinkProtocols.MTCONNECT
};

export const emptyDefaultConfig: IConfig = {
  general: {
    manufacturer: '',
    serialNumber: '',
    model: '',
    control: ''
  },
  networkConfig: {
    x1: {},
    x2: {}
  },
  dataSources: [],
  dataSinks: [],
  virtualDataPoints: [],
  mapping: [],
  quickStart: {
    currentTemplate: null,
    currentTemplateName: null,
    completed: false
  }
};

/**
 * Config for managing the app's config
 */
export class ConfigManager extends (EventEmitter as new () => TypedEmitter<IConfigManagerEvents>) {
  public id: string | null = null;
  private configFolder = path.join(
    process.env.MDC_LIGHT_FOLDER || process.cwd(),
    'mdclight/config'
  );
  private configName = 'config.json';

  private runtimeConfigName = 'runtime.json';
  private authUsersConfigName = 'auth.json';
  private _runtimeConfig: IRuntimeConfig;
  private _config: IConfig;
  private _defaultTemplates: IDefaultTemplates;
  private _authConfig: IAuthConfig;
  private _authUsers: IAuthUsersConfig;
  #resolveConfigChanged = null;
  #rejectConfigChanged = null;
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
    this.emit('newConfig', this.config);
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
    this._runtimeConfig = {
      users: [],
      systemInfo: [],
      mtconnect: {
        listenerPort: 7878
      },
      opcua: {
        port: 4840,
        nodesetDir: ''
      },
      restApi: {
        port: 5000,
        maxFileSizeByte: 20000000
      },
      auth: {
        expiresIn: 60 * 60,
        defaultPassword: ''
      },
      datahub: {
        serialNumber: 'No serial number found', // TODO Use mac address?
        groupDevice: false,
        signalGroups: undefined,
        dataPointTypesData: {
          probe: {
            intervalHours: undefined
          },
          telemetry: {
            intervalHours: undefined
          }
        }
      }
    };

    this._authConfig = {
      secret: null
    };

    this._config = emptyDefaultConfig;

    this._authUsers = {
      users: []
    };
  }

  /**
   * Initializes and parses config items
   */
  public init(): Promise<void> {
    const logPrefix = `${ConfigManager.className}::init`;
    winston.info(`${logPrefix} initializing.`);

    this._dataSinksManager.on(
      'dataSinksRestarted',
      this.onDataSinksRestarted.bind(this)
    );
    this._dataSourcesManager.on(
      'dataSourcesRestarted',
      this.onDataSourcesRestarted.bind(this)
    );

    return Promise.all([
      this.loadConfig<IRuntimeConfig>(
        this.runtimeConfigName,
        this.runtimeConfig
      ),
      this.loadConfig<IConfig>(this.configName, this.config),
      this.loadConfig<IAuthUsersConfig>(
        this.authUsersConfigName,
        this._authUsers
      ).catch(() => this._authUsers),
      this.loadTemplates()
    ])
      .then(([runTime, config, authUsers]) => {
        this._runtimeConfig = runTime;
        this._config = config;

        this._authUsers = authUsers;

        return this.loadJwtPrivateKey();
      })
      .then((secret) => {
        this._authConfig = {
          secret
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
   * Adds missing data sources on startup
   */
  public setupDefaultDataSources() {
    const sources = [defaultS7DataSource, defaultIoShieldDataSource];

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
   * Applies template settings.
   */
  public applyTemplate(
    templateFileName: string,
    dataSources: string[],
    dataSinks: string[]
  ) {
    const template = this._defaultTemplates.templates.find(
      (x) => x.id === templateFileName
    );
    const sources = template.dataSources.filter((x) =>
      dataSources.includes(x.protocol)
    );
    const sinks = template.dataSinks.filter((x) =>
      dataSinks.includes(x.protocol)
    );

    this._config = {
      ...this._config,
      dataSources: sources,
      dataSinks: sinks,
      virtualDataPoints: template.virtualDataPoints,
      mapping: template.mapping,
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
    const enabledDataPointsOfDataSources = this.config.dataSources
      .filter((x) => x.enabled)
      .map((x) => x.dataPoints.map((y) => y.id))
      .flat();

    const enabledDataPointsOfDataSinks = this.config.dataSinks
      .filter((x) => x.enabled)
      .map((x) => x.dataPoints.map((y) => y.id))
      .flat();

    const vdps = this.config.virtualDataPoints.map((x) => x.id);

    return this.config.mapping.filter((m) => {
      const sourceExists =
        enabledDataPointsOfDataSources.includes(m.source) ||
        vdps.includes(m.source);
      const targetExists = enabledDataPointsOfDataSinks.includes(m.target);

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

    return Promise.all([fs.readFile(configPath, { encoding: 'utf-8' })])
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
      .then(([file]) => {
        return JSON.parse(file);
      })
      .catch((error) => {
        winston.error(`${logPrefix} Invalid json file ${configPath}`);
        return Promise.reject(error);
      })
      .then((parsedFile) => {
        return this.mergeDeep(defaultConfig, parsedFile);
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

  private loadJwtPrivateKey(): Promise<string> {
    try {
      const configPath = path.join(this.configFolder, 'keys', 'jwtRS256.key');
      return fs.readFile(configPath, 'utf8');
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
        this.configFolder,
        'templates',
        templateName
      );
      return JSON.parse(await fs.readFile(configPath, { encoding: 'utf-8' }));
    } catch (err) {
      return null;
    }
  }

  private async loadTemplates() {
    try {
      const templateNames = await fs.readdir(
        path.join(this.configFolder, 'templates'),
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
   * bulk config VDP changes.
   */
  public async bulkChangeVirtualDataPoints(changes: any): Promise<void> {
    const { created, updated, deleted } = changes;

    if (created) {
      this._config.virtualDataPoints.push(
        ...Object.values<any>(created).map((item) => ({
          ...item,
          id: uuidv4()
        }))
      );
    }

    if (updated) {
      this._config.virtualDataPoints.forEach((dp) => {
        if (updated[dp.id]) {
          Object.assign(dp, updated[dp.id]);
        }
      });
    }

    if (deleted) {
      this._config.virtualDataPoints = this._config.virtualDataPoints.filter(
        (dp) => !deleted.includes(dp.id)
      );
    }

    await this.saveConfigToFile();
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

    return fs
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
   */
  public saveConfig(obj: Partial<IConfig> = null): void {
    const logPrefix = `${ConfigManager.className}::saveConfig`;

    if (obj) {
      this._config = this.mergeDeep(this._config, obj);
    }

    winston.debug(`${logPrefix}`);

    this.saveConfigToFile();
  }

  /**
   * Save the current data from auth config property into a JSON config file on hard drive
   */
  saveAuthConfig(): Promise<void> {
    const logPrefix = `${ConfigManager.className}::saveAuthConfig`;

    return fs
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
            valueDescription: 'Mac adress'
          },
          {
            key: 'Mac address X2',
            keyDescription: '',
            value: await system.readMacAddress('eth1'),
            valueDescription: 'Mac adress'
          }
        ]
      },
      ...this.runtimeConfig.systemInfo
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
    // this.addPendingEvent('dataSourcesRestarted'); // TODO Enable if datasources are also reinitialising
    this.addPendingEvent('dataSinksRestarted');
  }

  /**
   * Handle the "dataSourcesRestarted" event
   * @param error
   */
  private onDataSourcesRestarted(error: Error | null) {
    const logPrefix = `${ConfigManager.className}::onDataSinksRestarted`;
    winston.warn(`${logPrefix} data sources restarted!`);
    this.removePendingEvent('dataSourcesRestarted');
    this.resolveConfigChanged(error);
  }

  /**
   * Hanldes the "dataSinksRestarted" event
   * @param error
   */
  private onDataSinksRestarted(error: Error | null) {
    const logPrefix = `${ConfigManager.className}::onDataSinksRestarted`;
    winston.warn(`${logPrefix} data sinks restarted!`);
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
    if (error) {
      if (this.#rejectConfigChanged) this.#rejectConfigChanged(error);
      this.#resolveConfigChanged = null;
      this.#rejectConfigChanged = null;
      this.pendingEvents = [];
    }

    if (this.pendingEvents.length === 0) {
      if (this.#resolveConfigChanged) this.#resolveConfigChanged(error);
      this.#resolveConfigChanged = null;
      this.#rejectConfigChanged = null;
      this.pendingEvents = [];
    }
  }

  /**
   * Waits for restarting events after an configuration change. Timeout if not all events were fired in 60sec
   * @returns
   */
  public configChangeCompleted(): Promise<void> {
    const logPrefix = `${ConfigManager.className}::configChangeCompleted`;

    if (!this.#configChangeCompletedPromise)
      return this.#configChangeCompletedPromise;

    if (this.pendingEvents.length === 0) return;

    this.#configChangeCompletedPromise = Promise.race([
      new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          winston.warn(
            `${logPrefix} timed out while waiting for config change.`
          );
          this.#resolveConfigChanged = null;
          this.#rejectConfigChanged = null;
          reject(new Error('Timeout while waiting for config change.'));
        }, 60000);
      }),
      new Promise((resolve, reject) => {
        this.#resolveConfigChanged = resolve;
        this.#rejectConfigChanged = reject;
      })
    ]);

    return this.#configChangeCompletedPromise;
  }
}
