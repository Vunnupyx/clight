import winston from 'winston';
import { NorthBoundError } from '../../../../common/errors';
import {
  DataSinkProtocols,
  IErrorEvent,
  ILifecycleEvent
} from '../../../../common/interfaces';
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
  private dataSinksRestartPending = false;
  private dataAddedDuringRestart = false;

  constructor(params: IDataSinkManagerParams) {
    this.configManager = params.configManager;
    this.configManager.once('configsLoaded', () => this.init());
    this.configManager.on('configChange', this.configChangeHandler.bind(this));
    this.lifecycleBus = params.lifecycleBus;
    this.measurementsBus = params.measurementsBus;
  }

  private init(): Promise<DataSinksManager> {
    const logPrefix = `${DataSinksManager.#className}::init`;
    winston.info(`${logPrefix} initializing.`);

    this.createDataSinks();
    const initMethods = this.dataSinks.map((sink) => sink.init());
    return Promise.all(initMethods)
      .then(() => {
        // TODO: Handle rejected init
        winston.info(`${logPrefix} initialized.`);
      })
      .then(() => this)
      .catch((err) =>
        Promise.reject(
          new NorthBoundError(`${logPrefix} error due to ${err.message}`)
        )
      );
  }

  /**
   * Shutdown all available data sinks.
   */
  public async shutdownDataSink(): Promise<void> {
    const shutdownFn = [];
    this.dataSinks.forEach(async (dataSink) => {
      shutdownFn.push(dataSink.shutdown);
    });
    this.dataSinks = [];
    Promise.all(shutdownFn);
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
    };

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
    if (this.dataSinksRestartPending) {
      this.dataAddedDuringRestart = true;
      return
    };
    this.dataSinksRestartPending = true;
    const logPrefix = `${DataSinksManager.name}::configChangeHandler`;
    const shutdownFunctions = [];
    this.dataSinks.forEach((sink) => {
        if (!sink.shutdown) winston.error(`${logPrefix} ${sink} does not have a shutdown method.`);
        shutdownFunctions.push(sink.shutdown());
    });
    this.dataSinks = [];
    return Promise.all(shutdownFunctions)
      .then(() => this.init())
      .then(() => {
        winston.info(`${logPrefix} reload datasinks successfully.`);
      })
      .catch((err) => {
        winston.error(`${logPrefix} error due to ${err.message}`);
      }).finally(() => {
        this.dataSinksRestartPending = false;
        if (this.dataAddedDuringRestart) {
          this.dataAddedDuringRestart = false;
          this.configChangeHandler()
        };
      });
  }
}
