import { IDataSinkConfig } from "../ConfigManager/interfaces";
import { IDataSinkParams } from "./interfaces";
import { IMeasurementEvent } from "../../common/interfaces";
import { DataPointMapper } from "../DataPointMapper";

export abstract class DataSink {
  protected config: IDataSinkConfig;
  protected dataPointMapper: DataPointMapper;

  /**
   * Create a new instance & initialize the sync scheduler
   * @param params The user configuration object for this data source
   */
  constructor(params: IDataSinkParams) {
    this.config = params.config;
    this.dataPointMapper = DataPointMapper.getInstance();
  }

  /**
   * Each data sink should handle measurements
   */
  public abstract onMeasurements(
    measurements: IMeasurementEvent[]
  ): Promise<void>;

  /**
   * Each data sink should do all setup in the init function
   */
  public abstract init(): void;

  /**
   * Shuts down the data source
   */
  public abstract shutdown();

  /**
   * Should disconnect the data source and clean up all connection resources
   */
  public abstract disconnect();
}
