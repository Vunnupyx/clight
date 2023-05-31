import winston from 'winston';
import {
  DataSinkProtocols,
  ILifecycleEvent,
  LifecycleEventStatus
} from '../../../common/interfaces';
import {
  IDataPointMapping,
  IDataSinkConfig,
  IGeneralConfig,
  IProxyConfig,
  ITargetDataMap
} from '../../ConfigManager/interfaces';
import { DataPointMapper } from '../../DataPointMapper';
import { IDataSourceMeasurementEvent } from '../../Southbound/DataSources/interfaces';
import { isEmpty } from 'lodash';
import { DataPointCache } from '../../DatapointCache';

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
  mapping: IDataPointMapping[];
  dataSinkConfig: IDataSinkConfig;
  generalConfig: IGeneralConfig;
  termsAndConditionsAccepted: boolean;
  dataPointCache: DataPointCache;
}

export type OptionalConfigs = {
  proxy?: IProxyConfig;
  generalConfig: IGeneralConfig;
};

/**
 * Base class of northbound data sinks
 */
export abstract class DataSink {
  protected name = DataSink.name;
  protected config: IDataSinkConfig;
  protected generalConfig: IGeneralConfig;
  protected mappingConfig: IDataPointMapping[];
  protected dataPointMapper: DataPointMapper;
  protected dataPointCache: DataPointCache;
  protected readonly _protocol: DataSinkProtocols;
  protected currentStatus: LifecycleEventStatus = LifecycleEventStatus.Disabled;
  protected enabled = false;
  protected termsAndConditionsAccepted = false;

  /**
   * Create a new instance & initialize the sync scheduler
   * @param params The user configuration object for this data source
   */
  constructor(options: IDataSinkOptions) {
    this.config = JSON.parse(JSON.stringify(options.dataSinkConfig));
    this.generalConfig = JSON.parse(JSON.stringify(options.generalConfig));
    this.mappingConfig = options.mapping;
    this.dataPointMapper = new DataPointMapper(options.mapping);
    this.termsAndConditionsAccepted = options.termsAndConditionsAccepted;
    this.enabled = options.dataSinkConfig.enabled;
    this.dataPointCache = options.dataPointCache;
  }

  /**
   * Compares given config with the current data sink config to determine if data source should be restarted or not
   */
  configEqual(
    config: IDataSinkConfig | undefined,
    mappingConfig: IDataPointMapping[],
    termsAndConditions: boolean,
    optionalConfigs?: OptionalConfigs
  ) {
    return (
      JSON.stringify(this.config ?? {}) === JSON.stringify(config ?? {}) &&
      JSON.stringify(this.mappingConfig) === JSON.stringify(mappingConfig) &&
      this.termsAndConditionsAccepted === termsAndConditions &&
      (config?.protocol !== DataSinkProtocols.OPCUA ||
        (config?.protocol === DataSinkProtocols.OPCUA &&
          JSON.stringify(this.generalConfig) ===
            JSON.stringify(optionalConfigs?.generalConfig)))
    );
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
    const logPrefix = `Datasink::onMeasurements`;
    if (!this.enabled) return;

    // No datapoints no event handling :)
    if (this.config.dataPoints.length < 1) return;
    interface IEvent {
      mapValue?: string;
      map?: ITargetDataMap;
      value: number | string | boolean;
    }

    let mappedTargetEvents = [];

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
        mappedTargetEvents.push({
          ...event,
          measurement: { ...event.measurement, id: dp.id, name: dp.name }
        });
        eventsByTarget[targetMapping.target].push({
          mapValue: targetMapping.mapValue,
          map: dp.map,
          value: event.measurement.value
        });
      });
    });
    this.dataPointCache.update(mappedTargetEvents);

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

      if (typeof setEvent.mapValue !== 'undefined' && setEvent.map) {
        value = setEvent.map[setEvent.mapValue];
      } else if (typeof setEvent.value === 'boolean' && setEvent.map) {
        value = setEvent.value ? setEvent.map['true'] : setEvent.map['false'];
        if (typeof value === 'undefined') {
          // TODO Print only at startup or config change!
          // winston.error(`Map for boolean target ${target} required!`);
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

    if (isEmpty(dataPoints)) return;
    this.processDataPointValues(dataPoints);
  }

  protected processDataPointValues(obj) {
    Object.keys(obj).forEach((key) => {
      try {
        this.processDataPointValue(key, obj[key]);
      } catch {}
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
