import { EventBus, MeasurementEventBus } from '../../../EventBus';
import { IErrorEvent, ILifecycleEvent } from '../../../../common/interfaces';
import { DataPointCache } from '../../../DatapointCache';
import { VirtualDataPointManager } from '../../../VirtualDataPointManager';
import { ConfigManager } from '../../../ConfigManager';

export interface IDataSourcesManagerParams {
  configManager: ConfigManager;
  dataPointCache: DataPointCache;
  virtualDataPointManager: VirtualDataPointManager;
  errorBus: EventBus<IErrorEvent>;
  measurementsBus: MeasurementEventBus;
  lifecycleBus: EventBus<ILifecycleEvent>;
}
