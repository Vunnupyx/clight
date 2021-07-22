import { IDataSinkConfig } from "../../ConfigManager/interfaces";
import { IDataSinkParams } from "./../interfaces";

import { MTConnectAdapter } from "../../MTConnectAdapter";
import { DataSink } from "../DataSink";
import { MTConnectManager } from "../../MTConnectManager";
import {
  IMeasurementEvent,
  MTConnectDataItemTypes,
} from "../../../common/interfaces";
import { DataItem, Event } from "../../MTConnectAdapter/DataItem";
import winston from "winston";

type DataItemDict = {
  [key: string]: DataItem;
};

export class MTConnectDataSink extends DataSink {
  protected config: IDataSinkConfig;
  private mtcAdapter: MTConnectAdapter;
  private dataItems: DataItemDict = {};

  /**
   * Create a new instance & initialize the sync scheduler
   * @param params The user configuration object for this data source
   */
  constructor(params: IDataSinkParams) {
    super(params);

    this.mtcAdapter = MTConnectManager.getAdapter();
  }

  public async onMeasurement(event: IMeasurementEvent) {
    const target = this.dataPointMapper.getTarget(event.measurement.id);

    if (target) {
      const dataItem = this.dataItems[target];
      dataItem.value = event.measurement.value;

      winston.debug(
        `Setting MTConnect DataItem ${target} to ${event.measurement.value}`
      );
    } else {
      winston.debug(`Target for source ${event.measurement.id} not found`);
    }
  }

  public init() {
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

  public shutdown() {}

  public disconnect() {
    Object.keys(this.dataItems).forEach((key) => {
      this.dataItems[key].unavailable();
    });
  }
}
