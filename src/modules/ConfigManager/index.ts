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
import { IConfig, IConfigManagerParams, IRuntimeConfig } from "./interfaces";
import TypedEmitter from 'typed-emitter';

interface IConfigManagerEvents {
  newConfig: (config: IConfig) => void,
  newRuntimeConfig: (config: IRuntimeConfig) => void,
}

/**
 * Config for managing the app's config
 */
export class ConfigManager extends (EventEmitter as new () => TypedEmitter<IConfigManagerEvents>) {
  private configFolder = "../../../mdclight/config";
  private configName = 'config.json';
  private runtimeConfigName = "runtime.json";
  private _runtimeConfig: IRuntimeConfig;
  private _config: IConfig;

  private readonly errorEventsBus: EventBus<IErrorEvent>;
  private readonly lifecycleEventsBus: EventBus<ILifecycleEvent>;
  private static className: string;

  public id: string | null = null;

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
   * Update the config with a given object or remove a object by it´s ID.
   */
  public updateConfig(configCategory: keyof IConfig, data: object | string) {
    // trigger config save
    const categoryArray = this._config[configCategory];
    if(typeof data === 'string') {
      // Remove
      const index = categoryArray.findIndex((entry) => entry.id === data );
      if (index > -1) {
        categoryArray.splice(index, 1);
        this.saveConfigToFile(this.configName);
        return;
      }
      throw new Error(`ConfigManager::updateConfig error due to id not found`);
    }
    // @ts-ignore
    categoryArray.push(data);
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
