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
  protected name = DataSource.name;

  protected config: IDataSourceConfig;
  protected level = EventLevels.DataSource;
  protected reconnectTimeoutId: Timeout = null;
  protected RECONNECT_TIMEOUT =
    Number(process.env.dataSource_RECONNECT_TIMEOUT) || 10000;
  public timestamp: number;
  public protocol: string;
  protected scheduler: SynchronousIntervalScheduler;
  protected readSchedulerListenerId: number;
  protected logSchedulerListenerId: number;
  protected currentStatus: LifecycleEventStatus = LifecycleEventStatus.Disabled;
  protected termsAndConditionsAccepted = false;
  protected processedDataPointCount = 0;
  protected readCycleCount = 0;

  /**
   * Create a new instance & initialize the sync scheduler
   * @param params The user configuration object for this data source
   */
  constructor(params: IDataSourceParams) {
    super();
    this.config = params.config;
    this.scheduler = SynchronousIntervalScheduler.getInstance();
    this.protocol = params.config.protocol;
    this.termsAndConditionsAccepted = params.termsAndConditionsAccepted;
  }

  /**
   * Updates the current status of the data source and emit it to listeners.
   * @param newState
   * @returns
   */
  protected updateCurrentStatus(newState: LifecycleEventStatus) {
    if (newState === this.currentStatus) return;

    const logPrefix = `${this.name}::updateCurrentStatus`;
    winston.info(
      `${logPrefix} current state updated from ${this.currentStatus} to ${newState}.`
    );
    this.currentStatus = newState;
    this.emit(DataSourceEventTypes.Lifecycle, newState);
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
  protected setupDataPoints(defaultFrequency: number = 1000): void {
    if (this.readSchedulerListenerId) return;

    const logPrefix = `${this.name}::setupDataPoints`;
    winston.debug(`${logPrefix} setup data points`);
    const datapointIntervals: Array<number> = this.config.dataPoints.map(
      (dataPointConfig) => {
        // Limit read frequency to 2/s
        return Math.max(dataPointConfig.readFrequency || defaultFrequency, 500);
      }
    );
    const intervals = Array.from(new Set(datapointIntervals));

    this.readSchedulerListenerId = this.scheduler.addListener(
      intervals,
      this.dataSourceCycle.bind(this)
    );
  }

  /**
   * Setup log cycle for summary logging
   */
  protected setupLogCycle(defaultFrequency: number = 60 * 1000): void {
    if (this.logSchedulerListenerId) return;

    const logPrefix = `${this.name}::setupLogCycle`;
    winston.debug(`${logPrefix} setup log cycle`);

    this.logSchedulerListenerId = this.scheduler.addListener(
      [defaultFrequency],
      this.logSummary.bind(this)
    );
  }

  /**
   * Logs data point summary
   */
  protected logSummary(): void {
    const logPrefix = `${this.name}::logSummary`;

    winston.info(
      `${logPrefix} processed ${this.processedDataPointCount} data points in ${this.readCycleCount} read cycles. Current state: ${this.currentStatus}`
    );

    this.processedDataPointCount = 0;
    this.readCycleCount = 0;
  }

  /**
   * Shuts down the data source
   */
  public async shutdown() {
    const logPrefix = `${this.name}::shutdown`;
    winston.info(`${logPrefix} shutdown triggered`);

    this.scheduler.removeListener(this.readSchedulerListenerId);
    this.scheduler.removeListener(this.logSchedulerListenerId);
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
    const logPrefix = `${this.name}::onDataPointMeasurement`;

    const { name, protocol } = this.config;

    try {
      this.submitMeasurement(
        measurements.map((measurement) => ({
          dataSource: {
            name,
            protocol
          },
          measurement
        }))
      );

      this.processedDataPointCount =
        this.processedDataPointCount + measurements.length;
    } catch {}
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
   * Emits data poitn live cycle events as a native {@link Event}
   * @param lifecycleEvent
   */
  protected submitDataPointLifecycle(
    dataPointLifecycle: ILifecycleEvent
  ): void {
    this.emit(DataPointEventTypes.Lifecycle, dataPointLifecycle);
  }

  /**
   * Returns the current status of the data source
   * @returns
   */
  public getCurrentStatus(): LifecycleEventStatus {
    return this.currentStatus;
  }
}
