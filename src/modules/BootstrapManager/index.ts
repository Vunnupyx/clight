import winston from 'winston';
import { DataSourcesManager } from '../Southbound/DataSources/DataSourcesManager';
import { EventBus, MeasurementEventBus } from '../EventBus';
import {
  DeviceLifecycleEventTypes,
  EventLevels,
  IErrorEvent,
  ILifecycleEvent
} from '../../common/interfaces';
import { ConfigManager } from '../ConfigManager';
import { LogLevel } from '../Logger/interfaces';
import { DataSinksManager } from '../Northbound/DataSinks/DataSinksManager';
import { DataPointCache } from '../DatapointCache';
import { VirtualDataPointManager } from '../VirtualDataPointManager';
import { RestApiManager } from '../Backend/RESTAPIManager';
import { DataPointMapper } from '../DataPointMapper';

/**
 * Launches agent and handles module life cycles
 */
export class BootstrapManager {
  private configManager: ConfigManager;
  private dataSourcesManager: DataSourcesManager;
  private dataSinkManager: DataSinksManager;
  private errorEventsBus: EventBus<IErrorEvent>;
  private lifecycleEventsBus: EventBus<ILifecycleEvent>;
  private measurementsEventsBus: MeasurementEventBus;
  private dataPointCache: DataPointCache;
  private virtualDataPointManager: VirtualDataPointManager;
  private backend: RestApiManager;

  constructor() {
    this.errorEventsBus = new EventBus<IErrorEvent>(LogLevel.ERROR);
    this.lifecycleEventsBus = new EventBus<ILifecycleEvent>(LogLevel.INFO);
    this.measurementsEventsBus = new MeasurementEventBus(LogLevel.DEBUG);

    this.configManager = new ConfigManager({
      errorEventsBus: this.errorEventsBus,
      lifecycleEventsBus: this.lifecycleEventsBus
    });

    this.dataSinkManager = new DataSinksManager({
      configManager: this.configManager,
      dataPointCache: this.dataPointCache,
      errorBus: this.errorEventsBus,
      lifecycleBus: this.lifecycleEventsBus,
      measurementsBus: this.measurementsEventsBus
    });

    this.dataSourcesManager = new DataSourcesManager({
      configManager: this.configManager,
      dataPointCache: this.dataPointCache,
      virtualDataPointManager: this.virtualDataPointManager,
      errorBus: this.errorEventsBus,
      lifecycleBus: this.lifecycleEventsBus,
      measurementsBus: this.measurementsEventsBus
    });

    this.dataPointCache = new DataPointCache();

    this.backend = new RestApiManager({
      configManager: this.configManager,
      dataSourcesManager: this.dataSourcesManager,
      dataSinksManager: this.dataSinkManager,
      dataPointCache: this.dataPointCache
    });

    this.virtualDataPointManager = new VirtualDataPointManager({
      configManager: this.configManager,
      cache: this.dataPointCache
    });
  }

  /**
   * Launches agent
   */
  public async start() {
    try {
      await this.configManager.init();
      DataPointMapper.createInstance(this.configManager);

      this.lifecycleEventsBus.push({
        id: 'device',
        level: EventLevels.Device,
        type: DeviceLifecycleEventTypes.LaunchSuccess
      });
    } catch (error) {
      this.errorEventsBus.push({
        id: 'device',
        level: EventLevels.Device,
        type: DeviceLifecycleEventTypes.LaunchError,
        payload: error.toString()
      });

      winston.error('Error while launching. Exiting program.');
      process.exit(1);
    }
  }
}
