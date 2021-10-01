import { DataSink } from '../DataSink';
import { ILifecycleEvent } from '../../../../common/interfaces';
import { DataHubAdapter } from '../../Adapter/DataHubAdapter';
import winston from 'winston';
import { NorthBoundError } from '../../../../common/errors';
import {
  IDataHubConfig,
  IDataSinkConfig
} from '../../../ConfigManager/interfaces';

export interface DataHubDataSinkOptions {
  config: IDataSinkConfig;
  runTimeConfig: IDataHubConfig;
}

export class DataHubDataSink extends DataSink {
  static readonly #className = DataHubDataSink.name;
  #datahubAdapter: DataHubAdapter;
  #connected = false;

  public constructor(options: DataHubDataSinkOptions) {
    super(options.config);
    const {
      scopeId,
      symKey,
      regId,
      proxy,
      groupDevice: group,
      provisioningHost: dpsHost
    } = options.runTimeConfig;

    this.#datahubAdapter = new DataHubAdapter({
      dpsHost,
      scopeId,
      regId,
      group,
      symKey,
      proxy
    });
  }
  /**
   * Write data to adapter with dataPointId
   * TODO: Implement
   */
  protected processDataPointValue(dataPointId: string, value: any): void {
    const logPrefix = `${DataHubDataSink.name}::processDataPointValue`;
    //TODO: send data to adapter. Adapter is buffering.
    winston.debug(
      `${logPrefix} receive measurement for dataPoint: ${dataPointId} with value: ${value}`
    );
    if (!this.#connected) {
      winston.info(
        `${logPrefix} receive measurement data but datasink is not connected.`
      );
      return;
    }
    this.#datahubAdapter.sendData(dataPointId, value);
    //datapoint und wert an adapter weiterleiten
  }
  /**
   * Not implemented for DataHub!
   */
  public onLifecycleEvent(event: ILifecycleEvent): Promise<void> {
    const logPrefix = `${DataHubDataSink.name}::onLifecycleEvent`;
    //TODO: @Patrick please check with DMG if source lifecycle events are required
    winston.debug(`${logPrefix} not implemented.`);
    return Promise.resolve();
  }
  /**
   * TODO: Implement
   */
  public init(): Promise<DataHubDataSink> {
    const logPrefix = `${DataHubDataSink.#className}::init`;
    winston.debug(`${logPrefix} initializing.`);
    return this.#datahubAdapter
      .init()
      .then((adapter) => adapter.start())
      .then(() => {
        this.#connected = true;
        winston.debug(`${logPrefix} initialized`);
        return this;
      });
  }

  /**
   * Shutdown datasink
   */
  public shutdown() {
    this.#datahubAdapter.stop();
    // GC doesn't cleanup because instance is managed by DataHubManager singleton
    this.#datahubAdapter = null;
    winston.info(`${DataHubDataSink.#className}::shutdown successful.`);
  }

  /**
   * Stop connected adapter but don´t destroy reference
   */
  public disconnect() {
    this.#datahubAdapter.stop;
    winston.info(`${DataHubDataSink.#className}::shutdown successful.`);
  }

  /**
   * Return current connection status of the data sink
   */
  public currentStatus(): boolean {
    return !!this.#datahubAdapter?.running;
  }
}
