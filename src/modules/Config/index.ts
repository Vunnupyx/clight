import fs from "fs";
import path from "path";
import winston from "winston";

interface IRuntimeConfig {
  mtconnect: IMTCConfig;
}

export interface IMTCConfig {
  listenerPort: number;
}

interface IConfig {
  datasources: {
    test: "string";
  };
}

/**
 * Config for managing the app's config
 */
class Config {
  public runtimeConfig: IRuntimeConfig = {
    mtconnect: {
      listenerPort: 7878,
    },
  };
  public config: IConfig = {
    datasources: {
      test: "string",
    },
  };

  /**
   * Creates config and check types
   */
  constructor() {
    this.runtimeConfig = this.loadConfig("runtime.json", this.runtimeConfig);
    this.config = this.loadConfig("config.json", this.config);

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
      const error = `Value for ${name} must be of type ${type}!`;
      winston.error(error);
      throw new Error(error);
    }
  }

  /**
   * Loads config files by filename and adds missing values
   * @param  {string} configName
   * @param  {any} defaultConfig
   * @returns any
   */
  private loadConfig(configName: string, defaultConfig: any): any {
    const folderPath = "../../../mdclight/config";
    if (!fs.existsSync(path.join(__dirname, folderPath))) {
      const error = "Configuration folder does not exist!";
      winston.error(error);
      throw new Error(error);
    }

    const configPath = path.join(__dirname, `${folderPath}/${configName}`);
    if (!fs.existsSync(configPath)) {
      const error = `Configuration file ${configName} does not exist!`;
      winston.error(error);
      throw new Error(error);
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

export default Config;
