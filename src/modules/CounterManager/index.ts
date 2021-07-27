import fs from "fs";
import path from "path";
import winston from "winston";

type CounterDict = {
  [id: string]: number;
};

/**
 * Manages counter (virtual data points)
 */
export class CounterManager {
  private persist = true;
  private counters: CounterDict = {};
  private configFolder = "../../../mdclight/config";
  private counterStoragePath = "";

  constructor() {
    if (!fs.existsSync(path.join(__dirname, this.configFolder))) {
      winston.warn(
        "Configuration folder for storing counter values not found! The counts are not persisted!"
      );
      this.persist = false;
      return;
    }

    this.counterStoragePath = path.join(
      __dirname,
      `${this.configFolder}/counters.json`
    );

    if (fs.existsSync(this.counterStoragePath)) {
      this.counters = JSON.parse(
        fs.readFileSync(this.counterStoragePath, "utf8")
      );
    }
  }

  public increment(id: string): number {
    if (typeof this.counters[id] !== "undefined") {
      this.counters[id] = this.counters[id] + 1;
    } else {
      this.counters[id] = 1;
    }

    if (this.persist) {
      fs.writeFileSync(this.counterStoragePath, JSON.stringify(this.counters));
    }

    return this.counters[id];
  }

  public getValue(id: string): number {
    return this.counters[id] || 0;
  }
}
