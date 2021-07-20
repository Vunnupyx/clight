import winston from "winston";

// import {
//   IChangedConfigFlags,
//   IConfiguration,
//   ITenantConfig
// } from '../ConfigManager/interfaces';
import { DataSourcesManager } from "../DataSourcesManager";
import { EventBus } from "../EventBus";
import {
  DeviceLifecycleEventTypes,
  ErrorTypes,
  EventLevels,
  IErrorEvent,
  ILifecycleEvent,
  IMeasurementEvent,
} from "../../common/interfaces";
import { ConfigManager } from "../ConfigManager";
import { LogLevel } from "../Logger/interfaces";

// import { VERSION as newDeviceVersion } from "../Version";

export class BootstrapManager {
  private deviceId: string;
  private configManager: ConfigManager;
  dataSourcesManager: DataSourcesManager;
  private errorEventsBus: EventBus<IErrorEvent>;
  private lifecycleEventsBus: EventBus<ILifecycleEvent>;
  private measurementsEventsBus: EventBus<IMeasurementEvent>;

  constructor() {
    this.errorEventsBus = new EventBus<IErrorEvent>(LogLevel.ERROR);
    this.lifecycleEventsBus = new EventBus<ILifecycleEvent>(LogLevel.INFO);
    this.measurementsEventsBus = new EventBus<IMeasurementEvent>();

    this.configManager = new ConfigManager({
      errorEventsBus: this.errorEventsBus,
      lifecycleEventsBus: this.lifecycleEventsBus,
    });
    this.deviceId = this.configManager.id;

    winston.info(`Device ID: ${this.deviceId}`);
  }

  public async launch() {
    try {
      await this.configManager.init();
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
    const dataSourcesConfigs = this.configManager.config.datasources;
    if (!this.dataSourcesManager) {
      this.dataSourcesManager = new DataSourcesManager({
        dataSourcesConfigs,
        errorBus: this.errorEventsBus,
        lifecycleBus: this.lifecycleEventsBus,
        measurementsBus: this.measurementsEventsBus,
      });
    }
  }
}
