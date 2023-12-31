import winston from 'winston';

import { IMTConnectConfig } from '../../../ConfigManager/interfaces';
import { MTConnectAdapter } from '../../Adapter/MTConnectAdapter';
import { DataSink, IDataSinkOptions } from '../DataSink';
import {
  DataSinkProtocols,
  ILifecycleEvent,
  LifecycleEventStatus,
  MTConnectDataItemTypes
} from '../../../../common/interfaces';
import {
  DataItem,
  Event,
  Condition,
  Sample
} from '../../Adapter/MTConnectAdapter/DataItem';
import { SynchronousIntervalScheduler } from '../../../SyncScheduler';
import { MessengerManager } from '../../MessengerManager';

type DataItemDict = {
  [key: string]: DataItem;
};

export interface IMTConnectDataSinkOptions extends IDataSinkOptions {
  mtConnectConfig: IMTConnectConfig;
  messengerManager: MessengerManager;
}

/**
 * Adds an mtc data sink
 */
export class MTConnectDataSink extends DataSink {
  private mtcAdapter: MTConnectAdapter;
  private static scheduler: SynchronousIntervalScheduler;
  private static schedulerListenerId: number | null = null;
  private dataItems: DataItemDict = {};
  private messengerManager: MessengerManager;
  protected _protocol = DataSinkProtocols.MTCONNECT;
  protected name = MTConnectDataSink.name;

  // scheduler iteration count
  private runTime: DataItem | null = null;

  // private system: Condition;
  // private logic1: Condition;
  // private motion1: Condition;

  /**
   * Create a new instance
   */
  constructor(options: IMTConnectDataSinkOptions) {
    super(options);
    this.mtcAdapter = new MTConnectAdapter(options.mtConnectConfig);
    this.messengerManager = options.messengerManager;
    MTConnectDataSink.scheduler = SynchronousIntervalScheduler.getInstance();
  }

  /**
   * Sets up data items and adds them to the mtc adapter
   */
  public async init(): Promise<MTConnectDataSink> {
    const logPrefix = `${this.name}::init`;
    winston.info(`${logPrefix} initializing.`);

    if (!this.enabled) {
      winston.info(
        `${logPrefix} MTConnect data sink is disabled. Skipping initialization.`
      );
      this.updateCurrentStatus(LifecycleEventStatus.Disabled);
      return this;
    }

    if (!this.termsAndConditionsAccepted) {
      winston.warn(
        `${logPrefix} skipped start of MTConnect data sink due to not accepted terms and conditions`
      );
      this.updateCurrentStatus(
        LifecycleEventStatus.TermsAndConditionsNotAccepted
      );
      return this;
    }

    this.messengerManager.init();

    this.updateCurrentStatus(LifecycleEventStatus.Connecting);
    this.setupDataItems(); // TODO: Unsupported Datatype crash init -> where caught?

    this.mtcAdapter.start();

    if (!MTConnectDataSink.schedulerListenerId) {
      MTConnectDataSink.schedulerListenerId =
        MTConnectDataSink.scheduler.addListener([1000], async () => {
          if (this.runTime)
            this.runTime.value = (this.runTime.value as number) + 1;
          await this.mtcAdapter.sendChanged();
        });
    }
    this.updateCurrentStatus(LifecycleEventStatus.Connected);
    winston.info(`${logPrefix} initialized.`);
    return this;
  }

  /**
   * Add data items (data points) to MTC adapter and 'dataItems' list.
   *
   * @throws Error in case of anything else except
   *  - event
   *  - sample
   *  - condition
   */
  private setupDataItems(): void {
    this.runTime = new Event('runTime');
    this.runTime.value = 0;

    this.mtcAdapter.addDataItem(this.runTime);

    this.config.dataPoints.forEach((dp) => {
      let dataItem: DataItem;

      switch (dp.type) {
        case MTConnectDataItemTypes.EVENT:
          dataItem = new Event(dp.address);
          break;
        case MTConnectDataItemTypes.SAMPLE:
          dataItem = new Sample(dp.address);
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
  }

  protected processDataPointValue(dataPointId: string, value: string | number) {
    const dataItem = this.dataItems[dataPointId];

    if (!dataItem) return;
    dataItem.value = value;
  }
  /**
   * NOT IMPLEMENTED
   * Handles live cycle events
   */
  public async onLifecycleEvent(event: ILifecycleEvent) {}

  /**
   * Shutdown data sink.
   * - Remove listener from scheduler
   */
  public shutdown(): Promise<void> {
    const logPrefix = `${MTConnectDataSink.name}::shutdown`;
    winston.debug(`${logPrefix} triggered.`);
    const shutdownFunctions = [];
    this.disconnect();

    if (MTConnectDataSink.schedulerListenerId) {
      MTConnectDataSink.scheduler.removeListener(
        MTConnectDataSink.schedulerListenerId
      );
      MTConnectDataSink.schedulerListenerId = null;
    }
    shutdownFunctions.push(this.mtcAdapter.shutdown());

    winston.verbose(`${logPrefix} Waiting for shutdown.`);
    return Promise.all(shutdownFunctions)
      .then(() => {
        winston.info(`${logPrefix} successfully.`);
        this.updateCurrentStatus(LifecycleEventStatus.Disconnected);
      })
      .catch((err) => {
        winston.error(`${logPrefix} error due to ${err.message}.`);
      });
  }

  /**
   * Disconnects all data items and set status to unavailable.
   * TODO: Why adapter is not disconnected?
   */
  public async disconnect(): Promise<void> {
    Object.keys(this.dataItems).forEach((key) => {
      this.dataItems[key].unavailable();
    });
  }
}
