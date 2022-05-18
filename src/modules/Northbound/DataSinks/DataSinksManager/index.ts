import EventEmitter from 'events';
import TypedEventEmitter from 'typed-emitter';
import winston from 'winston';
import { AdapterError, NorthBoundError } from '../../../../common/errors';
import {
  DataSinkProtocols,
  IErrorEvent,
  ILifecycleEvent
} from '../../../../common/interfaces';
import { ConfigManager } from '../../../ConfigManager';
import { IDataSinkConfig } from '../../../ConfigManager/interfaces';
import { DataPointCache } from '../../../DatapointCache';
import { EventBus, MeasurementEventBus } from '../../../EventBus/index';
import { LicenseChecker } from '../../../LicenseChecker';
import { DataHubAdapter } from '../../Adapter/DataHubAdapter';
import { DataHubDataSink, DataHubDataSinkOptions } from '../DataHubDataSink';
import { DataSink } from '../DataSink';
import {
  IMTConnectDataSinkOptions,
  MTConnectDataSink
} from '../MTConnectDataSink';
import { IOPCUADataSinkOptions, OPCUADataSink } from '../OPCUADataSink';

interface IDataSinkManagerEvents {
  dataSinksRestarted: (error: Error | null) => void;
}

export interface IDataSinkManagerParams {
  configManager: ConfigManager;
  dataPointCache: DataPointCache;
  errorBus: EventBus<IErrorEvent>;
  measurementsBus: MeasurementEventBus;
  lifecycleBus: EventBus<ILifecycleEvent>;
  licenseChecker: LicenseChecker
}

/**
 * Manage and init all available Datasinks
 */
export class DataSinksManager extends (EventEmitter as new () => TypedEventEmitter<IDataSinkManagerEvents>) {
  static readonly #className = DataSinksManager.name;

  private configManager: Readonly<ConfigManager>;
  private measurementsBus: MeasurementEventBus;
  private lifecycleBus: EventBus<ILifecycleEvent>;
  private dataSinks: Array<DataSink> = [];
  private dataSinksRestartPending = false;
  private dataAddedDuringRestart = false;
  private dataSinkConnectRetryTimer: NodeJS.Timer;
  private sinksRetryCount: number = 0;
  private licenseChecker: LicenseChecker;

  constructor(params: IDataSinkManagerParams) {
    super();

    this.configManager = params.configManager;
    this.configManager.once('configsLoaded', () => this.init());
    this.configManager.on('configChange', this.configChangeHandler.bind(this));
    this.lifecycleBus = params.lifecycleBus;
    this.measurementsBus = params.measurementsBus;
    this.licenseChecker = params.licenseChecker;
  }

  private init(): Promise<DataSinksManager> {
    const logPrefix = `${DataSinksManager.#className}::init`;
    winston.info(`${logPrefix} initializing.`);
   
    this.createDataSinks();
    const initMethods = this.dataSinks.map((sink) => sink.init());
    return Promise.allSettled(initMethods)
      .then((results) => {
        results.forEach((result) => {
          if (result.status === 'rejected') {
            winston.warn(
              `${logPrefix} datasink failed to initialize due to ${result.reason}.`
            );
          }
        });
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
  private createDataSinks(): void {
    const logPrefix = `${DataSinksManager.#className}::createDataSinks`;
    winston.info(`${logPrefix} creating.`);

    const mtConnectDataSinkOptions: IMTConnectDataSinkOptions = {
      mapping: this.configManager.config.mapping,
      dataSinkConfig: this.findDataSinkConfig(DataSinkProtocols.MTCONNECT),
      mtConnectConfig: this.configManager.runtimeConfig.mtconnect,
      termsAndConditionsAccepted:
        this.configManager.config.termsAndConditions.accepted,
        licenseChecker: this.licenseChecker
    };

    const opcuaDataSinkOptions: IOPCUADataSinkOptions = {
      mapping: this.configManager.config.mapping,
      dataSinkConfig: this.findDataSinkConfig(DataSinkProtocols.OPCUA),
      generalConfig: this.configManager.config.general,
      runtimeConfig: this.configManager.runtimeConfig.opcua,
      termsAndConditionsAccepted:
        this.configManager.config.termsAndConditions.accepted,
        licenseChecker: this.licenseChecker
    };
    const dataHubDataSinkOptions: DataHubDataSinkOptions = {
      mapping: this.configManager.config.mapping,
      dataSinkConfig: this.findDataSinkConfig(DataSinkProtocols.DATAHUB),
      runTimeConfig: this.configManager.runtimeConfig.datahub,
      termsAndConditionsAccepted:
        this.configManager.config.termsAndConditions.accepted,
      licenseChecker: this.licenseChecker
    };

    this.configManager.config.dataSinks.forEach((sink) => {
      switch (sink.protocol) {
        case DataSinkProtocols.DATAHUB: {
          this.dataSinks.push(new DataHubDataSink(dataHubDataSinkOptions));
          break;
        }
        case DataSinkProtocols.MTCONNECT: {
          this.dataSinks.push(new MTConnectDataSink(mtConnectDataSinkOptions));
          break;
        }
        case DataSinkProtocols.OPCUA: {
          this.dataSinks.push(new OPCUADataSink(opcuaDataSinkOptions));
          break;
        }

        default:
          break;
      }
    });

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
   * Remove datasinks event handlers from buses
   */
  private disconnectDataSinksFromBus(): void {
    const logPrefix = `${DataSinksManager.name}::disconnectDataSinksFromBus`;
    this.dataSinks.forEach((ds) => {
      this.measurementsBus.offEvent(ds.onMeasurements);
      this.lifecycleBus.offEvent(ds.onLifecycleEvent);
    });
  }

  /**
   * Returns datasink by protocol
   */
  public getDataSinkByProto(protocol: string) {
    return this.dataSinks.find((sink) => sink.protocol === protocol);
  }

  /**
   * Stop all datasinks and dependencies and start new datasinks instances.
   */
  private async configChangeHandler(): Promise<void> {
    const logPrefix = `${DataSinksManager.name}::configChangeHandler`;

    if (this.dataSinksRestartPending) {
      this.dataAddedDuringRestart = true;
      return;
    }
    this.dataSinksRestartPending = true;

    winston.info(`${logPrefix} reloading datasinks.`);

    const shutdownFunctions = [];
    this.disconnectDataSinksFromBus();
    this.dataSinks.forEach((sink) => {
      if (!sink.shutdown)
        winston.error(`${logPrefix} ${sink} does not have a shutdown method.`);
      shutdownFunctions.push(sink.shutdown());
    });

    this.dataSinks = [];

    let err: Error = null;
    await Promise.allSettled(shutdownFunctions)
      .then((results) => {
        winston.info(`${logPrefix} datasinks disconnected.`);
        results.forEach((result) => {
          if (result.status === 'rejected')
            winston.error(`${logPrefix} error due to ${result.reason}`);
        });
      })
      .then(() => {
        winston.info(`${logPrefix} reinitializing data sinks.`);
        this.init();
      })
      .then(() => {
        winston.info(`${logPrefix} data sinks restarted successfully.`);
      })
      .catch((error: Error) => {
        winston.error(`${logPrefix} error due to ${error.message}`);
        err = error;
      })
      .finally(() => {
        this.dataSinksRestartPending = false;
        if (this.dataAddedDuringRestart) {
          this.dataAddedDuringRestart = false;
          this.configChangeHandler();
        } else {
          // emit event
          this.emit('dataSinksRestarted', err);
        }
      });
  }
}
