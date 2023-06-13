import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';
import { IDataSourceConfig } from '../../../ConfigManager/interfaces';
import { DataSourceEventTypes, IDataSourceParams } from '../interfaces';
import { DataSource } from '../DataSource';
import { EventBus, MeasurementEventBus } from '../../../EventBus/index';
import { IDataSourcesManagerParams } from './interfaces';
import {
  DataSourceProtocols,
  ILifecycleEvent,
  LifecycleEventStatus
} from '../../../../common/interfaces';
import { DataPointCache } from '../../../DatapointCache';
import { IDataSourceMeasurementEvent } from '../interfaces';
import { VirtualDataPointManager } from '../../../VirtualDataPointManager';
import winston from 'winston';
import { ConfigManager } from '../../../ConfigManager';
import { S7DataSource } from '../S7';
import { IoshieldDataSource } from '../Ioshield';
import { EnergyDataSource } from '../Energy';
import { MTConnectDataSource } from '../MTConnect';
import { IDataSourceLifecycleEvent } from '../interfaces';

interface IDataSourceManagerEvents {
  dataSourcesRestarted: (error: Error | null) => void;
}

/**
 * Creates and manages all data sources
 */
export class DataSourcesManager extends (EventEmitter as new () => TypedEmitter<IDataSourceManagerEvents>) {
  private static className: string = DataSourcesManager.name;
  private configManager: Readonly<ConfigManager>;
  private measurementsBus: MeasurementEventBus;
  private lifecycleBus: EventBus<ILifecycleEvent>;
  private dataSources: Array<DataSource> = [];
  private dataPointCache: DataPointCache;
  private virtualDataPointManager: VirtualDataPointManager;
  private dataAddedDuringRestart = false;
  private dataSinksRestartPending = false;
  private mtConnectConnectionErrorResetTimer: NodeJS.Timeout | null = null;
  private MTCONNECT_CONNECTIVITY_WARNING_RESET_INTERVAL = 30 * 60 * 1000;

  public mtConnectLastConnectionErrorTimestamp: number | null = null;

  constructor(params: IDataSourcesManagerParams) {
    super();

    params.configManager.once('configsLoaded', () => {
      return this.init();
    });
    params.configManager.on(
      'configChange',
      this.configChangeHandler.bind(this)
    );

    this.configManager = params.configManager;
    this.lifecycleBus = params.lifecycleBus;
    this.measurementsBus = params.measurementsBus;
    this.dataPointCache = params.dataPointCache;
    this.virtualDataPointManager = params.virtualDataPointManager;
  }

  private async init(): Promise<void> {
    const logPrefix = `${this.constructor.name}::init`;
    winston.info(`${logPrefix} initializing...`);
    await this.spawnDataSources();
  }

  /**
   * Shuts down all data sources
   * @returns Promise
   */
  public async shutdownDataSources(): Promise<void> {
    for await (const dataSource of this.dataSources) {
      if (dataSource) {
        await dataSource.shutdown();
      }
    }
    this.dataSources = [];
  }

  /**
   * Whether setup data sources exist or not
   * @returns void
   */
  public hasDataSources(): boolean {
    return !!this.dataSources?.length;
  }

  public async spawnDataSources() {
    const logPrefix = `${DataSourcesManager.className}::spawnDataSources`;
    winston.info(
      `${logPrefix} Setup data sources. Currently running ${JSON.stringify(
        this.dataSources.map((dataSource) => dataSource.protocol)
      )}`
    );

    const initFunc = [
      DataSourceProtocols.S7,
      DataSourceProtocols.IOSHIELD,
      DataSourceProtocols.MTCONNECT,
      DataSourceProtocols.ENERGY
    ]
      .filter(
        (protocol) =>
          !this.dataSources.some(
            (dataSource) => dataSource.protocol === protocol
          )
      )
      .map((protocol) => this.spawnDataSource(protocol));
    await Promise.all(initFunc);
  }

  /**
   * Spawns and initializes all configured data sources
   * @returns void
   */
  public async spawnDataSource(protocol: DataSourceProtocols): Promise<void> {
    const logPrefix = `${DataSourcesManager.name}::spawnDataSource`;

    const sourceConfig = this.findDataSourceConfig(protocol);
    if (!sourceConfig) {
      winston.info(
        `${logPrefix} data source '${protocol}' is not found in config, skipping spawning it.`
      );
      return;
    }
    const params: IDataSourceParams = {
      config: sourceConfig,
      termsAndConditionsAccepted:
        this.configManager.config?.termsAndConditions?.accepted
    };

    const dataSource = this.dataSourceFactory(params);

    // It must be pushed before initialization, to prevent double initialization
    this.dataSources.push(dataSource);

    dataSource.on(DataSourceEventTypes.Measurement, this.onMeasurementEvent);
    dataSource.on(DataSourceEventTypes.Lifecycle, this.onLifecycleEvent);
    await dataSource.init();
  }

  private findDataSourceConfig(
    protocol: DataSourceProtocols
  ): IDataSourceConfig | undefined {
    return this.configManager.config?.dataSources?.find(
      (sink) => sink.protocol === protocol
    );
  }

