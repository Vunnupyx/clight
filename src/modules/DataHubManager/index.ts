import { NorthBoundError } from '../../common/errors';
import { ConfigManager } from '../ConfigManager';
import { DataHubAdapter } from '../DataHubAdapter';

/**
 * Manage datahub adapter singleton
 */
export class DataHubManager {
  static #dataHubAdapter: DataHubAdapter;
  private static readonly className = DataHubManager.constructor.name;

  private constructor() {}

  /**
   * Start adapter instance
   */
  static startAdapter(): Promise<void> {
    if (!DataHubManager.#dataHubAdapter)
      return Promise.reject(
        new NorthBoundError(
          `${DataHubManager.className}::startAdapter error due to no adapter available`
        )
      );
    return DataHubManager.#dataHubAdapter
      .init()
      .then((adapter) => adapter.start())
      .catch((err) => {
        return Promise.reject(
          new NorthBoundError(
            `${
              DataHubManager.className
            }::startAdapter error due to ${JSON.stringify(err)}`
          )
        );
      });
  }

  /**
   * Create DataHubAdapter instance
   */
  static createAdapter(configManager: ConfigManager): Promise<DataHubAdapter> {
    const {
      scopeId,
      symKey,
      regId,
      proxy,
      groupDevice: group,
      provisioningHost: dpsHost 
    } = configManager.runtimeConfig.datahub;
    if (DataHubManager.#dataHubAdapter)
      Promise.resolve(DataHubManager.#dataHubAdapter);
    DataHubManager.#dataHubAdapter = new DataHubAdapter({
      dpsHost,
      scopeId,
      regId,
      group,
      symKey,
      proxy,
    });
    return Promise.resolve(DataHubManager.#dataHubAdapter);
  }

  /**
   * Returns the instance of DataHubAdapter
   */
  static getAdapter(): DataHubAdapter {
    if (!this.#dataHubAdapter)
      throw new NorthBoundError(
        `${DataHubManager.className}::getAdapter error due to adapter still not created.`
      );
    return this.#dataHubAdapter;
  }
}
