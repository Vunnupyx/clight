import { promises as fs, readFileSync } from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import {
  DataSinkProtocols,
  DataSourceProtocols,
  DeviceLifecycleEventTypes,
  EventLevels,
  IErrorEvent,
  ILifecycleEvent
} from '../../common/interfaces';
import { EventBus } from '../EventBus';
import { unique } from '../Utilities';
import {
  IDefaultTemplates,
  IConfig,
  IAuthConfig,
  IConfigManagerParams,
  IDataSinkConfig,
  IDataSourceConfig,
  IOpcuaDataSinkConfig,
  IRuntimeConfig,
  isDataPointMapping,
  IAuthUser,
  IAuthUsersConfig,
  IDefaultTemplate
} from './interfaces';
import TypedEmitter from 'typed-emitter';
import winston from 'winston';

interface IConfigManagerEvents {
  newConfig: (config: IConfig) => void;
  newRuntimeConfig: (config: IRuntimeConfig) => void;
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
  systemInfo: [],
  quickStart: {
    completed: false // TODO Set false when template implementation is finished
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

  private readonly errorEventsBus: EventBus<IErrorEvent>;
  private readonly lifecycleEventsBus: EventBus<ILifecycleEvent>;

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

    this.config = {
      ...this._config,
      dataSources: sources,
      dataSinks: sinks,
      quickStart: {
        completed: true
      }
    };
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
   * change the config with a given object or change it.
   */
  public changeConfig<
    Category extends keyof IConfig,
    DataType extends IConfig[Category]
  >(
    operation: ChangeOperation,
    configCategory: Category,
    // @ts-ignore // TODO @markus pls fix
    data: DataType[number] | string,
    // @ts-ignore // TODO @markus pls fix
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
        if (index < 0) throw Error(`NO Entry found`); //TODO:
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

    return fs
      .writeFile(file, content, { encoding: 'utf-8' })
      .then(() => {
        winston.info(
          `${logPrefix} Saved ${content.length} bytes to config ${file}`
        );
      })
      .catch((err) => {
        winston.error(`${logPrefix} error due to ${JSON.stringify(err)}`);
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
}
