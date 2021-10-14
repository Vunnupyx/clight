import express, { Express } from 'express';
import winston from 'winston';
import { ConfigManager } from '../../ConfigManager';
import { IRestApiConfig, IRuntimeConfig } from '../../ConfigManager/interfaces';
import { RoutesManager } from '../RoutesManager';
import { json as jsonParser } from 'body-parser';
import { DataSourcesManager } from '../../DataSourcesManager';
import { DataSinksManager } from '../../Northbound/DataSinks/DataSinksManager';
import { DataPointCache } from '../../DatapointCache';

interface RestApiManagerOptions {
  configManager: ConfigManager;
  dataSourcesManager: DataSourcesManager;
  dataSinksManager: DataSinksManager;
  dataPointCache: DataPointCache;
}

/**
 * Manage express server implementation.
 */
export class RestApiManager {
  private port: number;
  private config: IRestApiConfig;
  private readonly expressApp: Express = express();
  private options: RestApiManagerOptions;
  private routeManager: RoutesManager;

  private static className: string;

  constructor(options: RestApiManagerOptions) {
    this.options = options;

    RestApiManager.className = this.constructor.name;
    const logPrefix = `${RestApiManager.className}::constructor`;

    this.options.configManager.once('configsLoaded', () => {
      return this.init();
    });
  }

  private init() {
    const logPrefix = `${RestApiManager.className}::init`;
    winston.info(`${logPrefix} Initializing rest api`);

    this.config = this.options.configManager.runtimeConfig.restApi;
    this.port = this.config.port || Number.parseInt(process.env.PORT) || 5000;

    this.expressApp.use(
      jsonParser({
        limit: this.config.maxFileSizeByte,
        inflate: true
      })
    );
    this.expressApp.disable('x-powered-by');
    this.routeManager = new RoutesManager({
      app: this.expressApp,
      configManager: this.options.configManager,
      dataSourcesManager: this.options.dataSourcesManager,
      dataSinksManager: this.options.dataSinksManager,
      dataPointCache: this.options.dataPointCache
    });

    this.start();
  }

  /**
   * Start RestApiManager and all dependencies.
   */
  private start(): RestApiManager {
    const logPrefix = `${RestApiManager.className}::start`;

    winston.info(`${logPrefix} Starting backend server`);
    this.expressApp.listen(this.port, () =>
      winston.info(
        `${logPrefix} Backend server listening on port ${this.config.port}`
      )
    );
    return this;
  }
}
