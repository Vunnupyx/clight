import { EventEmitter } from 'events';

import { IDataSourceConfig } from '../../ConfigManager/interfaces';
import {
  DataSourceEventTypes,
  IDataSourceMeasurementEvent,
  IDataSourceParams,
  IDataSourceLifecycleEvent,
  IMeasurement,
  IDataSourceDataPointLifecycleEvent,
  DataPointEventTypes
} from './interfaces';
import {
  EventLevels,
  IBaseLifecycleEvent,
  ILifecycleEvent,
  LifecycleEventStatus
} from '../../../common/interfaces';
import Timeout = NodeJS.Timeout;
import { SynchronousIntervalScheduler } from '../../SyncScheduler';
import winston from 'winston';

/**
 * Implements data source
 */
export abstract class DataSource extends EventEmitter {
  protected static className = DataSource.name;

  protected config: IDataSourceConfig;
  protected level = EventLevels.DataSource;
  protected reconnectTimeoutId: Timeout = null;
  protected RECONNECT_TIMEOUT =
    Number(process.env.dataSource_RECONNECT_TIMEOUT) || 10000;
  public timestamp: number;
  public protocol: string;
  protected scheduler: SynchronousIntervalScheduler;
  protected schedulerListenerId: number;
  protected currentStatus: LifecycleEventStatus;

  /**
   * Create a new instance & initialize the sync scheduler
   * @param params The user configuration object for this data source
   */
  constructor(params: IDataSourceParams) {
    super();
    this.config = params.config;
    this.scheduler = SynchronousIntervalScheduler.getInstance();
    this.protocol = params.config.protocol;
  }

  /**
   * Implements the data source main loop
   * @param currentCycle
   */
  protected abstract dataSourceCycle(currentCycle: Array<number>): void;

  /**
   * Each data source should do all setup in the init function
   */
  public abstract init(): void;

  /**
   * Setup all datapoints by creating a listener for each configured interval
   */
  protected setupDataPoints(): void {
    if (this.schedulerListenerId) return;

    const logPrefix = `${DataSource.className}::setupDataPoints`;
    winston.debug(`${logPrefix} setup data points`);
    const datapointIntervals: Array<number> = this.config.dataPoints.map(
      (dataPointConfig) => {
        // Limit read frequency to 1/s
        return Math.max(dataPointConfig.readFrequency || 1000, 1000);
      }
    );
    const intervals = Array.from(new Set(datapointIntervals));

    this.schedulerListenerId = this.scheduler.addListener(
      intervals,
      this.dataSourceCycle.bind(this)
    );
  }

  /**
   * Shuts down the data source
   */
  public async shutdown() {
    this.scheduler.removeListener(this.schedulerListenerId);
    await this.disconnect();
  }

  /**
   * @deprecated
   */
  public listenDataPoints(): void {
    // Dummy function for interface compability
  }

  /**
   * Should disconnect the data source and clean up all connection resources
   */
  public abstract disconnect(): Promise<void>;

  /**
   * Maps process data from each data point to the data source
   * @param measurement A single data point read result
   */
  protected onDataPointMeasurement = (measurements: IMeasurement[]): void => {
    const { name, protocol } = this.config;

    this.submitMeasurement(
      measurements.map((measurement) => ({
        dataSource: {
          name,
          protocol
        },
        measurement
      }))
    );
  };

  /**
   * Receive data point live cycle events
   * @param lifecycleEvent
   */
  protected onDataPointLifecycle = (
    lifecycleEvent: IBaseLifecycleEvent
  ): void => {
    const { name, protocol } = this.config;
    const DPLifecycleEvent: IDataSourceDataPointLifecycleEvent = {
      dataSource: {
        name,
        protocol
      },
      ...lifecycleEvent
    };
    this.submitDataPointLifecycle(DPLifecycleEvent);
  };

  /**
   * Emits process data as a native {@link Event}
   * @param dataSourceMeasurementEvent
   */
  protected submitMeasurement(
    dataSourceMeasurementEvents: IDataSourceMeasurementEvent[]
  ): void {
    this.emit(DataSourceEventTypes.Measurement, dataSourceMeasurementEvents);
  }

  /**
   * Emits live cycle events as a native {@link Event}
   * @param lifecycleEvent
   */
  protected submitLifecycleEvent(
    lifecycleEvent: IDataSourceLifecycleEvent
  ): void {
    this.emit(DataSourceEventTypes.Lifecycle, lifecycleEvent);
  }

  /**
   * Emits data poitn live cycle events as a native {@link Event}
   * @param lifecycleEvent
   */
  protected submitDataPointLifecycle(
    dataPointLifecycle: ILifecycleEvent
  ): void {
    this.emit(DataPointEventTypes.Lifecycle, dataPointLifecycle);
  }

  public getCurrentStatus() {
    return this.currentStatus;
  }
}
