import {
  IDataSinkConfig,
  IMTConnectConfig
} from '../../../ConfigManager/interfaces';

import { MTConnectAdapter } from '../../Adapter/MTConnectAdapter';
import { DataSink } from '../DataSink';
import {
  DataSinkProtocols,
  DataSourceLifecycleEventTypes,
  ILifecycleEvent,
  LifecycleEventStatus,
  MTConnectDataItemTypes
} from '../../../../common/interfaces';
import {
  DataItem,
  Event,
  Condition
} from '../../Adapter/MTConnectAdapter/DataItem';
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
  protected _protocol = DataSinkProtocols.MTCONNECT;
  private static className = MTConnectDataSink.name;

  private avail: DataItem;
  private runTime: DataItem;

  // private system: Condition;
  // private logic1: Condition;
  // private motion1: Condition;

  /**
   * Create a new instance
   */
  constructor(options: IMTConnectDataSinkOptions) {
    super(options.dataSinkConfig);
    this.enabled = options.dataSinkConfig.enabled;
    this.mtcAdapter = new MTConnectAdapter(options.mtConnectConfig);
    MTConnectDataSink.scheduler = SynchronousIntervalScheduler.getInstance();
  }

  /**
   * Sets up data items and adds them to the mtc adapter
   */
  public async init(): Promise<MTConnectDataSink> {
    const logPrefix = `${MTConnectDataSink.className}::init`;
    winston.info(`${logPrefix} initializing.`);

    if (!this.enabled) {
      winston.info(
        `${logPrefix} MTConnect data sink is disabled. Skipping initialization.`
      );
      this.currentStatus = LifecycleEventStatus.Disabled;
      return this;
    }

    this.avail = new Event('avail');
    this.runTime = new Event('runTime');
    this.runTime.value = 0;

    this.mtcAdapter.addDataItem(this.avail);
    this.mtcAdapter.addDataItem(this.runTime);

    this.config.dataPoints.forEach((dp) => {
      let dataItem: DataItem;

      switch (dp.type) {
        case MTConnectDataItemTypes.EVENT:
          dataItem = new Event(dp.address);
          break;
        case MTConnectDataItemTypes.CONDITION:
          dataItem = new Condition(dp.address);
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
    if (!MTConnectDataSink.schedulerListenerId) {
      MTConnectDataSink.schedulerListenerId =
        MTConnectDataSink.scheduler.addListener([1000], () => {
          this.runTime.value = (this.runTime.value as number) + 1;
          this.mtcAdapter.sendChanged();
        });
    }
    winston.info(`${logPrefix} initialized.`);
    return Promise.resolve(this);
  }

  protected processDataPointValue(dataPointId, value) {
    const dataItem = this.dataItems[dataPointId];

    if (!dataItem) return;

    if (dataItem instanceof Event) {
      dataItem.value = value;
      winston.debug(`Setting MTConnect DataItem ${dataItem} to ${value}`);
    }

    if (dataItem instanceof Condition) {
      // TODO
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
  public shutdown(): Promise<void> {
    const logPrefix = `${MTConnectDataSink.name}::shutdown`;
    winston.debug(`${logPrefix} triggered.`);
    const shutdownFunctions = [];
    this.disconnect();
    MTConnectDataSink.scheduler.removeListener(
      MTConnectDataSink.schedulerListenerId
    );
    Object.getOwnPropertyNames(this).forEach((prop) => {
      if (this[prop].shutdown) shutdownFunctions.push(this[prop].shutdown());
      if (this[prop].close) shutdownFunctions.push(this[prop].close());
      delete this[prop];
    });
    return Promise.all(shutdownFunctions)
      .then(() => {
        winston.info(`${logPrefix} successfully.`);
      })
      .catch((err) => {
        winston.error(`${logPrefix} error due to ${err.message}.`);
      });
  }

  /**
   * Disconnects all data items
   */
  public disconnect() {
    Object.keys(this.dataItems).forEach((key) => {
      this.dataItems[key].unavailable();
    });
  }
}
