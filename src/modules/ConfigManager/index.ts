import fs from "fs";
import path from "path";
import {
  DeviceLifecycleEventTypes,
  EventLevels,
  IErrorEvent,
  ILifecycleEvent,
} from "../../common/interfaces";
import { EventBus } from "../EventBus";
import { IConfig, IConfigManagerParams, IRuntimeConfig } from "./interfaces";

/**
 * Config for managing the app's config
 */
export class ConfigManager {
  public runtimeConfig: IRuntimeConfig = {
    mtconnect: {
      listenerPort: 7878,
    },
  };
  public config: IConfig = {
    dataSources: [],
    dataSinks: [],
    mapping: [],
  };
  public id: string | null = null;

  private readonly errorEventsBus: EventBus<IErrorEvent>;
  private readonly lifecycleEventsBus: EventBus<ILifecycleEvent>;
  private configFolder = "../../../mdclight/config";

  /**
   * Creates config and check types
   */
  constructor(params: IConfigManagerParams) {
    const { errorEventsBus, lifecycleEventsBus } = params;
    this.errorEventsBus = errorEventsBus;
    this.lifecycleEventsBus = lifecycleEventsBus;
  }

  public async init() {
    this.runtimeConfig = await this.loadConfig(
      "runtime.json",
      this.runtimeConfig
    );
    this.config = await this.loadConfig("config.json", this.config);

    this.checkType(
      this.runtimeConfig.mtconnect.listenerPort,
      "number",
      "runtime.mtconnect.listenerPort"
    );
  }

  /**
   * Checks type of configuration value
   * @param  {any} value
   * @param  {string} type
   * @param  {string} name
   */
  private checkType(value: any, type: string, name: string) {
    if (!(typeof value === type)) {
      this.errorEventsBus.push({
        id: "device",
        type: DeviceLifecycleEventTypes.ErrorOnParseLocalConfig,
        level: EventLevels.Device,
        payload: `Value for ${name} must be of type ${type}!`,
      });
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
}
