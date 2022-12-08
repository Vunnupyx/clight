import { Application, Request } from 'express';
import { connector as connectorFactory } from 'swagger-routes-express';
import * as OpenApiValidator from 'express-openapi-validator';
import {
  authHandlers,
  setAuthManager as authSetAuthManager
} from '../routes/apis/v1/Auth';
import {
  dataSourceHandlers,
  setConfigManager as dataSourcesSetConfigManager,
  setDataSourcesManager
} from '../routes/apis/v1/DataSources';
import {
  dataSinksHandlers,
  setConfigManager as dataSinksSetConfigManager,
  setDataSinksManager as setDataSinksDataSinksManager
} from '../routes/apis/v1/DataSinks';
import {
  virtualDatapointHandlers,
  setConfigManager as vdpsSetConfigManager,
  setVdpManager
} from '../routes/apis/v1/VirtualDataPoints';
import {
  backupHandlers,
  setConfigManager as backupSetConfigManager
} from '../routes/apis/v1/Backup';
import { ntpCheckHandlers } from '../routes/apis/v1/ntp-check';
import {
  deviceInfosHandlers,
  setConfigManager as deviceInfosSetConfigManager
} from '../routes/apis/v1/DeviceInfos';
import {
  livedataDataSourcesHandlers,
  setConfigManager as livedataDataSourcesSetConfigManager,
  setDataPointCache as livedataDataSourcesSetDataPointCache
} from '../routes/apis/v1/Livedata/DataSources';
import {
  livedataVirtualDataPointsHandlers,
  setConfigManager as livedataVirtualDataPointsSetConfigManager,
  setDataPointCache as livedataVirtualDataPointsSetDataPointCache
} from '../routes/apis/v1/Livedata/VirtualDataPoints';
import {
  mappingHandlers,
  setConfigManager as mappingSetConfigManager
} from '../routes/apis/v1/Mapping';
import {
  systemInfoHandlers,
  setConfigManager as systemInfoSetConfigManager
} from '../routes/apis/v1/SystemInfo';
import {
  templatesHandlers,
  setConfigManager as templatesConfigSetConfigManager,
  setDataSourcesManager as setTemplateDataSourcesManager,
  setDataSinksManager as setTemplateDataSinksManager
} from '../routes/apis/v1/Templates';
import {
  messengerHandlers,
  setConfigManager as messengerConfigSetConfigManager,
  setDataSinksManager as setMessengerDataSinksManager
} from '../routes/apis/v1/Messenger';
import {
  termsAndConditionsHandlers,
  setConfigManager as termsAndConditionsSetConfigManager
} from '../routes/apis/v1/TermsAndConditions';
import { healthCheckHandlers } from '../routes/apis/v1/Healthcheck';
import { ConfigManager } from '../../ConfigManager';
import swaggerUi from 'swagger-ui-express';
import { DataSourcesManager } from '../../Southbound/DataSources/DataSourcesManager';
import { DataSinksManager } from '../../Northbound/DataSinks/DataSinksManager';
import { DataPointCache } from '../../DatapointCache';
import { AuthManager } from '../AuthManager';
import swaggerFile from '../routes/swagger.json';
import { VirtualDataPointManager } from '../../VirtualDataPointManager';

interface RoutesManagerOptions {
  app: Application;
  configManager: ConfigManager;
  dataSourcesManager: DataSourcesManager;
  dataSinksManager: DataSinksManager;
  dataPointCache: DataPointCache;
  authManager: AuthManager;
  vdpManager: VirtualDataPointManager;
}

/**
 * Controls all REST Routes
 */
export class RoutesManager {
  private inputValidator;
  private app: Application;
  private routeHandlers = {
    ...authHandlers,
    ...dataSourceHandlers,
    ...dataSinksHandlers,
    ...backupHandlers,
    ...ntpCheckHandlers,
    ...virtualDatapointHandlers,
    ...deviceInfosHandlers,
    ...livedataDataSourcesHandlers,
    ...livedataVirtualDataPointsHandlers,
    ...mappingHandlers,
    ...systemInfoHandlers,
    ...templatesHandlers,
    ...messengerHandlers,
    ...termsAndConditionsHandlers,
    ...healthCheckHandlers
  };

  constructor(options: RoutesManagerOptions) {
    this.app = options.app;

    // TODO: Remove swagger ui route
    this.app.use(
      '/apidocs',
      swaggerUi.serveFiles(swaggerFile, {}),
      swaggerUi.setup(swaggerFile)
    );

    //TODO: Refactor
    [
      dataSourcesSetConfigManager,
      dataSinksSetConfigManager,
      backupSetConfigManager,
      vdpsSetConfigManager,
      deviceInfosSetConfigManager,
      livedataDataSourcesSetConfigManager,
      livedataVirtualDataPointsSetConfigManager,
      mappingSetConfigManager,
      systemInfoSetConfigManager,
      templatesConfigSetConfigManager,
      messengerConfigSetConfigManager,
      termsAndConditionsSetConfigManager
    ].forEach((func) => func(options.configManager));
    authSetAuthManager(options.authManager);
    setDataSinksDataSinksManager(options.dataSinksManager);
    setMessengerDataSinksManager(options.dataSinksManager);
    setVdpManager(options.vdpManager);
    setTemplateDataSinksManager(options.dataSinksManager);
    setDataSourcesManager(options.dataSourcesManager);
    setTemplateDataSourcesManager(options.dataSourcesManager);
    livedataDataSourcesSetDataPointCache(options.dataPointCache);
    livedataVirtualDataPointsSetDataPointCache(options.dataPointCache);

    this.inputValidator = OpenApiValidator.middleware({
      apiSpec: swaggerFile as any,
      validateRequests: false,
      validateResponses: false
    });

    //TODO: Make code async ?
    connectorFactory(this.routeHandlers, swaggerFile, {
      security: {
        jwt: (req, res, next) =>
          options.authManager.verifyJWTAuth({
            withPasswordChangeDetection: true
          })(req as Request, res, next),
        jwtNoPasswordChangeDetection: (req, res, next) =>
          options.authManager.verifyJWTAuth({
            withPasswordChangeDetection: false
          })(req as Request, res, next)
      }
    })(this.app);
    // this.app.use(this.inputValidator);
    this.app.use(this.requestErrorHandler);
  }

  private requestErrorHandler(err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.error
    });
  }
}
