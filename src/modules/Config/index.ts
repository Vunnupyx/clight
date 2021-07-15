import fs from "fs";
import path from "path";

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

  constructor() {
    this.runtimeConfig = this.loadConfig("runtime.json", this.runtimeConfig);
    this.config = this.loadConfig("config.json", this.config);

    // TODO check types
  }

  private loadConfig(configName: string, defaultConfig: any): any {
    const folderPath = "../../../mdclight/config";
    if (!fs.existsSync(path.join(__dirname, folderPath))) {
      throw new Error("Configuration folder does not exist!");
    }

    const configPath = path.join(__dirname, `${folderPath}/${configName}`);
    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration file ${configName} does not exist!`);
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
