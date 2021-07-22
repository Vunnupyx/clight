import { IDataSourceConfig } from "../ConfigManager/interfaces";
import { DataSourceEventTypes } from "../DataSource";
import { DataSource } from "../DataSource/DataSource";

import { EventBus } from "../EventBus/index";
import { IDataSourcesManagerParams } from "./interfaces";
import { createDataSource } from "../DataSource/DataSourceFactory";
import { ILifecycleEvent, IMeasurementEvent } from "../../common/interfaces";

export class DataSourcesManager {
  private dataSourcesConfig: ReadonlyArray<IDataSourceConfig>;
  private measurementsBus: EventBus<IMeasurementEvent>;
  private lifecycleBus: EventBus<ILifecycleEvent>;
  private dataSources: ReadonlyArray<DataSource | void>;

  constructor(params: IDataSourcesManagerParams) {
    this.dataSourcesConfig = params.dataSourcesConfigs;
    this.lifecycleBus = params.lifecycleBus;
    this.measurementsBus = params.measurementsBus;
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

  private onMeasurementEvent = (measurementEvent: IMeasurementEvent): void => {
    this.measurementsBus.push(measurementEvent);
  };

  private onLifecycleEvent = (lifeCycleEvent: ILifecycleEvent): void => {
    this.lifecycleBus.push(lifeCycleEvent);
  };
}
