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
  setConfigManager as dataSourcesSetConfigManager
} from '../routes/apis/v1/DataSources';
import {
  dataSinksHandlers,
  setConfigManager as dataSinksSetConfigManager
} from '../routes/apis/v1/DataSinks';
import {
  virtualDatapointHandlers,
  setConfigManger as vdpsSetConfigManager
} from '../routes/apis/v1/VirtualDataPoints';
import {
  backupHandlers,
  setConfigManger as backupSetConfigManager
} from '../routes/apis/v1/Backup';
import {
  deviceInfosHandlers,
  setConfigManger as deviceInfosSetConfigManager
} from '../routes/apis/v1/DeviceInfos';
import { ConfigManager } from '../../ConfigManager';
import swaggerUi from 'swagger-ui-express';

export class RoutesManager {
  private swaggerFilePath = path.join(__dirname, '../routes/swagger.json');
  private inputValidator;
  private app: Application;
  private routeHandlers = {
    ...dataSourceHandlers,
    ...dataSinksHandlers,
    ...backupHandlers,
    ...virtualDatapointHandlers,
    ...deviceInfosHandlers
  };

  constructor(app: Application, configManager: ConfigManager) {
    this.app = app;
    const swaggerFile = JSON.parse(
      fs.readFileSync(this.swaggerFilePath, { encoding: 'utf8' })
    );

    // TODO: Remove swagger ui route
    app.use(
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
      deviceInfosSetConfigManager
    ].forEach((func) => func(configManager));

    this.inputValidator = OpenApiValidator.middleware({
      apiSpec: swaggerFile,
      validateRequests: false,
      validateResponses: false
    });

    //TODO: Make code sync
    connectorFactory(
      this.routeHandlers,
      require('../routes/swagger.json')
    )(app);
    // this.app.use(this.inputValidator);
    // this.app.use(this.requestErrorHandler);
  }

  private requestErrorHandler(err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.error
    });
  }
}
