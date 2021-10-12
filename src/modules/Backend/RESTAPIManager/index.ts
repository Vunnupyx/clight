import express, {
  Express} from 'express';
import winston from 'winston';
import { ConfigManager } from '../../ConfigManager';
import { IRestApiConfig, IRuntimeConfig } from '../../ConfigManager/interfaces';
import { RoutesManager } from '../RoutesManager';
import { json as jsonParser } from 'body-parser';
import { DataSourcesManager } from '../../DataSourcesManager';
import { DataSinksManager } from '../../Northbound/DataSinks/DataSinksManager';
import { DataPointCache } from '../../DatapointCache';

interface RestApiManagerOptions {
  configManager: ConfigManager,
  dataSourcesManager: DataSourcesManager,
  dataSinksManager: DataSinksManager,
  dataPointCache: DataPointCache,
}

/**
 * Manage express server implementation.
 */
export class RestApiManager {
  private port: number;
  private config: IRestApiConfig;
  private readonly expressApp: Express = express();
  private routeManager: RoutesManager;

  private static className: string;

  constructor(options: RestApiManagerOptions) {
    RestApiManager.className = this.constructor.name;
    const logPrefix = `${RestApiManager.className}::constructor`;

    const {configManager , dataSourcesManager} = options;
    this.config = configManager.runtimeConfig.restApi;
    configManager.on('newRuntimeConfig', this.newRuntimeConfigHandle.bind(this));
    this.port = this.config.port || Number.parseInt(process.env.PORT) || 5000;

    // TODO: Maybe move to init method
    this.expressApp.use(
      jsonParser({
        limit: this.config.maxFileSizeByte,
        inflate: true
      })
    );
    this.expressApp.disable('x-powered-by');
    this.routeManager = new RoutesManager({
      app: this.expressApp,
      configManager :configManager,
      dataSourcesManager: dataSourcesManager,
      dataSinksManager: options.dataSinksManager,
      dataPointCache: options.dataPointCache
    });
  }

  /**
   * Start RestApiManager and all dependencies.
   */
  public start(): RestApiManager {
    const logPrefix = `${RestApiManager.className}::start`;
    this.expressApp.listen(this.port, () =>
      winston.info(`Backend server listening on port ${this.config.port}`)
    );
    return this;
  }

  private newRuntimeConfigHandle(config: IRuntimeConfig) {
    const logPrefix = `${RestApiManager.className}::newRuntimeConfigHandle`;
    //TODO: implement restart of the express server
    winston.warn(`${logPrefix} receive a config change. Reactions to this event not implemented, yet.`)
  }
}
