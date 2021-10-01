import winston from 'winston';
import { ILifecycleEvent } from '../../../common/interfaces';
import { IDataSinkConfig, ITargetDataMap } from '../../ConfigManager/interfaces';
import { DataPointMapper } from '../../DataPointMapper';
import { IDataSourceMeasurementEvent } from '../../DataSource';

/**
 * Base class of northbound data sinks
 */
export abstract class DataSink {
  protected config: IDataSinkConfig;
  protected dataPointMapper: DataPointMapper;
  protected readonly _protocol: string;

  /**
   * Create a new instance & initialize the sync scheduler
   * @param params The user configuration object for this data source
   */
  constructor(params: IDataSinkConfig) {
    this.config = params;
    this.dataPointMapper = DataPointMapper.getInstance();
  }

  public get protocol() {
    return this._protocol;
  }

  /**
   * Handles measurements
   * @param params The user configuration object for this data source
   */
  public async onMeasurements(events: IDataSourceMeasurementEvent[]) {
    // No datapoints no event handling :)
    if(this.config.dataPoints.length < 1) return;
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

        if(!dp) return;

        eventsByTarget[targetMapping.target].push({
          mapValue: targetMapping.mapValue,
          map: dp.map,
          value: event.measurement.value
        });
      });
    });

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
          winston.warn(`Map value for enum taget: ${target} not provided!`);
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

      this.processDataPointValue(target, value);
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

  public abstract currentStatus(): boolean;
}
