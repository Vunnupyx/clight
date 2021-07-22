import winston from "winston";
import { DataSourcesManager } from "../DataSourcesManager";
import { EventBus, MeasurementEventBus } from "../EventBus";
import {
  DeviceLifecycleEventTypes,
  EventLevels,
  IErrorEvent,
  ILifecycleEvent,
  IMeasurementEvent,
} from "../../common/interfaces";
import { ConfigManager } from "../ConfigManager";
import { LogLevel } from "../Logger/interfaces";
import { MTConnectManager } from "../MTConnectManager";
import { DataPointMapper } from "../DataPointMapper";
import { DataSinkManager } from "../DataSinkManager";

// import { VERSION as newDeviceVersion } from "../Version";

export class BootstrapManager {
  private deviceId: string;
  private configManager: ConfigManager;
  private dataSourcesManager: DataSourcesManager;
  private dataSinkManager: DataSinkManager;
  private errorEventsBus: EventBus<IErrorEvent>;
  private lifecycleEventsBus: EventBus<ILifecycleEvent>;
  private measurementsEventsBus: EventBus<IMeasurementEvent>;

  constructor() {
    this.errorEventsBus = new EventBus<IErrorEvent>(LogLevel.ERROR);
    this.lifecycleEventsBus = new EventBus<ILifecycleEvent>(LogLevel.INFO);
    this.measurementsEventsBus = new MeasurementEventBus<IMeasurementEvent>(
      LogLevel.DEBUG
    );

    this.configManager = new ConfigManager({
      errorEventsBus: this.errorEventsBus,
      lifecycleEventsBus: this.lifecycleEventsBus,
    });
    this.deviceId = this.configManager.id;
  }

  public async launch() {
    try {
      await this.configManager.init();

      MTConnectManager.createAdater(this.configManager);
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
      throw error.toString();
    }
  }

  private async loadModules(): Promise<void> {
    const { dataSources: dataSourcesConfigs, dataSinks: dataSinksConfig } =
      this.configManager.config;

    if (!this.dataSourcesManager) {
      this.dataSourcesManager = new DataSourcesManager({
        dataSourcesConfigs,
        errorBus: this.errorEventsBus,
        lifecycleBus: this.lifecycleEventsBus,
        measurementsBus: this.measurementsEventsBus,
      });
    }
    if (!this.dataSinkManager) {
      this.dataSinkManager = new DataSinkManager({
        dataSinksConfig,
        errorBus: this.errorEventsBus,
        lifecycleBus: this.lifecycleEventsBus,
        measurementsBus: this.measurementsEventsBus,
      });
    }
  }
}
