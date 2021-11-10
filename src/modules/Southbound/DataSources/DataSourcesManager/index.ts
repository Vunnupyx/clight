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
import { promisify } from 'util';

interface IDataSourceManagerEvents {
  dataSourcesRestarted: (error: Error | null) => void;
}

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
  private dataAddedDuringRestart = false;
  private dataSinksRestartPending = false;

  constructor(params: IDataSourcesManagerParams) {
    super();

    params.configManager.once('configsLoaded', () => {
      return this.init();
    });
    params.configManager.on(
      'configChange',
      this.configChangeHandler.bind(this)
    );

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

  private configChangeHandler(forced: boolean = false): Promise<void> {
    if (this.dataSinksRestartPending) {
      this.dataAddedDuringRestart = true;
      return;
    }
    this.dataSinksRestartPending = true;
    const logPrefix = `${DataSourcesManager.name}::configChangeHandler`;

    winston.info(`${logPrefix} reloading datasources.`);

    console.log('Markus', logPrefix);
    const shutdownFns = [];
    let error = false;
    this.dataSources.forEach((source) => {
      shutdownFns.push(source.shutdown());
    });
    this.dataSources = [];
    Promise.allSettled(shutdownFns)
      .then((results) => {
        winston.debug(`${logPrefix} datasources disconnected.`);
        results.forEach((result) => {
          if (result.status === 'rejected')
            winston.error(`${logPrefix} error due to ${result.reason}`);
        });
      })
      .then(() => {
        winston.info(`${logPrefix} reinitializing datasources.`);
        return this.init();
      })
      .then(() => {
        winston.info(`${logPrefix} datasources restarted successfully.`);
      })
      .catch((err) => {
        winston.error(
          `${logPrefix} datasources restart error due to ${err.message}`
        );
        error = true;
      })
      .finally(() => {
        this.dataSinksRestartPending = false;
        if (this.dataAddedDuringRestart || error) {
          this.dataAddedDuringRestart = false;
          this.configChangeHandler(error);
        }
      });
  }
}
