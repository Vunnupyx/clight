import {
  DataSinkProtocols,
  ILifecycleEvent,
  LifecycleEventStatus
} from '../../../../common/interfaces';
import { DataHubAdapter, IDesiredProps } from '../../Adapter/DataHubAdapter';
import { DataSink, IDataSinkOptions, OptionalConfigs } from '../DataSink';
import winston from 'winston';
import {
  IDataHubConfig,
  IDataSinkConfig,
  ISignalGroups,
  TDataHubDataPointType
} from '../../../ConfigManager/interfaces';
import { NorthBoundError } from '../../../../common/errors';

export interface DataHubDataSinkOptions extends IDataSinkOptions {
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
  protected name = DataHubDataSink.name;
  protected _protocol = DataSinkProtocols.DATAHUB;
  #datahubAdapter: DataHubAdapter;
  #signalGroups: ISignalGroups;
  options: DataHubDataSinkOptions;

  public constructor(options: DataHubDataSinkOptions) {
    super(options);
    this.options = options;
    this.#signalGroups = options.runTimeConfig.signalGroups;
    this.#datahubAdapter = new DataHubAdapter(
      options.runTimeConfig,
      this.handleAdapterStateChange.bind(this)
    );
  }

  /**
   * Returns datahub adapter
   * @returns
   */
  public getAdapter(): DataHubAdapter {
    return this.#datahubAdapter;
  }

  private handleAdapterStateChange(newState: LifecycleEventStatus) {
    this.updateCurrentStatus(newState);
  }

  /**
   * Send data to data hub via data hub adapter object.
   */
  protected processDataPointValues(dataPointsObj): void {
    const logPrefix = `${DataHubDataSink.name}::processDataPointValue`;

    if (!this.#datahubAdapter.running) {
      return;
    }

    const services = this.#datahubAdapter.getDesiredProps()?.services;
    if (!services) return;

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
      if (!this.#signalGroups[service]) {
        winston.error(
          `${logPrefix} received service '${service}' does not match any available service group.`
        );
        return;
      }
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

    // winston.debug(`${logPrefix} transfer grouped data to adapter.`);

    this.#datahubAdapter.sendData(data);
  }

  /**
   * Info: Data are handled as batch.
   */
  protected processDataPointValue() {}

  /**
   * Info: Not implemented for DataHub!
   */
  public onLifecycleEvent(event: ILifecycleEvent): Promise<void> {
    const logPrefix = `${DataHubDataSink.name}::onLifecycleEvent`;
    winston.debug(`${logPrefix} not implemented.`);
    return Promise.resolve();
  }

  /**
   * Initialize datahub data sink and all it´s dependencies.
   */
  public async init(): Promise<DataHubDataSink> {
    const logPrefix = `${this.name}::init`;
    winston.debug(`${logPrefix} initializing.`);

    if (!this.enabled) {
      winston.info(
        `${logPrefix} datahub data sink is disabled. Continue initialization for update mechanism.`
      );
      this.updateCurrentStatus(LifecycleEventStatus.Disabled);
    }

    if (!this.termsAndConditionsAccepted) {
      winston.warn(
        `${logPrefix} skipped start of Data Hub data sink due to not accepted terms and conditions`
      );
      this.updateCurrentStatus(
        LifecycleEventStatus.TermsAndConditionsNotAccepted
      );
      return this;
    }

    return this.#datahubAdapter
      .init()
      .then((adapter) => adapter.start())
      .then(() => {
        winston.debug(`${logPrefix} initialized`);
        return this;
      })
      .catch((error) => {
        if (error instanceof NorthBoundError) {
          this.enabled = false;
          this.updateCurrentStatus(LifecycleEventStatus.Unavailable);
          return this;
        }
      });
  }

  /**
   * Shutdown datasink
   */
  public shutdown(): Promise<void> {
    const logPrefix = `${this.name}::shutdown`;
    return this.#datahubAdapter
      .shutdown()
      .then(() => (this.#datahubAdapter = null))
      .then(() => {
        winston.info(`${logPrefix} successful.`);
      })
      .catch((err) => {
        winston.error(`${logPrefix} error due to ${err.message}`);
      });
  }

  /**
   * Stop connected adapter but don´t destroy reference
   */
  public async disconnect() {
    await this.#datahubAdapter.stop();
    winston.info(`${this.name}::shutdown successful.`);
    this.updateCurrentStatus(LifecycleEventStatus.Disconnected);
  }

  /**
   * Return desired properties from device twin.
   */
  public getDesiredPropertiesServices(): IDesiredProps {
    if (!this.#datahubAdapter) return { services: {} };
    return this.#datahubAdapter.getDesiredProps();
  }
}
