import winston from "winston";
import { IVirtualDataPointConfig } from "../ConfigManager/interfaces";
import { CounterManager } from "../CounterManager";
import { DataPointCache } from "../DatapointCache";
import { IDataSourceMeasurementEvent } from "../DataSource";

/**
 * Calculates virtual datapoints
 */
export class VirtualDataPointManager {
  private config: IVirtualDataPointConfig[];
  private cache: DataPointCache;
  private counters: CounterManager;

  constructor(config: IVirtualDataPointConfig[], cache: DataPointCache) {
    this.config = config;
    this.cache = cache;
    this.counters = new CounterManager();
  }

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
    if (
      sourceEvents.some((event) => typeof event.measurement.value !== "boolean")
    ) {
      winston.warn(
        `Virtual data point (${config.id}) from type ${config.type} requires all sources to be of type boolean!`
      );
      return null;
    }

    let retValue: boolean = sourceEvents[0].measurement.value as boolean;
    for (let i = 1; i < sourceEvents.length; i++) {
      retValue = retValue && (sourceEvents[i].measurement.value as boolean);
    }

    return retValue;
  }

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
    if (
      sourceEvents.some((event) => typeof event.measurement.value !== "boolean")
    ) {
      winston.warn(
        `Virtual data point (${config.id}) from type ${config.type} requires all sources to be of type boolean!`
      );
      return null;
    }

    let retValue: boolean = sourceEvents[0].measurement.value as boolean;
    for (let i = 1; i < sourceEvents.length; i++) {
      retValue = retValue || (sourceEvents[i].measurement.value as boolean);
    }

    return retValue;
  }

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
    if (
      sourceEvents.some((event) => typeof event.measurement.value !== "boolean")
    ) {
      winston.warn(
        `Virtual data point (${config.id}) from type ${config.type} requires all sources to be of type boolean!`
      );
      return null;
    }

    return !sourceEvents[0].measurement.value as boolean;
  }

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
    if (
      sourceEvents.some((event) => typeof event.measurement.value !== "boolean")
    ) {
      winston.warn(
        `Virtual data point (${config.id}) from type ${config.type} requires all sources to be of type boolean!`
      );
      return null;
    }

    const measurement = sourceEvents[0].measurement;
    if (measurement.value && this.cache.hasChanged(measurement.id)) {
      return this.counters.increment(measurement.id);
    }

    return null;
  }

  private calulateValue(
    sourceEvents: IDataSourceMeasurementEvent[],
    config: IVirtualDataPointConfig
  ): boolean | number | null {
    switch (config.type) {
      case "and":
        return this.and(sourceEvents, config);
      case "or":
        return this.or(sourceEvents, config);
      case "not":
        return this.not(sourceEvents, config);
      case "counter":
        return this.count(sourceEvents, config);
      default:
        winston.warn(
          `Invalid type (${config.type}) provided for virtual data point ${config.id}!`
        );
        return null;
    }
  }

  public getVirtualEvents(
    events: IDataSourceMeasurementEvent[]
  ): IDataSourceMeasurementEvent[] {
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
      if (sourceEvents.some((event) => typeof event === "undefined")) continue;

      const value = this.calulateValue(sourceEvents, vdpConfig);

      if (value === null) {
        continue;
      }

      const newEvent: IDataSourceMeasurementEvent = {
        dataSource: {
          name: "virtual",
          protocol: "virtual",
        },
        measurement: {
          id: vdpConfig.id,
          name: "",
          value,
        },
      };

      _events.push(newEvent);
      virtualEvents.push(newEvent);
    }

    virtualEvents.forEach((event) => this.cache.update(event));

    return virtualEvents;
  }
}
