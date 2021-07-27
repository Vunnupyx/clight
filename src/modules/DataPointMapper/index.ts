import { ConfigManager } from "../ConfigManager";
import { IDataPointMapping } from "../ConfigManager/interfaces";

/**
 * Uses the mapping "configuration" to map data sources to data sinks
 */
export class DataPointMapper {
  private static instance: DataPointMapper;
  private config: IDataPointMapping[] = [];

  constructor(config: ConfigManager) {
    this.config = config.config.mapping;
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
  public getTarget(sourceId: string) {
    const mapping = this.config.find((dp) => dp.source === sourceId);
    if (!mapping) {
      return null;
    }
    return mapping;
  }
}
