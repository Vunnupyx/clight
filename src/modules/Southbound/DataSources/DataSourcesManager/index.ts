import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';
import { IDataSourceConfig } from '../../../ConfigManager/interfaces';
import { DataSourceEventTypes, IDataSourceParams } from '../interfaces';
import { DataSource } from '../DataSource';
import { EventBus, MeasurementEventBus } from '../../../EventBus/index';
import { IDataSourcesManagerParams } from './interfaces';
import {
  DataSourceProtocols,
  ILifecycleEvent
} from '../../../../common/interfaces';
import { DataPointCache } from '../../../DatapointCache';
import { IDataSourceMeasurementEvent } from '../interfaces';
import { VirtualDataPointManager } from '../../../VirtualDataPointManager';
import winston from 'winston';
import { ConfigManager } from '../../../ConfigManager';
import { S7DataSource } from '../S7';
import { IoshieldDataSource } from '../Ioshield';

interface IDataSourceManagerEvents {
  dataSourcesRestarted: (error: Error | null) => void;
}

/**
 * Creates and manages all data sources
 */
export class DataSourcesManager extends (EventEmitter as new () => TypedEmitter<IDataSourceManagerEvents>) {
  private static className: string = DataSourcesManager.name;
  private configManager: Readonly<ConfigManager>;
  private measurementsBus: MeasurementEventBus;
  private lifecycleBus: EventBus<ILifecycleEvent>;
  private dataSources: Array<DataSource> = [];
  private dataPointCache: DataPointCache;
  private virtualDataPointManager: VirtualDataPointManager;

  constructor(params: IDataSourcesManagerParams) {
    super();

    params.configManager.once('configsLoaded', () => {
      return this.init();
    });

    this.configManager = params.configManager;
    this.lifecycleBus = params.lifecycleBus;
    this.measurementsBus = params.measurementsBus;
    this.dataPointCache = params.dataPointCache;
    this.virtualDataPointManager = params.virtualDataPointManager;
  }

  private init() {
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
    const s7DataSourceParams: IDataSourceParams = {
      config: this.findDataSourceConfig(DataSourceProtocols.S7)
    };

    const ioshieldDataSourceParams: IDataSourceParams = {
      config: this.findDataSourceConfig(DataSourceProtocols.IOSHIELD)
    };

    this.dataSources.push(new S7DataSource(s7DataSourceParams));
    this.dataSources.push(new IoshieldDataSource(ioshieldDataSourceParams));

    const logPrefix = `${DataSourcesManager.className}::init`;
    winston.info(`${logPrefix} Setup data sources`);

    this.dataSources.forEach((dataSource) => {
      if (!dataSource) {
        return;
      }

      dataSource.on(DataSourceEventTypes.Measurement, this.onMeasurementEvent);
      dataSource.on(DataSourceEventTypes.Lifecycle, this.onLifecycleEvent);

      dataSource.init();
    });
  }

  private findDataSourceConfig(
    protocol: DataSourceProtocols
  ): IDataSourceConfig {
    return this.configManager.config.dataSources.find(
      (sink) => sink.protocol === protocol
    );
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
      ...this.virtualDataPointManager.getVirtualEvents(measurementEvents)
    ]);
  };

  /**
   * Published lifecycle events
   * @param  {ILifecycleEvent} lifeCycleEvent
   * @returns void
   */
  private onLifecycleEvent = (lifeCycleEvent: ILifecycleEvent): void => {
    this.lifecycleBus.push(lifeCycleEvent);
  };

  /**
   * Returns the datasource object by its protocol
   */
  public getDataSourceByProto(protocol: string) {
    return this.dataSources.find((src) => src.protocol === protocol);
  }
}
