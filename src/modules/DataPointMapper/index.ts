import { ConfigManager } from '../ConfigManager';
import { IConfig, IDataPointMapping } from '../ConfigManager/interfaces';

/**
 * Uses the mapping "configuration" to map data sources to data sinks
 */
export class DataPointMapper {
  private static instance: DataPointMapper;
  private mapping: IDataPointMapping[] = [];

  constructor(configManager: ConfigManager) {
    configManager.once('configsLoaded', () => {
      this.mapping = configManager.config.mapping;
    });
  }

  /**
   * Creates singleton instance of mapper
   */
  public static createInstance(config: ConfigManager) {
    this.instance = new DataPointMapper(config);
  }

  /**
   * Returns singleton instance of mapper
   */
  public static getInstance() {
    return this.instance;
  }

  /**
   * Returns mapping for a specific source data point
   * @param  {string} sourceId
   * @returns string
   */
  public getTargets(sourceId: string): IDataPointMapping[] {
    return this.mapping.filter((dp) => dp.source === sourceId);
  }

  /**
   * Update mapping if config has changed.
   */
  private newConfigHandler(config: IConfig): void {
    this.mapping = config.mapping;
  }
}
