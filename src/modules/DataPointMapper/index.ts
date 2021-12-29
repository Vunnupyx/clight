import { IDataPointMapping } from '../ConfigManager/interfaces';

/**
 * Uses the mapping "configuration" to map data sources to data sinks
 */
export class DataPointMapper {
  constructor(private mapping: IDataPointMapping[] = []) {}

  /**
   * Returns mapping for a specific source data point
   * @param  {string} sourceId
   * @returns string
   */
  public getTargets(sourceId: string): IDataPointMapping[] {
    return this.mapping.filter((dp) => dp.source === sourceId);
  }
}
