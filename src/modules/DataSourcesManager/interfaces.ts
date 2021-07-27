import { IDataSourceConfig } from "../ConfigManager/interfaces";
import { EventBus, MeasurementEventBus } from "../EventBus/index";
import { IErrorEvent, ILifecycleEvent } from "../../common/interfaces";
import { DataPointCache } from "../DatapointCache";
import { IDataSourceMeasurementEvent } from "../DataSource/interfaces";
import { VirtualDataPointManager } from "../VirtualDataPointManager";

export interface IDataSourcesManagerParams {
  dataSourcesConfigs: ReadonlyArray<IDataSourceConfig>;
  dataPointCache: DataPointCache;
  virtualDataPointManager: VirtualDataPointManager;
  errorBus: EventBus<IErrorEvent>;
  measurementsBus: MeasurementEventBus;
  lifecycleBus: EventBus<ILifecycleEvent>;
}
