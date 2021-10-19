import { Application, Request } from 'express';
import {
  connector as connectorFactory
} from 'swagger-routes-express';
import * as OpenApiValidator from 'express-openapi-validator';
import path from 'path';
import fs from 'fs';
import {
  authHandlers,
  setAuthManager as authSetAuthManager,
} from '../routes/apis/v1/Auth';
import {
  dataSourceHandlers,
  setConfigManager as dataSourcesSetConfigManager,
  setDataSourcesManager
} from '../routes/apis/v1/DataSources';
import {
  dataSinksHandlers,
  setConfigManager as dataSinksSetConfigManager,
  setDataSinksManager
} from '../routes/apis/v1/DataSinks';
import {
  virtualDatapointHandlers,
  setConfigManager as vdpsSetConfigManager
} from '../routes/apis/v1/VirtualDataPoints';
import {
  backupHandlers,
  setConfigManager as backupSetConfigManager
} from '../routes/apis/v1/Backup';
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
  networkConfigHandlers,
  setConfigManager as networkConfigSetConfigManager
} from '../routes/apis/v1/NetworkConfig';
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
import { ConfigManager } from '../../ConfigManager';
import swaggerUi from 'swagger-ui-express';
import { DataSourcesManager } from '../../Southbound/DataSources/DataSourcesManager';
import { DataSinksManager } from '../../Northbound/DataSinks/DataSinksManager';
import { DataPointCache } from '../../DatapointCache';
import { AuthManager } from '../AuthManager';
import swaggerFile from '../routes/swagger';

interface RoutesManagerOptions {
  app: Application;
  configManager: ConfigManager;
  dataSourcesManager: DataSourcesManager;
  dataSinksManager: DataSinksManager;
  dataPointCache: DataPointCache,
  authManager: AuthManager;
}
export class RoutesManager {
  private swaggerFilePath = path.join(__dirname, '../routes/swagger.json');
  private inputValidator;
  private app: Application;
  private routeHandlers = {
    ...authHandlers,
    ...dataSourceHandlers,
    ...dataSinksHandlers,
    ...backupHandlers,
    ...virtualDatapointHandlers,
    ...deviceInfosHandlers,
    ...livedataDataSourcesHandlers,
    ...livedataVirtualDataPointsHandlers,
    ...mappingHandlers,
    ...networkConfigHandlers,
    ...systemInfoHandlers,
    ...templatesHandlers
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
      networkConfigSetConfigManager,
      systemInfoSetConfigManager,
      templatesConfigSetConfigManager
    ].forEach((func) => func(options.configManager));
    authSetAuthManager(options.authManager);
    setDataSinksManager(options.dataSinksManager);
    setTemplateDataSinksManager(options.dataSinksManager);
    setDataSourcesManager(options.dataSourcesManager);
    setTemplateDataSourcesManager(options.dataSourcesManager);
    livedataDataSourcesSetDataPointCache(options.dataPointCache);
    livedataVirtualDataPointsSetDataPointCache(options.dataPointCache);

    this.inputValidator = OpenApiValidator.middleware({
      // @ts-ignore
      apiSpec: swaggerFile,
      validateRequests: false,
      validateResponses: false
    });

    //TODO: Make code async ?
    connectorFactory(this.routeHandlers, swaggerFile, {
      security: {
        jwt: (req, res, next) => options.authManager.verifyJWTAuth(req as Request, res, next)
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
