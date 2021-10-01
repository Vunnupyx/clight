import { IDataSinkConfig, IMTConnectConfig } from '../../../ConfigManager/interfaces';

import { MTConnectAdapter } from '../../Adapter/MTConnectAdapter';
import { DataSink } from '../DataSink';
import {
  DataSourceLifecycleEventTypes,
  ILifecycleEvent,
  LifecycleEventStatus,
  MTConnectDataItemTypes
} from '../../../../common/interfaces';
import { DataItem, Event } from '../../Adapter/MTConnectAdapter/DataItem';
import winston from 'winston';
import { SynchronousIntervalScheduler } from '../../../SyncScheduler';

type DataItemDict = {
  [key: string]: DataItem;
};

export interface IMTConnectDataSinkOptions {
  dataSinkConfig: IDataSinkConfig;
  mtConnectConfig: IMTConnectConfig;
}

/**
 * Adds an mtc data sink
 */
export class MTConnectDataSink extends DataSink {
  private mtcAdapter: MTConnectAdapter;
  private static scheduler: SynchronousIntervalScheduler;
  private static schedulerListenerId: number;
  private dataItems: DataItemDict = {};
  private avail: DataItem;
  protected _protocol = 'mtconnect';
  private static className = MTConnectDataSink.name;

  /**
   * Create a new instance
   */
  constructor(options: IMTConnectDataSinkOptions) {
    super(options.dataSinkConfig);
    this.mtcAdapter = new MTConnectAdapter(options.mtConnectConfig)
    MTConnectDataSink.scheduler = SynchronousIntervalScheduler.getInstance();
  }

  /**
   * Sets up data items and adds them to the mtc adapter
   */
  public init(): Promise<MTConnectDataSink> {
    const logPrefix = `${MTConnectDataSink.className}::init`;
    winston.info(`${logPrefix} initializing.`);
    this.avail = new DataItem('avail');
    this.mtcAdapter.addDataItem(this.avail);

    this.config.dataPoints.forEach((dp) => {
      let dataItem: DataItem;

      switch (dp.type) {
        case MTConnectDataItemTypes.EVENT:
          dataItem = new Event(dp.address);
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
    this.mtcAdapter.start();
    if(!MTConnectDataSink.schedulerListenerId) {
      MTConnectDataSink.schedulerListenerId = MTConnectDataSink.scheduler.addListener(
        [1000],
        this.mtcAdapter.sendChanged.bind(this.mtcAdapter)
      );
    }
    winston.info(`${logPrefix} initialized.`);
    return Promise.resolve(this);
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
      winston.info(
        `Data source for data sink ${this.config.protocol} is available`
      );
    }
    if (event.type === DataSourceLifecycleEventTypes.Disconnected) {
      this.avail.unavailable();
      winston.info(
        `Data source for data sink ${this.config.protocol} is unavailable`
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

  /**
   * Return current adapter status.
   * true -> active
   * false -> inactive
   */
  public currentStatus(): boolean {
    return !!this.mtcAdapter?.isRunning;
  }
}
