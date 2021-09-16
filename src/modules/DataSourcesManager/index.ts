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

/**
 * Creates and manages all data sources
 */
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

  /**
   * Shuts down all data sources
   * @returns Promise
   */
  public async shutdownDataSources(): Promise<void> {
    for await (const dataSource of this.dataSources) {
      if (dataSource) {
        await dataSource.shutdown();
      }
    }
    this.dataSources = [];
  }

  /**
   * Whether setup data sources exist or not
   * @returns void
   */
  public hasDataSources(): boolean {
    return !!this.dataSources?.length;
  }

  /**
   * Spawns and initializes all configured data sources
   * @returns void
   */
  public spawnDataSources(): void {
    this.dataSources = this.dataSourcesConfig.map(createDataSource);
    this.dataSources.forEach((dataSource) => {
      if (!dataSource) {
        return;
      }

      // TODO Does this even work?
      dataSource.on(DataSourceEventTypes.Measurement, this.onMeasurementEvent);
      dataSource.on(DataSourceEventTypes.Lifecycle, this.onLifecycleEvent);

      dataSource.init();
    });
  }

  /**
   * Handles and published all emitted events and corresponding virtual events
   * @param  {IDataSourceMeasurementEvent[]} measurementEvents
   * @returns void
   */
  private onMeasurementEvent = (
    measurementEvents: IDataSourceMeasurementEvent[]
  ): void => {
    this.dataPointCache.update(measurementEvents);

    this.measurementsBus.push([
      ...measurementEvents,
      ...this.virtualDataPointManager.getVirtualEvents(measurementEvents),
    ]);
  };

  /**
   * Published livecycle events
   * @param  {ILifecycleEvent} lifeCycleEvent
   * @returns void
   */
  private onLifecycleEvent = (lifeCycleEvent: ILifecycleEvent): void => {
    this.lifecycleBus.push(lifeCycleEvent);
  };
}