  private dataSourceFactory(params: IDataSourceParams): DataSource {
    switch (params.config.protocol) {
      case DataSourceProtocols.S7:
        return new S7DataSource(params);
      case DataSourceProtocols.IOSHIELD:
        return new IoshieldDataSource(params);
      case DataSourceProtocols.ENERGY:
        return new EnergyDataSource(params, this.virtualDataPointManager);
      case DataSourceProtocols.MTCONNECT:
        return new MTConnectDataSource(params);
      default:
        throw new Error('Invalid data source!');
    }
  }

  /**
   * Handles and published all emitted events and corresponding virtual events
   * @param  {IDataSourceMeasurementEvent[]} measurementEvents
   * @returns void
   */
  private onMeasurementEvent = (
    measurementEvents: IDataSourceMeasurementEvent[]
  ): void => {
    this.dataPointCache.update(measurementEvents);

    this.measurementsBus.push([
      ...measurementEvents,
      ...this.virtualDataPointManager.getVirtualEvents(measurementEvents)
    ]);
  };

  /**
   * Sets and resets warning for the MTConnect data source connectivity warning as needed
   */
  private checkMtConnectConnectivityWarningStatus(
    lifeCycleEvent: ILifecycleEvent
  ): void {
    if (lifeCycleEvent.type === LifecycleEventStatus.ConnectionError) {
      this.mtConnectLastConnectionErrorTimestamp = Date.now();
      if (this.mtConnectConnectionErrorResetTimer)
        clearTimeout(this.mtConnectConnectionErrorResetTimer);

      this.mtConnectConnectionErrorResetTimer = setTimeout(() => {
        if (
          this.dataSources.find(
            (source) => source.protocol === DataSourceProtocols.MTCONNECT
          )?.currentStatus === LifecycleEventStatus.Connected
        ) {
          this.mtConnectLastConnectionErrorTimestamp = null;
        }
      }, this.MTCONNECT_CONNECTIVITY_WARNING_RESET_INTERVAL);
    } else if (
      lifeCycleEvent.type === LifecycleEventStatus.Connected &&
      this.mtConnectLastConnectionErrorTimestamp
    ) {
      if (
        this.mtConnectLastConnectionErrorTimestamp &&
        this.mtConnectLastConnectionErrorTimestamp <
          Date.now() - this.MTCONNECT_CONNECTIVITY_WARNING_RESET_INTERVAL
      ) {
        if (this.mtConnectConnectionErrorResetTimer) {
          clearTimeout(this.mtConnectConnectionErrorResetTimer);
          this.mtConnectConnectionErrorResetTimer = null;
        }
        this.mtConnectLastConnectionErrorTimestamp = null;
      }
    }
  }

  /**
   * Published lifecycle events
   * @param  {ILifecycleEvent} lifeCycleEvent
   * @returns void
   */
  private onLifecycleEvent = (lifeCycleEvent: ILifecycleEvent): void => {
    const logPrefix = `${DataSourcesManager.name}::onLifecycleEvent`;
    winston.verbose(`${logPrefix}`);

    const isEventFromMtConnectDataSource: boolean =
      (lifeCycleEvent as IDataSourceLifecycleEvent)?.dataSource &&
      (lifeCycleEvent as IDataSourceLifecycleEvent).dataSource?.protocol ===
        DataSourceProtocols.MTCONNECT;

    if (isEventFromMtConnectDataSource) {
      this.checkMtConnectConnectivityWarningStatus(lifeCycleEvent);
    }

    this.lifecycleBus.push(lifeCycleEvent);
  };

  /**
   * Returns the datasource object by its protocol
   */
  public getDataSourceByProto(
    protocol: DataSourceProtocols | string
  ): DataSource | undefined {
    return this.dataSources.find((src) => src.protocol === protocol);
  }

  /**
   * Return all available datasources
   */
  public getDataSources(): DataSource[] {
    return this.dataSources;
  }

  private configChangeHandler(): Promise<void> {
    if (this.dataSinksRestartPending) {
      this.dataAddedDuringRestart = true;
      return Promise.resolve();
    }
    this.dataSinksRestartPending = true;
    const logPrefix = `${DataSourcesManager.name}::configChangeHandler`;

    winston.info(`${logPrefix} reloading necessary datasources.`);

    const shutdownFns: Promise<void>[] = [];
    this.dataSources.forEach((source) => {
      // Shut down data sources with a changed configuration
      if (
        !source.configEqual(
          this.findDataSourceConfig(source.protocol),
          this.configManager.config?.termsAndConditions?.accepted
        )
      ) {
        winston.info(
          `${logPrefix} detected configuration change for ${source.protocol} data source. Preparing shutdown.`
        );
        shutdownFns.push(source.shutdown());

        this.dataSources = this.dataSources.filter(
          (dataSource) => dataSource.protocol !== source.protocol
        );
      } else {
        winston.info(
          `${logPrefix} skipping shutdown of ${source.protocol} data source. No changes detected.`
        );
      }
    });

    let err: Error;
    return Promise.allSettled(shutdownFns)
      .then((results) => {
        winston.debug(`${logPrefix} datasources disconnected.`);
        results.forEach((result) => {
          if (result.status === 'rejected')
            winston.error(`${logPrefix} error due to ${result.reason}`);
        });
      })
      .then(() => {
        winston.info(`${logPrefix} reinitializing data sources.`);
        return this.init();
      })
      .then(() => {
        winston.info(`${logPrefix} data sources restarted successfully.`);
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
          this.emit('dataSourcesRestarted', err);
        }
      });
  }
}
