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
import { TimeManager } from '../NetworkManager/TimeManager';
import IoT2050HardwareEvents from '../IoT2050HardwareEvents';
import { System } from '../System';
import HostnameController from '../HostnameController';

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
  private hwEvents: IoT2050HardwareEvents;

  constructor() {
    this.errorEventsBus = new EventBus<IErrorEvent>(LogLevel.ERROR);
    this.lifecycleEventsBus = new EventBus<ILifecycleEvent>(LogLevel.INFO);
    this.measurementsEventsBus = new MeasurementEventBus(LogLevel.DEBUG);

    this.configManager = new ConfigManager({
      errorEventsBus: this.errorEventsBus,
      lifecycleEventsBus: this.lifecycleEventsBus
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
    this.configManager.dataSinksManager = this.dataSinksManager;

    this.dataSourcesManager = new DataSourcesManager({
      configManager: this.configManager,
      dataPointCache: this.dataPointCache,
      virtualDataPointManager: this.virtualDataPointManager,
      errorBus: this.errorEventsBus,
      lifecycleBus: this.lifecycleEventsBus,
      measurementsBus: this.measurementsEventsBus
    });
    this.configManager.dataSourcesManager = this.dataSourcesManager;

    this.backend = new RestApiManager({
      configManager: this.configManager,
      dataSourcesManager: this.dataSourcesManager,
      dataSinksManager: this.dataSinksManager,
      dataPointCache: this.dataPointCache
    });

    this.hwEvents = new IoT2050HardwareEvents();
  }

  /**
   * Launches agent
   */
  public async start() {
    try {
      this.configManager.on('configsLoaded', async () => {
        const log = `${BootstrapManager.name} send network configuration to host.`;
        winston.info(log);
        const { x1, x2, time } = this.configManager.config.networkConfig;
        const nx1: NetworkInterfaceInfo =
          NetworkManagerCliController.generateNetworkInterfaceInfo(x1, 'eth0');
        const nx2: NetworkInterfaceInfo =
          NetworkManagerCliController.generateNetworkInterfaceInfo(x2, 'eth1');

        let timePromise = Promise.resolve();
        if (time && time.useNtp) {
          timePromise = TimeManager.setNTPServer(time.ntpHost);
        }

        Promise.all([
          Object.keys(x1).length !== 0
            ? NetworkManagerCliController.setConfiguration('eth0', nx1)
            : Promise.resolve(),
          Object.keys(x2).length !== 0
            ? NetworkManagerCliController.setConfiguration('eth1', nx2)
            : Promise.resolve(),
          timePromise
        ])
          .then(() => winston.info(log + ' Successfully.'))
          .catch((err) => {
            winston.error(`${log} Failed due to ${err.message}`);
          });

        HostnameController.setDefaultHostname().catch((e) =>
          winston.error(`Failed to set hostname: ${e}`)
        );
      });

      await this.configManager.init();

      this.hwEvents.subscribeLongPress(async () => {
        try {
          await this.configManager.factoryResetConfiguration();
          const system = new System();
          await system.restartDevice();
        } catch (e) {
          winston.error(`Device factory reset error: ${e}`);
        }
      });

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
