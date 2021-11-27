import winston from 'winston';
import {
  ILifecycleEvent,
  LifecycleEventStatus
} from '../../../common/interfaces';
import {
  IDataSinkConfig,
  ITargetDataMap
} from '../../ConfigManager/interfaces';
import { DataPointMapper } from '../../DataPointMapper';
import { IDataSourceMeasurementEvent } from '../../Southbound/DataSources/interfaces';

export enum DataSinkStatus {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  RECONNECTING = 'RECONNECTING',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  NO_NETWORK_AVAILABLE = 'NO_NETWORK_AVAILABLE',
  INVALID_CONFIGURATION = 'INVALID_CONFIGURATION',
  INVALID_STATE = 'INVALID_STATE'
}

export type TDataSinkStatus = keyof typeof DataSinkStatus;

export interface IDataSinkOptions {
  dataSinkConfig: IDataSinkConfig;
  termsAndConditionsAccepted: boolean;
}

/**
 * Base class of northbound data sinks
 */
export abstract class DataSink {
  protected name = DataSink.name;
  protected config: IDataSinkConfig;
  protected dataPointMapper: DataPointMapper;
  protected readonly _protocol: string;
  protected currentStatus: LifecycleEventStatus = LifecycleEventStatus.Disabled;
  protected enabled = false;
  protected termsAndConditionsAccepted = false;

  /**
   * Create a new instance & initialize the sync scheduler
   * @param params The user configuration object for this data source
   */
  constructor(options: IDataSinkOptions) {
    this.config = options.dataSinkConfig;
    this.dataPointMapper = DataPointMapper.getInstance();
    this.termsAndConditionsAccepted = options.termsAndConditionsAccepted;
    this.enabled = options.dataSinkConfig.enabled;
  }

  /**
   * Updates the current status of the data sink
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
  }

  public get protocol() {
    return this._protocol;
  }

  /**
   * Handles measurements
   * @param params The user configuration object for this data source
   */
  public async onMeasurements(events: IDataSourceMeasurementEvent[]) {
    if (!this.enabled) return;

    // No datapoints no event handling :)
    if (this.config.dataPoints.length < 1) return;
    interface IEvent {
      mapValue?: string;
      map?: ITargetDataMap;
      value: number | string | boolean;
    }

    // Group events by their target, to use for target data points, depending on more than one source data point
    const eventsByTarget: {
      [key: string]: IEvent[];
    } = {};
    events.forEach((event) => {
      const targetMappings = this.dataPointMapper.getTargets(
        event.measurement.id
      );

      targetMappings.forEach((targetMapping) => {
        if (!eventsByTarget[targetMapping.target]) {
          eventsByTarget[targetMapping.target] = [];
        }

        const dp = this.config.dataPoints.find(
          (dp) => dp.id === targetMapping.target
        );

        if (!dp) return;

        eventsByTarget[targetMapping.target].push({
          mapValue: targetMapping.mapValue,
          map: dp.map,
          value: event.measurement.value
        });
      });
    });

    let dataPoints = {};
    Object.keys(eventsByTarget).forEach((target) => {
      const events = eventsByTarget[target];

      let setEvent: IEvent;
      if (events.length > 1) {
        if (events.some((event) => typeof event.value !== 'boolean')) {
          winston.warn(
            `Multiple non boolean source events for target: ${target}!`
          );
        }
        if (events.some((event) => typeof event.mapValue === 'undefined')) {
          winston.warn(`Map value for enum target: ${target} not provided!`);
          return;
        }

        const triggeredEvents = events.filter((e) => e.value);

        const sortedEvents = triggeredEvents.sort((a, b) => {
          const mapValueA = parseInt(a.mapValue, 10);
          const mapValueB = parseInt(b.mapValue, 10);

          if (mapValueA < mapValueB) return -1;
          if (mapValueA > mapValueB) return 1;
          return 0;
        });
        setEvent = sortedEvents[0];
      } else {
        setEvent = events[0];
      }

      if (!setEvent) return;
      let value;

      if (typeof setEvent.mapValue !== 'undefined') {
        value = setEvent.map[setEvent.mapValue];
      } else if (typeof setEvent.value === 'boolean' && setEvent.map) {
        value = setEvent.value ? setEvent.map['true'] : setEvent.map['false'];
        if (typeof value === 'undefined') {
          winston.error(`Map for boolean target ${target} required!`);
          return;
        }
      } else if (
        typeof setEvent.value !== 'boolean' &&
        setEvent.map &&
        Object.keys(setEvent.map).some((key) => {
          return key === setEvent.value.toString();
        })
      ) {
        value = setEvent.map[setEvent.value];
      } else {
        value = setEvent.value;
      }

      dataPoints[target] = value;
    });
    this.processDataPointValues(dataPoints);
  }

  protected processDataPointValues(obj) {
    Object.keys(obj).forEach((key) => {
      this.processDataPointValue(key, obj[key]);
    });
  }

  protected abstract processDataPointValue(dataPointId, value): void;

  /**
   * Each data sink should handle lifecycle events
   */
  public abstract onLifecycleEvent(event: ILifecycleEvent): Promise<void>;

  /**
   * Each data sink should do all setup in the init function
   */
  public abstract init(): Promise<DataSink>;

  /**
   * Shuts down the data source
   */
  public abstract shutdown();

  /**
   * Should disconnect the data source and clean up all connection resources
   */
  public abstract disconnect();

  /**
   * Returns the current status of the data sink
   * @returns
   */
  public getCurrentStatus(): LifecycleEventStatus {
    return this.currentStatus;
  }
}
