import { OPCUAServer } from "node-opcua-server";
import { NorthBoundError } from "../../common/errors";
import { ConfigManager } from "../ConfigManager";
import { OPCUAAdapter } from "../OPCUAAdapter";
import { SynchronousIntervalScheduler } from "../SyncScheduler";

/**
 * Creates and manages the runtime OPCUA adapter as a singleton.
 */
export class OPCUAManager {
  private static adapter: OPCUAAdapter;
  private static readonly className = OPCUAManager.constructor.name;
  
  constructor() {}
  /**
   * Starts adapter
   * @returns void
   */
  static async startAdapter(): Promise<void> {
    if (!this.adapter) throw new NorthBoundError(
      `${this.className}::startAdapter error due to try to start adapter but adapter is undefined.`);
    return (await this.adapter.init()).start(); //TODO: Catch if start was not possible
  }
  /**
   * Creates the adapter with the given config and return it.
   * 
   * @param config ConfigManager with all config data for a OPCUAAdapter.
   * @returns the created adapter.
   */
  static createAdapter(config: ConfigManager): OPCUAAdapter {
    if (this.adapter) throw new NorthBoundError(
      `${this.className}::createAdapter error due to adapter was already created.`);
    return this.adapter = new OPCUAAdapter(config);
  }

  /**
   * Returns adapter instance
   * @returns
   */
  static getAdapter(): OPCUAAdapter {
    if (!this.adapter) throw new NorthBoundError(
      `${this.className}::getAdapter error due to instance not yet created!`);
    return this.adapter;
  }
}
