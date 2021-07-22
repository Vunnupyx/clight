import { ConfigManager } from "../ConfigManager";
import { IDataPointMapping } from "../ConfigManager/interfaces";

export class DataPointMapper {
  private static instance: DataPointMapper;
  private config: IDataPointMapping[] = [];

  constructor(config: ConfigManager) {
    this.config = config.config.mapping;
  }

  public static createInstance(config: ConfigManager) {
    this.instance = new DataPointMapper(config);
  }

  public static getInstance() {
    return this.instance;
  }

  public getTarget(sourceId: string) {
    const mapping = this.config.find((dp) => dp.source === sourceId);
    if (!mapping) {
      return null;
    }
    return mapping.target;
  }
}
