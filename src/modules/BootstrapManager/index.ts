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
import NetworkManagerCliController from '../NetworkManager';
import { NetworkInterfaceInfo } from '../NetworkManager/interfaces';

/**
 * Launches agent and handles module life cycles
 */
export class BootstrapManager {
  private configManager: ConfigManager;
  private dataSourcesManager: DataSourcesManager;
  private dataSinksManager: DataSinksManager;
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
      lifecycleEventsBus: this.lifecycleEventsBus,
      dataSourcesManager: this.dataSourcesManager,
      dataSinksManager: this.dataSinksManager
    });

    this.dataPointCache = new DataPointCache();

    this.virtualDataPointManager = new VirtualDataPointManager({
      configManager: this.configManager,
      cache: this.dataPointCache
    });

    DataPointMapper.createInstance(this.configManager);

    this.dataSinksManager = new DataSinksManager({
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

    this.backend = new RestApiManager({
      configManager: this.configManager,
      dataSourcesManager: this.dataSourcesManager,
      dataSinksManager: this.dataSinksManager,
      dataPointCache: this.dataPointCache
    });
  }

  /**
   * Launches agent
   */
  public async start() {
    try {
      this.configManager.on('configsLoaded', async () => {
        const log = `${BootstrapManager.name} send network configuration to host.`;
        winston.info(log);
        const { x1, x2 } = this.configManager.config.networkConfig;
        const nx1: NetworkInterfaceInfo =
          NetworkManagerCliController.generateNetworkInterfaceInfo(x1, 'eth1');
        const nx2: NetworkInterfaceInfo =
          NetworkManagerCliController.generateNetworkInterfaceInfo(x2, 'eth0');

        Promise.all([
          Object.keys(x2).length !== 0
            ? NetworkManagerCliController.setConfiguration('eth0', nx2)
            : Promise.resolve(),
          Object.keys(x2).length !== 0
            ? NetworkManagerCliController.setConfiguration('eth1', nx1)
            : Promise.resolve()
        ])
          .then(() => winston.info(log + ' Successfully.'))
          .catch((err) => {
            winston.error(`${log} Failed due to ${err.message}`);
          });
      });
      await this.configManager.init();

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
