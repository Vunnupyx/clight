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
  config: (config: IConfig) => void
}

/**
 * Config for managing the app's config
 */
export class ConfigManager extends (EventEmitter as new () => TypedEmitter<IConfigManagerEvents>) {
  
  public id: string | null = null;

  private readonly errorEventsBus: EventBus<IErrorEvent>;
  private readonly lifecycleEventsBus: EventBus<ILifecycleEvent>;
  private configFolder = "../../../mdclight/config";
  private configName = 'config.json';
  private runtimeConfigName = "runtime.json";

  private set config(config: IConfig) {
    this.config = config;
    this.saveConfigToFile();
    this.emit('config', this.config);
  }
  
  public get runtimeConfig() : IRuntimeConfig {
    return this.runtimeConfig;
  }

  private set runtimeConfig(config : IRuntimeConfig) {
    this.runtimeConfig = config;
  }
  
  /**
   * Creates config and check types
   */
  constructor(params: IConfigManagerParams) {
    super();
    const { errorEventsBus, lifecycleEventsBus } = params;
    this.errorEventsBus = errorEventsBus;
    this.lifecycleEventsBus = lifecycleEventsBus;

    this.runtimeConfig = {
      mtconnect: {
        listenerPort: 7878,
      },
      restApi: {
        port: 5000,
        maxFileSizeByte: 20000000,
      }    
    };

    this.config = {
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
    this.runtimeConfig = await this.loadConfig(
      this.runtimeConfigName,
      this.runtimeConfig
    );
    this.config = await this.loadConfig(this.configName, this.config);

    this.checkType(this.runtimeConfig.mtconnect.listenerPort, "number", "runtime.mtconnect.listenerPort");
    this.checkType(this.runtimeConfig.restApi.port, "number", "runtime.restApi.port");
  }

  /**
   * Checks type of configuration value
   * @param  {any} value
   * @param  {string} type
   * @param  {string} name
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
   * @param  {string} configName
   * @param  {any} defaultConfig
   * @returns any
   */
  private async loadConfig(
    configName: string,
    defaultConfig: any
  ): Promise<any> {
    if (!fs.existsSync(path.join(__dirname, this.configFolder))) {
      await this.lifecycleEventsBus.push({
        id: "device",
        type: DeviceLifecycleEventTypes.DeviceConfigDoesNotExists,
        level: EventLevels.Device,
        payload: "Configuration folder does not exist!",
      });
      throw new Error(DeviceLifecycleEventTypes.DeviceConfigDoesNotExists);
    }

    const configPath = path.join(
      __dirname,
      `${this.configFolder}/${configName}`
    );
    if (!fs.existsSync(configPath)) {
      await this.lifecycleEventsBus.push({
        id: "device",
        type: DeviceLifecycleEventTypes.DeviceConfigDoesNotExists,
        level: EventLevels.Device,
        payload: `Configuration file ${configName} does not exist!`,
      });
      DeviceLifecycleEventTypes.DeviceConfigDoesNotExists;
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
   * @param target
   * @param ...sources
   */
  private mergeDeep(target, ...sources) {
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
   * 
   */
  public updateConfig(configCategory: keyof IConfig, data: object | string) {
    // trigger config save
    const categoryArray = this.config[configCategory];
    if(typeof data === 'string') {
      // Remove
      const index = categoryArray.findIndex((entry) => entry.id === data );
      if (index > -1) {
        categoryArray.splice(index, 1);
        this.saveConfigToFile();
        return;
      }
      throw new Error(`ConfigManager::updateConfig error due to id not found`);
    }
    // @ts-ignore
    categoryArray.push(data);
    this.saveConfigToFile();
  }

  /**
   * Save the current data from config property into a JSON config file.
   */
  private saveConfigToFile(): void {
    fs.writeFileSync(
      path.join(__dirname, this.configFolder, this.configName),
      JSON.stringify(this.config, null, 2),
      {encoding: 'utf-8'})
  }
}
