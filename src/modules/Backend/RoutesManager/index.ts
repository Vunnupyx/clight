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
  setDataSinksManager as setTemplateDataSinksManager,
} from '../routes/apis/v1/Templates';
import { ConfigManager } from '../../ConfigManager';
import swaggerUi from 'swagger-ui-express';
import { DataSourcesManager } from '../../DataSourcesManager';
import { DataSinksManager } from '../../Northbound/DataSinks/DataSinksManager';

interface RoutesManagerOptions {
  app: Application
  configManager: ConfigManager,
  dataSourcesManager: DataSourcesManager,
  dataSinksManager: DataSinksManager
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
    ...mappingHandlers,
    ...networkConfigHandlers,
    ...systemInfoHandlers,
    ...templatesHandlers,
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
      mappingSetConfigManager,
      networkConfigSetConfigManager,
      systemInfoSetConfigManager,
      templatesConfigSetConfigManager,
    ].forEach((func) => func(options.configManager));
    setDataSinksManager(options.dataSinksManager)
    setTemplateDataSinksManager(options.dataSinksManager)
    setDataSourcesManager(options.dataSourcesManager);
    setTemplateDataSourcesManager(options.dataSourcesManager);

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
