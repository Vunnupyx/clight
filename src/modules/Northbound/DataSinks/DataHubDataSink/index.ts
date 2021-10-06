import { DataSink } from '../DataSink';
import { ILifecycleEvent } from '../../../../common/interfaces';
import { DataHubAdapter } from '../../Adapter/DataHubAdapter';
import winston from 'winston';
import {
  IDataHubConfig,
  IDataSinkConfig,
  ISignalGroups
} from '../../../ConfigManager/interfaces';

export interface DataHubDataSinkOptions {
  config: IDataSinkConfig;
  runTimeConfig: IDataHubConfig;
}

/**
 * Representation of the data sink for Azure iot hub.
 */
export class DataHubDataSink extends DataSink {
  static readonly #className = DataHubDataSink.name;
  #datahubAdapter: DataHubAdapter;
  #signalGroups: ISignalGroups;
  #connected = false;

  public constructor(options: DataHubDataSinkOptions) {
    super(options.config);
    this.#signalGroups = options.runTimeConfig.signalGroups;
    this.#datahubAdapter = new DataHubAdapter(options.runTimeConfig);
  }
  /**
   * Send data to data hub via data hub adapter object.
   */
  protected processDataPointValue(dataPointId: string, value: any): void {
    const logPrefix = `${DataHubDataSink.name}::processDataPointValue`;
    winston.debug(
      `${logPrefix} receive measurement for dataPoint: ${dataPointId} with value: ${value}`
    );
    if (!this.#connected) {
      winston.info(
        `${logPrefix} receive measurement data but datasink is not connected.`
      );
      return;
    }

    const desiredProps = this.#datahubAdapter.getDesiredProps();
    const activeServiceNames = Object.keys(desiredProps.services);
    const availableServiceName = Object.keys(this.#signalGroups);
    //TODO: Performance optimization. Validate with UT
    for(const serviceName of availableServiceName) {
      if(activeServiceNames.includes(serviceName) && desiredProps.services[serviceName].enabled) {
        if(this.#signalGroups[serviceName].includes(dataPointId)) {
          const type = this.config.dataPoints.find((dp) => dp.id === dataPointId).type
          this.#datahubAdapter.sendData(type, dataPointId, value);
          // INFO: Remove if a datapoint can be part of different groups
          return;
        }
      }
    }
    winston.debug(`${logPrefix} not signal group found for ${dataPointId} datapoint. Maybe disabled from backend.`);
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
   * Initialize datahub data sink and all it´s dependencies.
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
  public async shutdown() {
    await this.#datahubAdapter.stop();
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
