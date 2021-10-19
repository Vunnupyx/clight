import winston from 'winston';
import { ConfigManager } from '../ConfigManager';
import { IVirtualDataPointConfig } from '../ConfigManager/interfaces';
import { CounterManager } from '../CounterManager';
import { DataPointCache } from '../DatapointCache';
import { IDataSourceMeasurementEvent } from '../Southbound/DataSources/interfaces';

interface IVirtualDataPointManagerParams {
  configManager: ConfigManager;
  cache: DataPointCache;
}

/**
 * Calculates virtual datapoints
 */
export class VirtualDataPointManager {
  private configManager: ConfigManager;
  private config: IVirtualDataPointConfig[] = null;
  private cache: DataPointCache;
  private counters: CounterManager;

  private static className: string = VirtualDataPointManager.name;

  constructor(params: IVirtualDataPointManagerParams) {
    params.configManager.once('configsLoaded', () => {
      return this.init();
    });

    this.configManager = params.configManager;
    this.cache = params.cache;
    this.counters = new CounterManager();
  }

  private init() {
    this.config = this.configManager.config.virtualDataPoints;
  }

  /**
   * Convert all data point value types to boolean to handle bool operations
   * @param  {boolean|number|string} value
   * @returns boolean
   */
  private toBoolean(value: boolean | number | string): boolean {
    if (typeof value === 'number') {
      return value > 0;
    }
    if (typeof value === 'string') {
      return value.length > 0;
    }
    return value;
  }

  /**
   * Calculates virtual data points from type and
   *
   * @param  {IDataSourceMeasurementEvent[]} sourceEvents
   * @param  {IVirtualDataPointConfig} config
   * @returns boolean
   */
  private and(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): boolean | null {
    if (sourceEvents.length < 2) {
      winston.warn(
        `Virtual data point (${config.id}) requires at least 2 sources!`
      );
      return null;
    }

    let retValue = this.toBoolean(sourceEvents[0].measurement.value);
    for (let i = 1; i < sourceEvents.length; i++) {
      retValue = retValue && this.toBoolean(sourceEvents[i].measurement.value);
    }

    return retValue;
  }

  /**
   * Calculates virtual data points from type or
   *
   * @param  {IDataSourceMeasurementEvent[]} sourceEvents
   * @param  {IVirtualDataPointConfig} config
   * @returns boolean
   */
  private or(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): boolean | null {
    if (sourceEvents.length < 2) {
      winston.warn(
        `Virtual data point (${config.id}) requires at least 2 sources!`
      );
      return null;
    }

    let retValue = this.toBoolean(sourceEvents[0].measurement.value);
    for (let i = 1; i < sourceEvents.length; i++) {
      retValue = retValue || this.toBoolean(sourceEvents[i].measurement.value);
    }

    return retValue;
  }

  /**
   * Calculates virtual data points from type not
   *
   * @param  {IDataSourceMeasurementEvent[]} sourceEvents
   * @param  {IVirtualDataPointConfig} config
   * @returns boolean
   */
  private not(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): boolean | null {
    if (sourceEvents.length !== 1) {
      winston.warn(
        `Virtual data point (${config.id}) requires exactly 1 source!`
      );
      return null;
    }

    return !this.toBoolean(sourceEvents[0].measurement.value);
  }

  /**
   * Calculates virtual data points from type not
   *
   * @param  {IDataSourceMeasurementEvent[]} sourceEvents
   * @param  {IVirtualDataPointConfig} config
   * @returns boolean
   */
  private count(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): number | null {
    if (sourceEvents.length !== 1) {
      winston.warn(
        `Virtual data point (${config.id}) requires exactly 1 source!`
      );
      return null;
    }

    const measurement = sourceEvents[0].measurement;
    if (
      this.toBoolean(measurement.value) &&
      this.cache.hasChanged(measurement.id)
    ) {
      return this.counters.increment(measurement.id);
    }

    return null;
  }

  /**
   * Calculates an virtual data point
   * @param  {IDataSourceMeasurementEvent[]} sourceEvents
   * @param  {IVirtualDataPointConfig} config
   * @returns boolean
   */
  private calulateValue(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): boolean | number | null {
    switch (config.operationType) {
      case 'and':
        return this.and(sourceEvents, config);
      case 'or':
        return this.or(sourceEvents, config);
      case 'not':
        return this.not(sourceEvents, config);
      case 'counter':
        return this.count(sourceEvents, config);
      default:
        winston.warn(
          `Invalid type (${config.operationType}) provided for virtual data point ${config.id}!`
        );
        return null;
    }
  }

  /**
   * Calculates all virtual data points, that are related to the input events
   * (Only if one or more events of sources are provided)
   * @param  {IDataSourceMeasurementEvent[]} events
   * @returns IDataSourceMeasurementEvent
   */
  // TODO Rename "getVirtualMeasurements"
  public getVirtualEvents(
    events: IDataSourceMeasurementEvent[]
  ): IDataSourceMeasurementEvent[] {
    const logPrefix = `${VirtualDataPointManager.className}::getVirtualEvents`;
    if (this.config === null) {
      winston.warn(
        `${logPrefix} Config not yet loaded. Skipping virtual event calculation`
      );
      return [];
    }

    // Contains all events, "source events" first and "virtual events" after
    const _events = [...events];
    const virtualEvents: IDataSourceMeasurementEvent[] = [];

    for (const vdpConfig of this.config) {
      const calculateVirtualDatapoint = vdpConfig.sources.some((sourceId) =>
        _events.some((e) => e.measurement.id === sourceId)
      );

      // If virtual datapoint has no event in the current cycle, do not calculate it
      if (!calculateVirtualDatapoint) {
        continue;
      }

      let sourceEvents = vdpConfig.sources.map((sourceId) => {
        let event = _events.find((e) => e.measurement.id === sourceId);
        if (!event) {
          event = this.cache.getLastEvent(sourceId);
        }
        if (!event) {
          winston.warn(
            `Virtual data point ${vdpConfig.id} could not be calculated, because missing event from data source ${sourceId}`
          );
        }

        return event;
      });

      // Skip virtual data point if one or more source events are missing
      if (sourceEvents.some((event) => typeof event === 'undefined')) continue;

      const value = this.calulateValue(sourceEvents, vdpConfig);

      if (value === null) {
        continue;
      }

      const newEvent: IDataSourceMeasurementEvent = {
        dataSource: {
          name: 'virtual',
          protocol: 'virtual'
        },
        measurement: {
          id: vdpConfig.id,
          name: '',
          value
        }
      };

      _events.push(newEvent);
      virtualEvents.push(newEvent);
    }

    this.cache.update(virtualEvents);

    return virtualEvents;
  }
}
