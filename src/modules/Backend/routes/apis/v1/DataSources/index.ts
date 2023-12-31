/**
 * All request handlers for requests to datasource endpoints
 */
import { ConfigManager } from '../../../../../ConfigManager';
import { Request, Response } from 'express';
import winston from 'winston';
import { DataSourcesManager } from '../../../../../Southbound/DataSources/DataSourcesManager';
import {
  DataSourceProtocols,
  LifecycleEventStatus
} from '../../../../../../common/interfaces';
import {
  isValidIpOrHostname,
  pingSocketPromise
} from '../../../../../Utilities';
import { EnergyDataSource } from '../../../../../Southbound/DataSources/Energy';
import {
  IDataPointConfig,
  IDataSourceConfig,
  IEnergyDataSourceConnection,
  IMTConnectDataSourceConnection,
  IS7DataSourceConnection,
  isValidDataSource,
  isValidDataSourceDatapoint
} from '../../../../../ConfigManager/interfaces';
import { MTConnectDataSource } from '../../../../../Southbound/DataSources/MTConnect';

// See: https://github.com/Microsoft/TypeScript/issues/25760#issuecomment-1250630403
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
type IncomingDataSourceConfig = Optional<
  Omit<IDataSourceConfig, 'dataPoints'>,
  'type' | 'protocol'
>; // It does not have dataPoints and the rest are optional, only enabled is required

const name = 'DataSourceAPIHandler';

let configManager: ConfigManager;
let dataSourcesManager: DataSourcesManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(manager: ConfigManager): void {
  configManager = manager;
}

/**
 * Set dataSourcesManager to make accessible for local function
 */
export function setDataSourcesManager(manager: DataSourcesManager): void {
  dataSourcesManager = manager;
}

/**
 * Checks if given protocol is a valid data source protocol
 */
function isValidProtocol(protocol: any): boolean {
  return (
    typeof protocol === 'string' &&
    Object.values(DataSourceProtocols).includes(protocol as DataSourceProtocols)
  );
}

/**
 * Handle all requests for the list of datasources.
 */
function getAllDataSourcesHandler(request: Request, response: Response): void {
  const SUPPORTED_DATA_SOURCE_PROTOCOLS = [
    DataSourceProtocols.S7,
    DataSourceProtocols.IOSHIELD,
    DataSourceProtocols.ENERGY,
    DataSourceProtocols.MTCONNECT
  ];

  response.status(200).json({
    dataSources:
      configManager?.config?.dataSources?.filter((source) =>
        SUPPORTED_DATA_SOURCE_PROTOCOLS.includes(source.protocol)
      ) || []
  });
}

/**
 * Handle all get requests for a specific datasource.
 */
function getSingleDataSourceHandler(
  request: Request,
  response: Response
): void {
  const protocol = request.params.datasourceProtocol as DataSourceProtocols;
  if (!isValidProtocol(protocol)) {
    response.status(400).json({ error: 'Protocol not valid.' });
    return;
  }
  const dataSource = configManager.config?.dataSources?.find(
    (source) => source.protocol === protocol
  );
  response.status(dataSource ? 200 : 404).json(dataSource);
}

/**
 * Handle all patch requests for modifying a specific datasource.
 * Only enabling and disabling is allowed.
 */
