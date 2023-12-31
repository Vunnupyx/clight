import { Application, Request } from 'express';
import { connector as connectorFactory } from 'swagger-routes-express';
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
  livedataDataSinksHandlers,
  setConfigManager as livedataDataSinksSetConfigManager,
  setDataPointCache as livedataDataSinksSetDataPointCache
} from '../routes/apis/v1/Livedata/DataSinks';
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
  setConfigManager as systemInfoSetConfigManager,
  setDataSinksManager
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
import { DataSourcesManager } from '../../Southbound/DataSources/DataSourcesManager';
import { DataSinksManager } from '../../Northbound/DataSinks/DataSinksManager';
import { DataPointCache } from '../../DatapointCache';
import { AuthManager } from '../AuthManager';
import swaggerFile from '../routes/swagger.json';
import { VirtualDataPointManager } from '../../VirtualDataPointManager';
import { DataSinkProtocols } from '../../../common/interfaces';
import { DataHubDataSink } from '../../Northbound/DataSinks/DataHubDataSink';

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
    ...livedataDataSinksHandlers,
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

    //TODO: Refactor
    [
      dataSourcesSetConfigManager,
      dataSinksSetConfigManager,
      backupSetConfigManager,
      vdpsSetConfigManager,
      deviceInfosSetConfigManager,
      livedataDataSourcesSetConfigManager,
      livedataDataSinksSetConfigManager,
      livedataVirtualDataPointsSetConfigManager,
      mappingSetConfigManager,
      systemInfoSetConfigManager,
      templatesConfigSetConfigManager,
      messengerConfigSetConfigManager,
      termsAndConditionsSetConfigManager
    ].forEach((func) => func(options.configManager));

    setDataSinksManager(options.dataSinksManager);
    authSetAuthManager(options.authManager);
    setDataSinksDataSinksManager(options.dataSinksManager);
    setMessengerDataSinksManager(options.dataSinksManager);
    setVdpManager(options.vdpManager);
    setTemplateDataSinksManager(options.dataSinksManager);
    setDataSourcesManager(options.dataSourcesManager);
    setTemplateDataSourcesManager(options.dataSourcesManager);
    livedataDataSourcesSetDataPointCache(options.dataPointCache);
    livedataDataSinksSetDataPointCache(options.dataPointCache);
    livedataVirtualDataPointsSetDataPointCache(options.dataPointCache);

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
    this.app.use(this.requestErrorHandler);
  }

  private requestErrorHandler(err: any, req: any, res: any, next: any) {
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.error
    });
  }
}
