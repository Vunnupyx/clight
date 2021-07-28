import { IDataSourceConfig } from "../ConfigManager/interfaces";
import { DataSourceEventTypes } from "../DataSource";
import { DataSource } from "../DataSource/DataSource";
import { EventBus, MeasurementEventBus } from "../EventBus/index";
import { IDataSourcesManagerParams } from "./interfaces";
import { createDataSource } from "../DataSource/DataSourceFactory";
import { ILifecycleEvent } from "../../common/interfaces";
import { DataPointCache } from "../DatapointCache";
import { IDataSourceMeasurementEvent } from "../DataSource/interfaces";
import { VirtualDataPointManager } from "../VirtualDataPointManager";

export class DataSourcesManager {
  private dataSourcesConfig: ReadonlyArray<IDataSourceConfig>;
  private measurementsBus: MeasurementEventBus;
  private lifecycleBus: EventBus<ILifecycleEvent>;
  private dataSources: ReadonlyArray<DataSource | void>;
  private dataPointCache: DataPointCache;
  private virtualDataPointManager: VirtualDataPointManager;

  constructor(params: IDataSourcesManagerParams) {
    this.dataSourcesConfig = params.dataSourcesConfigs;
    this.lifecycleBus = params.lifecycleBus;
    this.measurementsBus = params.measurementsBus;
    this.dataPointCache = params.dataPointCache;
    this.virtualDataPointManager = params.virtualDataPointManager;
    this.spawnDataSources();
  }

  public async shutdownDataSources(): Promise<void> {
    for await (const dataSource of this.dataSources) {
      if (dataSource) {
        await dataSource.shutdown();
      }
    }
    this.dataSources = [];
  }

  public hasDataSources(): boolean {
    return !!this.dataSources?.length;
  }

  public spawnDataSources(): void {
    this.dataSources = this.dataSourcesConfig.map(createDataSource);
    this.dataSources.forEach((dataSource) => {
      if (!dataSource) {
        return;
      }
      dataSource.on(DataSourceEventTypes.Measurement, this.onMeasurementEvent);
      dataSource.on(DataSourceEventTypes.Lifecycle, this.onLifecycleEvent);

      dataSource.init();
    });
  }

  private onMeasurementEvent = (
    measurementEvents: IDataSourceMeasurementEvent[]
  ): void => {
    measurementEvents.forEach((event) => {
      this.dataPointCache.update(event);
    });

    this.measurementsBus.push([
      ...measurementEvents,
      ...this.virtualDataPointManager.getVirtualEvents(measurementEvents),
    ]);
  };

  private onLifecycleEvent = (lifeCycleEvent: ILifecycleEvent): void => {
    this.lifecycleBus.push(lifeCycleEvent);
  };
}
