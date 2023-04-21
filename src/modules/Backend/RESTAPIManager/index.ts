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
import { ConfigurationAgentManager } from '../../ConfigurationAgentManager';
import { ICosSystemCommissioningStatus } from '../../ConfigurationAgentManager/interfaces';

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
  private endpointsAllowedForCommissioningWithoutJWT = [
    '/machine/info',
    '/system/commissioning',
    '/network/adapters/enoX1',
    '/network/adapters/enoX1/status',
    '/datahub/dps',
    '/system/commissioning/finish',
    '/datahub/status/mdclight',
    '/datahub/status/edgeAgent',
    '/datahub/status/edgeHub',
    '/datahub/status/mdc-web-server',
    '/datahub/status/mtconnect-agent'
  ];
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

    return proxy(
      `${ConfigurationAgentManager.hostname}:${ConfigurationAgentManager.port}`,
      {
        filter: (req: Request, res: Response) => {
          // If device is not commissioned allowed these endpoints so that commissioning can be performed
          if (
            !this.options.configManager.isDeviceCommissioned &&
            this.endpointsAllowedForCommissioningWithoutJWT.includes(req.url)
          ) {
            winston.info(
              `${logPrefix} requested URL: ${req.url}, allowed for commissioning`
            );
            return true;
          }

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
        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
          if (
            userReq.url === '/system/commissioning/finish' &&
            userReq.method === 'POST'
          ) {
            const responseData: ICosSystemCommissioningStatus = JSON.parse(
              proxyResData.toString('utf8')
            );
            if (proxyRes.statusCode === 201 && responseData.Finished === true) {
              winston.info(
                `${logPrefix} Device commissioning finished, setting internal status to commissioned`
              );
              this.options.configManager.isDeviceCommissioned = true;
            } else {
              winston.warn(
                `${logPrefix} Device commissioning response is not successful! Response code: ${
                  proxyRes.statusCode
                }, response: ${JSON.stringify(responseData)}`
              );
            }
          }
          return proxyResData;
        },
        proxyReqOptDecorator: (proxyReqOpts) => {
          // Update headers
          delete proxyReqOpts.headers['Authorization'];
          delete proxyReqOpts.headers['authorization'];
          return proxyReqOpts;
        },
        proxyReqPathResolver: (req) => {
          return `${ConfigurationAgentManager.pathPrefix}${req.url}`;
        },
        proxyErrorHandler: function (err, res, next) {
          winston.error(
            `${logPrefix} Error at Configuration Agent proxy:${err}`
          );
          next(err);
        }
      }
    );
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
