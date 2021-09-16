import fs from "fs";
import path from "path";
import { EventEmitter } from "stream";
import {
  DeviceLifecycleEventTypes,
  EventLevels,
  IErrorEvent,
  ILifecycleEvent,
} from "../../common/interfaces";
import { EventBus } from "../EventBus";
import { IConfig, IConfigManagerParams, IRuntimeConfig, isDataPointMapping } from "./interfaces";
import TypedEmitter from 'typed-emitter';

interface IConfigManagerEvents {
  newConfig: (config: IConfig) => void,
  newRuntimeConfig: (config: IRuntimeConfig) => void,
}

type ChangeOperation =
  'insert' |
  'update' |
  'delete';

/**
 * Config for managing the app's config
 */
export class ConfigManager extends (EventEmitter as new () => TypedEmitter<IConfigManagerEvents>) {

  public id: string | null = null;
  private configFolder = "../../../mdclight/config";
  private configName = 'config.json';
  private runtimeConfigName = "runtime.json";
  private _runtimeConfig: IRuntimeConfig;
  private _config: IConfig;

  private readonly errorEventsBus: EventBus<IErrorEvent>;
  private readonly lifecycleEventsBus: EventBus<ILifecycleEvent>;
  private static className: string;

  public get config(): IConfig {
    return this._config;
  }

  public set config(config: IConfig) {
    this._config = config;
    this.saveConfigToFile(this.configName);
    this.emit('newConfig', this.config);
  }

  public get runtimeConfig() : IRuntimeConfig {
    return this._runtimeConfig;
  }

  private set runtimeConfig(config : IRuntimeConfig) {
    this._runtimeConfig = config;
    this.emit('newRuntimeConfig', this._runtimeConfig);
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
      mtconnect: {
        listenerPort: 7878,
      },
      restApi: {
        port: 5000,
        maxFileSizeByte: 20000000,
      }    
    };
    this._config = {
      dataSources: [],
      dataSinks: [],
      dataPoints: [],
      virtualDataPoints: [],
      mapping: [],
    }
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

    this.checkType(this.runtimeConfig.mtconnect.listenerPort, "number", "runtime.mtconnect.listenerPort");
    this.checkType(this.runtimeConfig.restApi.port, "number", "runtime.restApi.port");
  }

  /**
   * Checks type of configuration value.
   */
  private checkType(value: any, type: string, name: string) {
    if (!(typeof value === type)) {
      const error = `Value for ${name} must be of type ${type}!`;
      this.errorEventsBus.push({
        id: "device",
        type: DeviceLifecycleEventTypes.ErrorOnParseLocalConfig,
        level: EventLevels.Device,
        payload: error,
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
    const configPath = path.join(
      __dirname,
      `${this.configFolder}/${configName}`
    );
    const pathExists = fs.existsSync(path.join(__dirname, this.configFolder));
    const fileExists = fs.existsSync(configPath);
    if (!pathExists || !fileExists) {
      await this.lifecycleEventsBus.push({
        id: "device",
        type: DeviceLifecycleEventTypes.DeviceConfigDoesNotExists,
        level: EventLevels.Device,
        payload: `Configuration ${ !fileExists ? 'file' : 'folder' } does not exist!`,
      });
      return Promise.reject(new Error(`${logPrefix} error due to ${DeviceLifecycleEventTypes.DeviceConfigDoesNotExists}`));
    }

    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return this.mergeDeep(defaultConfig, config);
  }

  /**
   * Simple object check.
   * @param item
   * @returns {boolean}
   */
  private isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
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
  public changeConfig<Category extends keyof IConfig, DataType extends IConfig[Category]>(
    operation: ChangeOperation,
    configCategory: Category,
    data: DataType[number] | string){
      
    const logPrefix = `${this.constructor.name}::changeConfig`;
    if (operation === 'delete' && typeof data !== 'string') throw new Error(`${logPrefix} error due try to delete without id.`); // Combination actually not defined in type def.
    
    const categoryArray = this.config[configCategory];

    switch (operation) {
      case 'insert': {
        if(typeof data !== 'string') {

          // @ts-ignore TODO: Fix data type
          categoryArray.push(data);
        }
        break;
      }
      case 'update': {
        if(typeof data === 'string' || isDataPointMapping(data)) throw new Error();
        const index = categoryArray.findIndex((entry) => entry.id === data.id);
        if(index < 0) throw Error(`NO Entry found`); //TODO:
        const change = categoryArray[index];
        categoryArray.splice(index, 1);
        //@ts-ignore
        categoryArray.push(data);
        break;
      }
      case 'delete': {
        const index = categoryArray.findIndex((entry) => entry.id === data);
        if(index < 0) throw Error(`No Entry found`); //TODO:
        const change = categoryArray[index];
        categoryArray.splice(index, 1);
        break;
      }
      default: {
        throw new Error();
      }
    }
    this.saveConfigToFile(this.configName);
  }

  /**
   * Save the current data from config property into a JSON config file on hard drive
   */
  private saveConfigToFile(configName: string): void {
    fs.writeFileSync(
      path.join(__dirname, this.configFolder, configName),
      JSON.stringify(this.config, null, 1),
      {encoding: 'utf-8'})
  }
}