async function patchSingleDataSourceHandler(
  request: Request,
  response: Response
): Promise<void> {
  const allowed = ['connection', 'enabled', 'softwareVersion', 'type'];
  const protocol = request.params.datasourceProtocol as DataSourceProtocols;
  const incomingConfig = request.body as IncomingDataSourceConfig; //see data-source-service.ts in client/

  if (protocol === DataSourceProtocols.MTCONNECT) {
    allowed.push('machineName');
  }
  // for instead of forEach because return does not stop forEach loop
  for (let entry of Object.keys(request.body)) {
    if (!allowed.includes(entry)) {
      winston.warn(
        `dataSourcePatchHandler tried to change property: ${entry}. Not allowed`
      );
      response.status(403).json({
        error: `Not allowed to change ${entry}`
      });
      return Promise.resolve();
    }
  }

  const dataSource = configManager.config?.dataSources?.find(
    (source) => source.protocol === protocol
  );
  if (!dataSource) {
    winston.warn(
      `patchSingleDataSourceHandler:: data source is not defined for protocol ${protocol}`
    );
    response.status(404).send();
    return Promise.resolve();
  }

  let updatedDataSource: IDataSourceConfig = {
    ...dataSource,
    ...incomingConfig,
    protocol
  };

  if (!isValidProtocol(protocol) || !isValidDataSource(updatedDataSource)) {
    if (!isValidProtocol(protocol))
      winston.verbose(
        `${name}::patchSingleDataSourceHandler protocol ${protocol} is not valid`
      );
    if (!isValidDataSource(updatedDataSource))
      winston.verbose(
        `${name}::patchSingleDataSourceHandler data source ${JSON.stringify(
          updatedDataSource
        )} is not valid`
      );

    response.status(400).json({ error: 'Input not valid.' });
    return Promise.resolve();
  }

  const config = configManager.config;
  if (config) {
    config.dataSources = [
      ...config.dataSources.filter(
        (dataSource) => dataSource.protocol !== protocol
      ),
      updatedDataSource
    ];
  }
  configManager.config = config;
  await configManager.configChangeCompleted();
  response.status(200).json(updatedDataSource);
}

/**
 * Return all datapoints of the selected datasource
 */
function getAllDataSourceDatapointsHandler(
  request: Request,
  response: Response
): void {
  if (!isValidProtocol(request.params.datasourceProtocol)) {
    response.status(400).json({ error: 'Protocol not valid.' });
    return;
  }
  const dataSource = configManager.config?.dataSources?.find(
    (source) => source.protocol === request.params.datasourceProtocol
  );
  response.status(dataSource ? 200 : 404).json({
    dataPoints: dataSource?.dataPoints
  });
}

/**
 * Bulk dataPoint changes
 */
async function patchAllDataSourceDatapointsHandler(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const protocol = request.params.datasourceProtocol as DataSourceProtocols;
    const newDataPointsArray = request.body as IDataPointConfig[];

    if (
      !isValidProtocol(protocol) ||
      !newDataPointsArray.every(isValidDataSourceDatapoint)
    ) {
      response.status(400).json({ error: 'Input not valid.' });
      return Promise.resolve();
    }

    let dataSource = configManager.config?.dataSources?.find(
      (source) => source.protocol === protocol
    );
    if (!dataSource) {
      winston.warn(
        `patchAllDataSourceDatapointsHandler:: data source is not defined for protocol ${protocol}`
      );
      response.status(404).send();
      return Promise.resolve();
    }
    dataSource = { ...dataSource, dataPoints: newDataPointsArray };
    configManager.updateInConfig<'dataSources', IDataSourceConfig>(
      'dataSources',
      dataSource,
      (item) => item.protocol === dataSource?.protocol
    );
    await configManager.configChangeCompleted();
    response.status(200).send();
  } catch (err) {
    winston.warn(`patchAllDataSourceDatapointsHandler:: error due to ${err}`);
    response
      .status(400)
      .json({ error: 'Cannot change datapoints. Try again!' });
  }
}

/**
 * Returns the current status of the selected datasource
 * @param  {Request} request
 * @param  {Response} response
 */
