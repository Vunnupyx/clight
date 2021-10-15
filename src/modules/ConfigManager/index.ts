import fs from 'fs';
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
import {
  IDefaultTemplates,
  IConfig,
  IConfigManagerParams,
  IDataSinkConfig,
  IDataSourceConfig,
  IOpcuaDataSinkConfig,
  IRuntimeConfig,
  isDataPointMapping
} from './interfaces';
import TypedEmitter from 'typed-emitter';
import winston from 'winston';

interface IConfigManagerEvents {
  newConfig: (config: IConfig) => void;
  newRuntimeConfig: (config: IRuntimeConfig) => void;
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
  protocol: DataSinkProtocols.DATAHUB
};

const defaultMtconnectDataSink: Omit<IDataSinkConfig, 'auth'> = {
  name: '',
  dataPoints: [],
  enabled: false,
  protocol: DataSinkProtocols.MTCONNECT
};


export const emptyDefaultConfig = {
  general: {
    manufacturer: '',
    serialNumber: '',
    model: '',
    control: ''
  },
  networkConfig: {
    x1: {},
    x2: {},
    proxy: {}
  },
  dataSources: [],
  dataSinks: [],
  virtualDataPoints: [],
  mapping: [],
  systemInfo: [],
  templates: {
    completed: true // TODO Set false when template implementation is finished
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
  private _runtimeConfig: IRuntimeConfig;
  private _config: IConfig;
  private _defaultTemplates: IDefaultTemplates;

  private readonly errorEventsBus: EventBus<IErrorEvent>;
  private readonly lifecycleEventsBus: EventBus<ILifecycleEvent>;
  private static className: string;

  public get config(): IConfig {
    return this._config;
  }

  public set config(config: IConfig) {
    this._config = config;
    this.saveConfigToFile();
    this.emit('newConfig', this.config);
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

  /**
   * Creates config and check types
   */
  constructor(params: IConfigManagerParams) {
    super();
    const { errorEventsBus, lifecycleEventsBus } = params;
    this.errorEventsBus = errorEventsBus;
    this.lifecycleEventsBus = lifecycleEventsBus;

    ConfigManager.className = this.constructor.name;

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
      datahub: {
        serialNumber: "No serial number found",
        provisioningHost: "",
        scopeId: "",
        regId: "unknownDevice",
        symKey: "",
        groupDevice: false,
        proxy: null,
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

    this._config = emptyDefaultConfig;
  }

  /**
   * Initializes and parses config items
   */
  public async init() {
    this._runtimeConfig = await this.loadConfig<IRuntimeConfig>(
      this.runtimeConfigName,
      this.runtimeConfig
    );
    this._config = await this.loadConfig<IConfig>(this.configName, this.config);

    this.setupDefaultDataSources();
    this.setupDefaultDataSinks();

    this.loadTemplates();

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
  }

  /**
   * Adds missing data sources on startup
   */
  public setupDefaultDataSources() {
    const sources = [defaultS7DataSource, defaultIoShieldDataSource];

    this.saveConfig({
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
    });
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

    this.saveConfig({
      dataSinks: [
        ...this._config.dataSinks,
        // Add missing sinks
        ...sinks.filter(
          (sink) =>
            !this._config.dataSinks.some((x) => x.protocol === sink.protocol)
        )
      ]
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
  private async loadConfig<ConfigType>(
    configName: string,
    defaultConfig: any
  ): Promise<ConfigType> {
    const logPrefix = `${ConfigManager.className}::loadConfig`;
    const configPath = path.join(this.configFolder, configName);
    winston.info(`Loading config file from path "${configPath}"`);
    const pathExists = fs.existsSync(this.configFolder);
    const fileExists = fs.existsSync(configPath);
    if (!pathExists || !fileExists) {
      await this.lifecycleEventsBus.push({
        id: 'device',
        type: DeviceLifecycleEventTypes.DeviceConfigDoesNotExists,
        level: EventLevels.Device,
        payload: `Configuration ${
          !fileExists ? 'file' : 'folder'
        } does not exist!`
      });
      return Promise.reject(
        new Error(
          `${logPrefix} error due to ${DeviceLifecycleEventTypes.DeviceConfigDoesNotExists}`
        )
      );
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return this.mergeDeep(defaultConfig, config);
  }

  private loadTemplate(templateName) {
    try {
      const configPath = path.join(
        this.configFolder,
        'defaulttemplates',
        `${templateName}.json`
      );
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (err) {
      return null;
    }
  }

  private loadTemplates() {
    try {
      const templates = [
        's7toopcua',
        's7tomtconnect',
        's7toopcuaandmtconnect',
        'ioshieldtoopcua',
        'ioshieldtomtconnect',
        'ioshieldtoopcuaandmtconnect'
      ]
        .map((template) => this.loadTemplate(template))
        .reduce(
          (acc, curr) => ({
            availableDataSources: [
              ...acc.availableDataSources,
              ...curr.dataSources
            ],
            availableDataSinks: [...acc.availableDataSinks, ...curr.dataSinks]
          }),
          { availableDataSources: [], availableDataSinks: [] }
        );
      this._defaultTemplates = templates;
    } catch {
      this._defaultTemplates = {
        availableDataSources: [],
        availableDataSinks: []
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
  private saveConfigToFile(): void {
    fs.writeFileSync(
      path.join(this.configFolder, this.configName),
      JSON.stringify(this._config, null, 2),
      { encoding: 'utf-8' }
    );
    winston.info(
      `${ConfigManager.className}::saveConfigToFile saved new config to file`
    );
  }

  public saveConfig(obj: Partial<IConfig> = null): void {
    if (obj) {
      this._config = this.mergeDeep(this._config, obj);
    }

    this.saveConfigToFile();
  }
}
