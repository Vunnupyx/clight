import { IDataSourceConfig } from "../ConfigManager/interfaces";
import { EventBus } from "../EventBus/index";
import {
  IErrorEvent,
  ILifecycleEvent,
  IMeasurementEvent,
} from "../../common/interfaces";

export interface IDataSourcesManagerParams {
  dataSourcesConfigs: ReadonlyArray<IDataSourceConfig>;
  errorBus: EventBus<IErrorEvent>;
  measurementsBus: EventBus<IMeasurementEvent[]>;
  lifecycleBus: EventBus<ILifecycleEvent>;
}
