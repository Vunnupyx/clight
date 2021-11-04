import winston from 'winston';
import { NorthBoundError } from '../../../../common/errors';
import { DataSinkProtocols, IErrorEvent, ILifecycleEvent } from '../../../../common/interfaces';
import { ConfigManager } from '../../../ConfigManager';
import { IDataSinkConfig } from '../../../ConfigManager/interfaces';
import { DataPointCache } from '../../../DatapointCache';
import { EventBus, MeasurementEventBus } from '../../../EventBus/index';
import { DataHubDataSink, DataHubDataSinkOptions } from '../DataHubDataSink';
import { DataSink } from '../DataSink';
import {
  IMTConnectDataSinkOptions,
  MTConnectDataSink
} from '../MTConnectDataSink';
import { IOPCUADataSinkOptions, OPCUADataSink } from '../OPCUADataSink';

export interface IDataSinkManagerParams {
  configManager: ConfigManager;
  dataPointCache: DataPointCache;
  errorBus: EventBus<IErrorEvent>;
  measurementsBus: MeasurementEventBus;
  lifecycleBus: EventBus<ILifecycleEvent>;
}

/**
 * Manage and init all available Datasinks
 */
export class DataSinksManager {
  static readonly #className = DataSinksManager.name;

  private configManager: Readonly<ConfigManager>;
  private measurementsBus: MeasurementEventBus;
  private lifecycleBus: EventBus<ILifecycleEvent>;
  private dataSinks: Array<DataSink> = [];

  constructor(params: IDataSinkManagerParams) {
    this.configManager = params.configManager;
    this.configManager.once('configsLoaded', () => {
      return this.init();
    });
    this.configManager.on('configChange', this.configChangeHandler.bind(this))
    this.lifecycleBus = params.lifecycleBus;
    this.measurementsBus = params.measurementsBus;
  }

  private init(): Promise<DataSinksManager> {
    const logPrefix = `${DataSinksManager.#className}::init`;
    winston.info(`${logPrefix} initializing.`);

    this.createDataSinks();
    const initMethods = this.dataSinks.map((sink) => sink.init());
    return Promise.all(initMethods)
      .then((res) => {
        //TODO: Handle rejected init
        winston.info(`${logPrefix} initialized.`);
      })
      .then(() => this)
      .catch((err) => {
        return Promise.reject(
          new NorthBoundError(`${logPrefix} error due to ${err.message}`)
        );
      });
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
   * Creates all configures data sinks
   */
  public createDataSinks(): void {
    const logPrefix = `${DataSinksManager.#className}::createDataSinks`;
    winston.info(`${logPrefix} creating.`);

    const mtConnectDataSinkOptions: IMTConnectDataSinkOptions = {
      dataSinkConfig: this.findDataSinkConfig(DataSinkProtocols.MTCONNECT),
      mtConnectConfig: this.configManager.runtimeConfig.mtconnect
    };

    const opcuaDataSinkOptions: IOPCUADataSinkOptions = {
      dataSinkConfig: this.findDataSinkConfig(DataSinkProtocols.OPCUA),
      generalConfig: this.configManager.config.general,
      runtimeConfig: this.configManager.runtimeConfig.opcua
    };
    const dataHubDataSinkOptions: DataHubDataSinkOptions = {
      config: this.findDataSinkConfig(DataSinkProtocols.DATAHUB),
      runTimeConfig: this.configManager.runtimeConfig.datahub
    }

    this.dataSinks.push(new DataHubDataSink(dataHubDataSinkOptions));
    this.dataSinks.push(new MTConnectDataSink(mtConnectDataSinkOptions));
    this.dataSinks.push(new OPCUADataSink(opcuaDataSinkOptions));

    this.connectDataSinksToBus();
    winston.info(`${logPrefix} created.`);
  }

  private findDataSinkConfig(protocol: DataSinkProtocols): IDataSinkConfig {
    return this.configManager.config.dataSinks.find(
      (sink) => sink.protocol === protocol
    );
  }

  /**
   * Provide events for data sinks
   */
  private connectDataSinksToBus(): void {
    this.dataSinks.forEach((ds) => {
      this.measurementsBus.onEvent(ds.onMeasurements.bind(ds));
      this.lifecycleBus.onEvent(ds.onLifecycleEvent.bind(ds));
    });
  }

  /**
   * Returns datasink by protocol
   */
  public getDataSinkByProto(protocol: string) {
    return this.dataSinks.find((sink) => sink.protocol === protocol);
  }

  private configChangeHandler(): Promise<void> {
    const logPrefix = `${DataSinksManager.name}::configChangeHandler`;
    const shutdownFunctions = [];
    this.dataSinks.forEach((sink) => {
      shutdownFunctions.push(sink.shutdown);
    })
    return Promise.all(shutdownFunctions)
    .then(() => {
      this.createDataSinks();
      winston.info(`${logPrefix} reload datasinks successfully.`);
    }).catch((err) => {
      winston.error(`${logPrefix} error due to ${err.message}`);
    });
  }
}
