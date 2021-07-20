import { IDataSinkConfig } from "../ConfigManager/interfaces";
import { EventBus } from "../EventBus/index";
import {
  IErrorEvent,
  ILifecycleEvent,
  IMeasurementEvent,
} from "../../common/interfaces";

export interface IDataSinkManagerParams {
  dataSinksConfig: ReadonlyArray<IDataSinkConfig>;
  errorBus: EventBus<IErrorEvent>;
  measurementsBus: EventBus<IMeasurementEvent>;
  lifecycleBus: EventBus<ILifecycleEvent>;
}
