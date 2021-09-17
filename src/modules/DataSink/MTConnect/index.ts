import { IDataSinkConfig } from '../../ConfigManager/interfaces';
import { IDataSinkParams } from './../interfaces';

import { MTConnectAdapter } from '../../MTConnectAdapter';
import { DataSink } from '../DataSink';
import { MTConnectManager } from '../../MTConnectManager';
import {
  DataSourceLifecycleEventTypes,
  ILifecycleEvent,
  MTConnectDataItemTypes
} from '../../../common/interfaces';
import { DataItem, Event } from '../../MTConnectAdapter/DataItem';
import winston from 'winston';

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
    this.avail = new DataItem('avail');
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

      if (typeof dp.initialValue !== 'undefined') {
        dataItem.value = dp.initialValue;
      }
    });
  }

  protected processDataPointValue(dataPointId, value) {
    const dataItem = this.dataItems[dataPointId];

    if (dataItem) {
      dataItem.value = value;
      winston.debug(`Setting MTConnect DataItem ${dataItem} to ${value}`);
    }
  }

  /**
   * Handles live cycle events
   * @param params The user configuration object for this data source
   */
  public async onLifecycleEvent(event: ILifecycleEvent) {
    if (event.type === DataSourceLifecycleEventTypes.Connected) {
      this.avail.value = 'AVAILABLE';
      winston.info(`Data source for data sink ${this.config.id} is available`);
    }
    if (event.type === DataSourceLifecycleEventTypes.Disconnected) {
      this.avail.unavailable();
      winston.info(
        `Data source for data sink ${this.config.id} is unavailable`
      );
    }
  }

  /**
   * Shutdown data sink
   */
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