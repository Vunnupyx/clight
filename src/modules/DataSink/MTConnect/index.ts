import {
  IDataSinkConfig,
  IMTConnectDataMap,
} from "../../ConfigManager/interfaces";
import { IDataSinkParams } from "./../interfaces";

import { MTConnectAdapter } from "../../MTConnectAdapter";
import { DataSink } from "../DataSink";
import { MTConnectManager } from "../../MTConnectManager";
import {
  DataSourceLifecycleEventTypes,
  ILifecycleEvent,
  IMeasurementEvent,
  MTConnectDataItemTypes,
} from "../../../common/interfaces";
import { DataItem, Event } from "../../MTConnectAdapter/DataItem";
import winston from "winston";

type DataItemDict = {
  [key: string]: DataItem;
};

/**
 * Adds an mtc data sink
 */
export class MTConnectDataSink extends DataSink {
  protected config: IDataSinkConfig;
  private mtcAdapter: MTConnectAdapter;
  private dataItems: DataItemDict = {};
  private avail: DataItem;

  /**
   * Create a new instance
   * @param params The user configuration object for this data source
   */
  constructor(params: IDataSinkParams) {
    super(params);

    this.mtcAdapter = MTConnectManager.getAdapter();
  }

  /**
   * Sets up data items and adds them to the mtc adapter
   */
  public init() {
    this.avail = new DataItem("avail");
    this.mtcAdapter.addDataItem(this.avail);

    this.config.dataPoints.forEach((dp) => {
      let dataItem: DataItem;

      switch (dp.type) {
        case MTConnectDataItemTypes.EVENT:
          dataItem = new Event(dp.id);
          break;
        default:
          throw new Error(`Type ${dp.type} is not supported`);
      }

      this.mtcAdapter.addDataItem(dataItem);
      this.dataItems[dp.id] = dataItem;
    });
  }

  /**
   * Handles measurements
   * @param params The user configuration object for this data source
   */
  public async onMeasurements(events: IMeasurementEvent[]) {
    interface IEvent {
      mapValue?: string;
      map?: IMTConnectDataMap;
      value: number | string | boolean;
    }
    const eventsByTarget: {
      [key: string]: IEvent[];
    } = {};
    events.forEach((event) => {
      const targetMapping = this.dataPointMapper.getTarget(
        event.measurement.id
      );

      if (!targetMapping || !this.dataItems[targetMapping.target]) {
        winston.debug(`Target for source ${event.measurement.id} not found`);
        return;
      }

      if (!eventsByTarget[targetMapping.target]) {
        eventsByTarget[targetMapping.target] = [];
      }

      const dp = this.config.dataPoints.find(
        (dp) => dp.id === targetMapping.target
      );

      eventsByTarget[targetMapping.target].push({
        mapValue: targetMapping.mapValue,
        map: dp.map,
        value: event.measurement.value,
      });
    });

    Object.keys(eventsByTarget).forEach((target) => {
      const events = eventsByTarget[target];
      const targetDataItem = this.dataItems[target];

      let setEvent: IEvent;
      if (events.length > 1) {
        if (events.some((event) => typeof event.value !== "boolean")) {
          winston.error(
            `Multiple non boolean source events for target: ${target}!`
          );
          return;
        }
        if (events.some((event) => typeof event.mapValue === "undefined")) {
          winston.error(`Map value for enum taget: ${target} not provided!`);
          return;
        }

        const tiggeredEvents = events.filter((e) => e.value);

        const sortedEvents = tiggeredEvents.sort((a, b) => {
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

      if (typeof setEvent.mapValue !== "undefined") {
        value = setEvent.map[setEvent.mapValue];
      } else if (typeof setEvent.value === "boolean") {
        value = setEvent.value ? setEvent.map["true"] : setEvent.map["false"];
        if (!value) winston.error(`Map for boolean target ${target} required!`);
      } else {
        value = setEvent.value;
      }

      targetDataItem.value = value;
      winston.debug(`Setting MTConnect DataItem ${target} to ${value}`);
    });
  }

  /**
   * Handles live cycle events
   * @param params The user configuration object for this data source
   */
  public async onLifecycleEvent(event: ILifecycleEvent) {
    if (event.type === DataSourceLifecycleEventTypes.Connected) {
      this.avail.value = "AVAILABLE";
      winston.info(`Data source for data sink ${this.config.id} is available`);
    }
    if (event.type === DataSourceLifecycleEventTypes.Disconnected) {
      this.avail.unavailable();
      winston.info(
        `Data source for data sink ${this.config.id} is unavailable`
      );
    }
  }

  public shutdown() {}

  /**
   * Disconnects all data items
   */
  public disconnect() {
    Object.keys(this.dataItems).forEach((key) => {
      this.dataItems[key].unavailable();
    });
  }
}
