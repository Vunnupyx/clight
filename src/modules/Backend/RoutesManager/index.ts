import express, { Application, Response, Router } from 'express';
import {
  connector as connectorFactory,
  Controllers
} from 'swagger-routes-express';
import * as OpenApiValidator from 'express-openapi-validator';
import path from 'path';
import fs from 'fs';
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
  mappingHandlers,
  setConfigManager as mappingSetConfigManager
} from '../routes/apis/v1/Mapping';
import { ConfigManager } from '../../ConfigManager';
import swaggerUi from 'swagger-ui-express';
import { DataSourcesManager } from '../../DataSourcesManager';
import { DataSinkManager } from '../../DataSinkManager';

interface RoutesManagerOptions {
  app: Application
  configManager: ConfigManager,
  dataSourcesManager: DataSourcesManager,
  dataSinksManager: DataSinkManager
}
export class RoutesManager {
  private swaggerFilePath = path.join(__dirname, '../routes/swagger.json');
  private inputValidator;
  private app: Application;
  private routeHandlers = {
    ...dataSourceHandlers,
    ...dataSinksHandlers,
    ...backupHandlers,
    ...virtualDatapointHandlers,
    ...deviceInfosHandlers,
    ...mappingHandlers
  };

  constructor(options: RoutesManagerOptions) {
    this.app = options.app;
    const swaggerFile = JSON.parse(
      fs.readFileSync(this.swaggerFilePath, { encoding: 'utf8' })
    );

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
      mappingSetConfigManager
    ].forEach((func) => func(options.configManager));
    setDataSinksManager(options.dataSinksManager)
    setDataSourcesManager(options.dataSourcesManager);

    this.inputValidator = OpenApiValidator.middleware({
      apiSpec: swaggerFile,
      validateRequests: false,
      validateResponses: false
    });

    //TODO: Make code async ?
    connectorFactory(
      this.routeHandlers,
      require('../routes/swagger.json')
    )(this.app);
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
