import { IDataSinkConfig } from '../ConfigManager/interfaces';
import { EventBus, MeasurementEventBus } from '../EventBus/index';
import { IErrorEvent, ILifecycleEvent } from '../../common/interfaces';
import { DataPointCache } from '../DatapointCache';

export interface IDataSinkManagerParams {
  dataSinksConfig: ReadonlyArray<IDataSinkConfig>;
  dataPointCache: DataPointCache;
  errorBus: EventBus<IErrorEvent>;
  measurementsBus: MeasurementEventBus;
  lifecycleBus: EventBus<ILifecycleEvent>;
}
