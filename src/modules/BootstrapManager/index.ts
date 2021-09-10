import winston from "winston";
import { DataSourcesManager } from "../DataSourcesManager";
import { EventBus, MeasurementEventBus } from "../EventBus";
import {
  DeviceLifecycleEventTypes,
  EventLevels,
  IErrorEvent,
  ILifecycleEvent,
} from "../../common/interfaces";
import { ConfigManager } from "../ConfigManager";
import { LogLevel } from "../Logger/interfaces";
import { MTConnectManager } from "../MTConnectManager";
import { DataPointMapper } from "../DataPointMapper";
import { DataSinkManager } from "../DataSinkManager";
import { DataPointCache } from "../DatapointCache";
import { VirtualDataPointManager } from "../VirtualDataPointManager";
import { OPCUAManager } from "../OPCUAManager";

/**
 * Launches agent and handles module life cycles
 */
export class BootstrapManager {
  private configManager: ConfigManager;
  private dataSourcesManager: DataSourcesManager;
  private dataSinkManager: DataSinkManager;
  private errorEventsBus: EventBus<IErrorEvent>;
  private lifecycleEventsBus: EventBus<ILifecycleEvent>;
  private measurementsEventsBus: MeasurementEventBus;
  private dataPointCache: DataPointCache;
  private virtualDataPointManager: VirtualDataPointManager;

  constructor() {
    this.errorEventsBus = new EventBus<IErrorEvent>(LogLevel.ERROR);
    this.lifecycleEventsBus = new EventBus<ILifecycleEvent>(LogLevel.INFO);
    this.measurementsEventsBus = new MeasurementEventBus(LogLevel.DEBUG);

    this.configManager = new ConfigManager({
      errorEventsBus: this.errorEventsBus,
      lifecycleEventsBus: this.lifecycleEventsBus,
    });

    this.dataPointCache = new DataPointCache();
  }

  /**
   * Launches agent
   */
  public async launch() {
    try {
      await this.configManager.init();

      MTConnectManager.createAdapter(this.configManager);
      OPCUAManager.createAdapter(this.configManager);
      DataPointMapper.createInstance(this.configManager);

      await this.loadModules();
      this.lifecycleEventsBus.push({
        id: "device",
        level: EventLevels.Device,
        type: DeviceLifecycleEventTypes.LaunchSuccess,
      });
    } catch (error) {
      this.errorEventsBus.push({
        id: "device",
        level: EventLevels.Device,
        type: DeviceLifecycleEventTypes.LaunchError,
        payload: error.toString(),
      });

      winston.error("Error while launching. Exiting programm.");
      process.exit(1);
    }
  }

  /**
   * Loads modules
   * @returns Promise
   */
  private async loadModules(): Promise<void> {
    const {
      dataSources: dataSourcesConfigs,
      dataSinks: dataSinksConfig,
      virtualDataPoints: virtualDataPointConfig,
    } = this.configManager.config;

    if (!this.virtualDataPointManager) {
      this.virtualDataPointManager = new VirtualDataPointManager(
        virtualDataPointConfig,
        this.dataPointCache
      );
    }

    if (!this.dataSourcesManager) {
      this.dataSourcesManager = new DataSourcesManager({
        dataSourcesConfigs,
        dataPointCache: this.dataPointCache,
        virtualDataPointManager: this.virtualDataPointManager,
        errorBus: this.errorEventsBus,
        lifecycleBus: this.lifecycleEventsBus,
        measurementsBus: this.measurementsEventsBus,
      });
    }

    if (!this.dataSinkManager) {
      this.dataSinkManager = new DataSinkManager({
        dataSinksConfig,
        dataPointCache: this.dataPointCache,
        errorBus: this.errorEventsBus,
        lifecycleBus: this.lifecycleEventsBus,
        measurementsBus: this.measurementsEventsBus,
      });
    }
  }
}
