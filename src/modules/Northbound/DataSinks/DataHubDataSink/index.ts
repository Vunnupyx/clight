import { DataSink } from '../DataSink';
import { ILifecycleEvent } from '../../../../common/interfaces';
import { DataHubAdapter } from '../../Adapter/DataHubAdapter';
import winston from 'winston';
import {
  IDataHubConfig,
  IDataSinkConfig,
  ISignalGroups,
  TDataHubDataPointType
} from '../../../ConfigManager/interfaces';

export interface DataHubDataSinkOptions {
  config: IDataSinkConfig;
  runTimeConfig: IDataHubConfig;
}

export type TGroupedMeasurements = Record<
  TDataHubDataPointType,
  Array<IMeasurement>
>;

export interface IMeasurement {
  [address: string]: any;
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
  protected processDataPointValues(dataPointsObj): void {
    const logPrefix = `${DataHubDataSink.name}::processDataPointValue`;
    winston.debug(`${logPrefix} receive measurements.`);

    const services = this.#datahubAdapter.getDesiredProps()?.services;

    if (!services) return;

    winston.debug(`${logPrefix} known services: ${Object.keys(services)}`);
    const data: TGroupedMeasurements = {
      probe: [],
      event: [],
      telemetry: []
    };

    const activeServices = Object.keys(services).reduce(
      (prev: Array<string>, current) => {
        if (services[current].enabled) prev.push(current);
        return prev;
      },
      []
    );

    const allDatapoints = [];
    activeServices.forEach((service) => {
      this.#signalGroups[service].forEach((datapoint) => {
        allDatapoints.push(datapoint);
      });
    });

    // make datapoint in array unique
    const uniqueDatapoints = Array.from(new Set(allDatapoints));

    for (const id of Object.keys(dataPointsObj)) {
      const { type, address } = this.config.dataPoints.find(
        (dp) => dp.id === id
      );
      if (uniqueDatapoints.includes(address)) {
        data[type].push({ [address]: dataPointsObj[id] });
      }
    }

    winston.debug(`${logPrefix} transfer grouped data to adapter.`);
    this.#datahubAdapter.setReportedProps(activeServices);
    this.#datahubAdapter.sendData(data);
  }

  protected processDataPointValue() {}

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
