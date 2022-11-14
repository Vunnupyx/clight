import express, { Express, Request, Response } from 'express';
import winston from 'winston';
import fileUpload from 'express-fileupload';
import proxy from 'express-http-proxy';
import { ConfigManager } from '../../ConfigManager';
import { IRestApiConfig, IRuntimeConfig } from '../../ConfigManager/interfaces';
import { RoutesManager } from '../RoutesManager';
import { json as jsonParser } from 'body-parser';
import { DataSourcesManager } from '../../Southbound/DataSources/DataSourcesManager';
import { DataSinksManager } from '../../Northbound/DataSinks/DataSinksManager';
import { DataPointCache } from '../../DatapointCache';
import { AuthManager } from '../AuthManager';
import { VirtualDataPointManager } from '../../VirtualDataPointManager';

interface RestApiManagerOptions {
  configManager: ConfigManager;
  dataSourcesManager: DataSourcesManager;
  dataSinksManager: DataSinksManager;
  dataPointCache: DataPointCache;
  vdpManager: VirtualDataPointManager;
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

  /**
   * Init all REST Api dependencies
   */
  private init() {
    const logPrefix = `${RestApiManager.className}::init`;
    winston.info(`${logPrefix} Initializing rest api`);

    this.config = this.options.configManager.runtimeConfig.restApi;
    this.port = Number.parseInt(process.env.PORT) || this.config.port || 5000;

    const authManager = new AuthManager(this.options.configManager);

    this.expressApp.use(
      '/configuration-agent/v1',
      this.getProxySettings(authManager)
    );
    this.expressApp.use(
      jsonParser({
        limit: this.config.maxFileSizeByte,
        inflate: true
      })
    );

    this.expressApp.use(fileUpload());

    this.expressApp.disable('x-powered-by');
    this.routeManager = new RoutesManager({
      app: this.expressApp,
      configManager: this.options.configManager,
      dataSourcesManager: this.options.dataSourcesManager,
      dataSinksManager: this.options.dataSinksManager,
      dataPointCache: this.options.dataPointCache,
      vdpManager: this.options.vdpManager,
      authManager
    });

    this.start();
  }

  private getProxySettings(authManager: AuthManager) {
    const logPrefix = `${RestApiManager.className}::getProxySettings`;

    const PATH_PREFIX = '/api/v1';
    return proxy('http://host.docker.internal:1884', {
      filter: (req: Request, res: Response) => {
        const isAuthenticated = authManager.verifyJWTAuth({
          withPasswordChangeDetection: true,
          withBooleanResponse: true
        })(req, res);

        if (!isAuthenticated) {
          winston.warn(
            `${logPrefix} Unauthorized attempt to access Configuration Agent proxy, requested URL: ${req.url}`
          );
        }
        return isAuthenticated;
      },
      proxyReqOptDecorator: (proxyReqOpts) => {
        // Update headers
        delete proxyReqOpts.headers['Authorization'];
        delete proxyReqOpts.headers['authorization'];
        return proxyReqOpts;
      },
      proxyReqPathResolver: (req) => {
        return `${PATH_PREFIX}${req.url}`;
      },
      proxyErrorHandler: function (err, res, next) {
        winston.error(
          `${logPrefix} Error at Configuration Agent proxy:${err?.code}`
        );
        next(err);
      }
    });
  }

  /**
   * Start RestApiManager and all dependencies.
   * @returns RestApiManager
   */
  private start(): RestApiManager {
    const logPrefix = `${RestApiManager.className}::start`;

    winston.info(`${logPrefix} Starting backend server`);
    this.expressApp.listen(this.port, () =>
      winston.info(`${logPrefix} Backend server listening on port ${this.port}`)
    );
    return this;
  }
}