function getSingleDataSourceStatusHandler(
  request: Request,
  response: Response
): void {
  if (!isValidProtocol(request.params.datasourceProtocol)) {
    response.status(400).json({ error: 'Protocol not valid.' });
    return;
  }
  if (!dataSourcesManager) {
    response.status(500).send();
    winston.error(
      `dataSourceGetStatusHandler error due to no dataSourcesManager found!`
    );
    return;
  }

  let status, emProTariffNumber, showMTConnectConnectivityWarning;

  try {
    status = dataSourcesManager
      .getDataSourceByProto(request.params.datasourceProtocol)
      ?.getCurrentStatus();
    if (request.params.datasourceProtocol === DataSourceProtocols.ENERGY) {
      const energyDataSource = dataSourcesManager.getDataSourceByProto(
        request.params.datasourceProtocol
      ) as EnergyDataSource;
      emProTariffNumber = energyDataSource.getCurrentTariffNumber();
    } else if (
      request.params.datasourceProtocol === DataSourceProtocols.MTCONNECT
    ) {
      const mtConnectDataSource = dataSourcesManager.getDataSourceByProto(
        request.params.datasourceProtocol
      ) as MTConnectDataSource;
      showMTConnectConnectivityWarning =
        !!dataSourcesManager.mtConnectLastConnectionErrorTimestamp;
    }
  } catch {
    status = LifecycleEventStatus.Unavailable;
  }

  response
    .status(200)
    .json({ status, emProTariffNumber, showMTConnectConnectivityWarning });
}

/**
 * Pings data sources and sends the delay to UI
 */
async function pingDataSourceHandler(
  request: Request,
  response: Response
): Promise<void> {
  const logPrefix = `Backend::DataSources::pingDataSource`;
  let datasourceProtocol = request.params
    .datasourceProtocol as DataSourceProtocols;

  const PING_TIMEOUT = 5000;

  if (!isValidProtocol(datasourceProtocol)) {
    response.status(400).json({ error: 'Protocol not valid.' });
    return;
  }
  winston.debug(`${logPrefix} called for ${datasourceProtocol}.`);
  if (datasourceProtocol === DataSourceProtocols.IOSHIELD) {
    winston.debug(
      `${logPrefix} selected protocol is invalid for pinging: ${datasourceProtocol}`
    );
    response
      .json({
        error: {
          msg: `Not possible for ${datasourceProtocol} source`
        }
      })
      .status(404);
    return;
  }

  const dataSource = configManager.config?.dataSources?.find((src) => {
    return src.protocol === datasourceProtocol;
  });

  const ipOrHostname =
    dataSource?.protocol === DataSourceProtocols.MTCONNECT
      ? (dataSource?.connection as IMTConnectDataSourceConnection)?.hostname
      : (
          dataSource?.connection as
            | IS7DataSourceConnection
            | IEnergyDataSourceConnection
        )?.ipAddr;
  let port = (
    dataSource?.connection as
      | IS7DataSourceConnection
      | IMTConnectDataSourceConnection
  )?.port;

  if (!port && datasourceProtocol === DataSourceProtocols.ENERGY) {
    port = 80;
  }

  if (!dataSource) {
    winston.warn(
      `${logPrefix} data source is not defined for protocol ${datasourceProtocol}`
    );
    response.status(404).send();
    return Promise.resolve();
  }

  if (!ipOrHostname) {
    response
      .json({
        error: {
          msg: `No ip for ${datasourceProtocol} found.`
        }
      })
      .status(404);
    return;
  } else if (!isValidIpOrHostname(ipOrHostname)) {
    response
      .json({
        error: {
          msg: `Incorrect input.`
        }
      })
      .status(400);
    return;
  }

  try {
    let timeStart = Date.now();
    await pingSocketPromise(port!, ipOrHostname, PING_TIMEOUT);
    const delay = Date.now() - timeStart;
    winston.debug(
      `${logPrefix} successful ping for ${datasourceProtocol} at ${ipOrHostname}:${port} with ${delay}ms delay.`
    );
    response.status(200).json({
      delay
    });
    return;
  } catch (error) {
    winston.debug(
      `${logPrefix} host unreachable for ${datasourceProtocol} at ${ipOrHostname}:${port} due to ${error}.`
    );
    response.status(500).json({
      error: {
        msg: `Host unreachable.`
      }
    });
    return;
  }
}

export const dataSourceHandlers = {
  // Single DataSource
  getSingleDataSourceHandler,
  getSingleDataSourceStatusHandler,
  patchSingleDataSourceHandler,
  // Multiple DataSources
  getAllDataSourcesHandler,
  // Multiple data points
  patchAllDataSourceDatapointsHandler,
  getAllDataSourceDatapointsHandler,
  // ping to data source
  pingDataSourceHandler
};
