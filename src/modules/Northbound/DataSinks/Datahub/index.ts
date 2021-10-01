import { DataSink } from '../DataSink';
import { IDataSinkParams } from '../interfaces';
import { ILifecycleEvent } from '../../../common/interfaces';
import { DataHubAdapter } from '../../DataHubAdapter';
import { DataHubManager } from '../../DataHubManager';
import winston from 'winston';
import { NorthBoundError } from '../../../common/errors';

interface DatahubDataSinkOptions extends IDataSinkParams {}

export class DatahubDataSink extends DataSink {
  static readonly #className = DatahubDataSink.name;
  #datahubAdapter: DataHubAdapter;
  #connected = false;

  public constructor(options: DatahubDataSinkOptions) {
    super(options);
    this.#datahubAdapter = DataHubManager.getAdapter();
  }
  /**
   * Write data to adapter with dataPointId
   * TODO: Implement
   */
  protected processDataPointValue(dataPointId: string, value: any): void {
    const logPrefix = `${DatahubDataSink.name}::processDataPointValue`;
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
    const logPrefix = `${DatahubDataSink.name}::onLifecycleEvent`;
    //TODO: @Patrick please check with DMG if source lifecycle events are required
    winston.debug(`${logPrefix} not implemented.`);
    return Promise.resolve();
  }
  /**
   * TODO: Implement
   */
  public init(): void {
    const logPrefix = `${DatahubDataSink.#className}::init`;
    winston.debug(`${logPrefix} initializing.`);
    if (!this.#datahubAdapter.running) {
      throw new NorthBoundError(
        `${logPrefix} error due to adapter is not running.`
      );
    }
    this.#connected = true;
    winston.debug(`${logPrefix} initialized`);
    // TODO: create dataStructure via this.config.dataPoints ?
  }

  /**
   * Shutdown datasink
   */
  public shutdown() {
    this.#datahubAdapter.stop();
    // GC doesn't cleanup because instance is managed by DataHubManager singleton
    this.#datahubAdapter = null;
    winston.info(`${DatahubDataSink.#className}::shutdown successful.`);
  }

  /**
   * Stop connected adapter but don´t destroy reference
   */
  public disconnect() {
    this.#datahubAdapter.stop;
    winston.info(`${DatahubDataSink.#className}::shutdown successful.`);
  }

  /**
   * Return current connection status of the data sink
   */
  public currentStatus(): boolean {
    return !!this.#datahubAdapter?.running;
  }
}
