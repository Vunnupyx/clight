import { IDataSinkConfig } from '../ConfigManager/interfaces';
import { EventBus, MeasurementEventBus } from '../EventBus/index';
import { IDataSinkManagerParams } from './interfaces';
import { createDataSink } from '../DataSink/DataSinkFactory';
import { ILifecycleEvent } from '../../common/interfaces';
import { DataSink } from '../DataSink/DataSink';
import { MTConnectManager } from '../MTConnectManager';
import { OPCUAManager } from '../OPCUAManager';
import winston from 'winston';

/**
 * Manages data sinks
 */
export class DataSinkManager {
  private dataSinkConfig: ReadonlyArray<IDataSinkConfig>;
  private measurementsBus: MeasurementEventBus;
  private lifecycleBus: EventBus<ILifecycleEvent>;
  private dataSinks: ReadonlyArray<DataSink>;

  constructor(params: IDataSinkManagerParams) {
    this.dataSinkConfig = params.dataSinksConfig;
    this.lifecycleBus = params.lifecycleBus;
    this.measurementsBus = params.measurementsBus;
  }

  /**
   * Not in use
   * @returns boolean
   */
  public async shutdownDataSink(): Promise<void> {
    for await (const dataSink of this.dataSinks) {
      if (dataSink) {
        await dataSink.shutdown();
      }
    }
    this.dataSinks = [];
  }

  /**
   * Not in use
   * @returns boolean
   */
  public hasDataSinks(): boolean {
    return !!this.dataSinks?.length;
  }

  /**
   * Creates all configures data sinks
   */
  public async spawnDataSinks(): Promise<void> {
    winston.info('Start data sinks');
    // Starting mtc adapter
    MTConnectManager.startAdapter();
    await OPCUAManager.startAdapter();

    // TODO Remove null data sinks
    this.dataSinks = this.dataSinkConfig
      .map(createDataSink)
      .filter((dataSink) => dataSink !== null);
    this.subscribeDataSinks();
  }

  /**
   * Provide events for data sinks
   */
  private subscribeDataSinks(): void {
    this.dataSinks.forEach((ds) => {
      this.measurementsBus.onEvent(ds.onMeasurements.bind(ds));
      this.lifecycleBus.onEvent(ds.onLifecycleEvent.bind(ds));
    });
  }
}
