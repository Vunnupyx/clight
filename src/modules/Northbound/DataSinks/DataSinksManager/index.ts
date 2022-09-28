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
import { MessengerManager } from '../../MessengerManager';
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
  licenseChecker: LicenseChecker;
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
  private messengerManager: MessengerManager;

  constructor(params: IDataSinkManagerParams) {
    super();

    this.configManager = params.configManager;
    this.configManager.once('configsLoaded', () => this.init());
    this.configManager.on('configChange', this.configChangeHandler.bind(this));
    this.lifecycleBus = params.lifecycleBus;
    this.measurementsBus = params.measurementsBus;
    this.licenseChecker = params.licenseChecker;
    this.messengerManager = new MessengerManager({
      messengerConfig: this.findDataSinkConfig(DataSinkProtocols.MTCONNECT)
        .messenger
    });
  }

  private async init(): Promise<DataSinksManager> {
    const logPrefix = `${DataSinksManager.#className}::init`;
    winston.info(`${logPrefix} initializing.`);

    return this.spawnDataSinks()
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

  private async spawnDataSinks() {
    const logPrefix = `${DataSinksManager.#className}::spawnDataSinks`;
    winston.info(
      `${logPrefix} Setup data sinks. Currently running ${JSON.stringify(
        this.dataSinks.map((sink) => sink.protocol)
      )}`
    );

    const initFunc = [
      DataSinkProtocols.MTCONNECT,
      DataSinkProtocols.OPCUA,
      DataSinkProtocols.DATAHUB
    ]
      .filter(
        (protocol) => !this.dataSinks.some((sink) => sink.protocol === protocol)
      )
      .map((protocol) => this.spawnDataSink(protocol));
    await Promise.all(initFunc);
  }

  /**
   * Creates data sinks
   */
  private async spawnDataSink(protocol: DataSinkProtocols): Promise<void> {
    const logPrefix = `${DataSinksManager.#className}::createDataSinks`;
    winston.info(`${logPrefix} creating ${protocol} data sink`);
    const sink = this.dataSourceFactory(protocol);

    // It must be pushed before initialization, to prevent double initialization
    this.dataSinks.push(sink);

    this.connectDataSinksToBus(sink);
    await sink.init();
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
  private connectDataSinksToBus(sink: DataSink): void {
    this.measurementsBus.onEvent(sink.onMeasurements.bind(sink));
    this.lifecycleBus.onEvent(sink.onLifecycleEvent.bind(sink));
  }

  /**
   * Remove data sink event handlers from buses
   */
  private disconnectDataSinkFromBus(sink: DataSink): void {
    const logPrefix = `${DataSinksManager.name}::disconnectDataSinkFromBus`;
    winston.info(`${logPrefix} disconnecting sink from bus`);
    this.measurementsBus.offEvent(sink.onMeasurements);
    this.lifecycleBus.offEvent(sink.onLifecycleEvent);
  }

  private dataSourceFactory(protocol): DataSink {
    switch (protocol) {
      case DataSinkProtocols.DATAHUB: {
        const dataHubDataSinkOptions: DataHubDataSinkOptions = {
          mapping: this.configManager.config.mapping,
          dataSinkConfig: this.findDataSinkConfig(DataSinkProtocols.DATAHUB),
          runTimeConfig: this.configManager.runtimeConfig.datahub,
          proxy: this.configManager.config.networkConfig.proxy,
          termsAndConditionsAccepted:
            this.configManager.config.termsAndConditions.accepted,
          isLicensed: this.licenseChecker.isLicensed
        };

        return new DataHubDataSink(dataHubDataSinkOptions);
      }
      case DataSinkProtocols.MTCONNECT: {
        const mtConnectDataSinkOptions: IMTConnectDataSinkOptions = {
          mapping: this.configManager.config.mapping,
          dataSinkConfig: this.findDataSinkConfig(DataSinkProtocols.MTCONNECT),
          mtConnectConfig: this.configManager.runtimeConfig.mtconnect,
          termsAndConditionsAccepted:
            this.configManager.config.termsAndConditions.accepted,
          isLicensed: this.licenseChecker.isLicensed,
          messengerManager: this.messengerManager
        };
        return new MTConnectDataSink(mtConnectDataSinkOptions);
      }
      case DataSinkProtocols.OPCUA: {
        return new OPCUADataSink({
          mapping: this.configManager.config.mapping,
          dataSinkConfig: this.findDataSinkConfig(DataSinkProtocols.OPCUA),
          generalConfig: this.configManager.config.general,
          runtimeConfig: this.configManager.runtimeConfig.opcua,
          termsAndConditionsAccepted:
            this.configManager.config.termsAndConditions.accepted,
          isLicensed: this.licenseChecker.isLicensed
        });
      }

      default:
        throw new Error('Invalid data sink protocol!');
    }
  }

  /**
   * Returns data sink by protocol
   */
  public getDataSinkByProto(protocol: string) {
    return this.dataSinks.find((sink) => sink.protocol === protocol);
  }

  /**
   * Stop all data sinks and dependencies and start new data sinks instances.
   */
  private async configChangeHandler(): Promise<void> {
    const logPrefix = `${DataSinksManager.name}::configChangeHandler`;

    if (this.dataSinksRestartPending) {
      this.dataAddedDuringRestart = true;
      return;
    }
    this.dataSinksRestartPending = true;

    winston.info(`${logPrefix} reloading data sinks.`);

    const shutdownFunctions = [];

    this.dataSinks.forEach((sink) => {
      if (
        !sink.configEqual(
          this.findDataSinkConfig(sink.protocol),
          this.configManager.config.termsAndConditions.accepted,
          {
            proxy:
              sink.protocol === DataSinkProtocols.DATAHUB
                ? this.configManager.config.networkConfig.proxy
                : null
          }
        )
      ) {
        winston.info(
          `${logPrefix} detected configuration change for ${sink.protocol} data sink. Preparing shutdown.`
        );

        if (!sink.shutdown) {
          winston.warn(`${logPrefix} ${sink} does not have a shutdown method.`);
        } else {
          shutdownFunctions.push(sink.shutdown());
        }

        this.disconnectDataSinkFromBus(sink);
        this.dataSinks = this.dataSinks.filter(
          (dataSinks) => dataSinks.protocol !== sink.protocol
        );
      } else {
        winston.info(
          `${logPrefix} skipping shutdown of ${sink.protocol} data sink. No changes detected.`
        );
      }
    });

    let err: Error = null;
    await Promise.allSettled(shutdownFunctions)
      .then((results) => {
        winston.info(`${logPrefix} data sinks disconnected.`);
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
