/**
 * All request handlers for requests to datasource endpoints
 */

import { ConfigManager } from '../../../../../ConfigManager';
import { Request, Response } from 'express';
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { DataSourcesManager } from '../../../../../DataSourcesManager';
import { LifecycleEventStatus } from '../../../../../../common/interfaces';
import { json } from 'stream/consumers';

let configManager: ConfigManager;
let dataSourcesManager: DataSourcesManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(manager: ConfigManager) {
  configManager = manager;
}

/**
 * Set dataSourcesManager to make accessible for local function
 */
export function setDataSourcesManager(manager: DataSourcesManager) {
  dataSourcesManager = manager;
}

/**
 * Handle all requests for the list of datasources.
 */
function dataSourcesGetHandler(request: Request, response: Response): void {
  response
    .status(200)
    .json({ dataSources: configManager?.config?.dataSources || [] });
}

/**
 * Handle all get requests for a specific datasource.
 */
function dataSourceGetHandler(request: Request, response: Response): void {
  const dataSource = configManager.config.dataSources.find(
    (source) => source.protocol === request.params.datasourceProtocol
  );
  response.status(dataSource ? 200 : 404).json(dataSource);
}

/**
 * Handle all patch requests for modifying a specific datasource.
 * Only enabling and disabling is allowed.
 */
function dataSourcePatchHandler(request: Request, response: Response): void {
  const allowed = ['connection', 'enabled'];
  const protocol = request.params.datasourceProtocol;

  const dataSource = configManager.config.dataSources.find(
    (source) => source.protocol === request.params.datasourceProtocol
  );
  if (!dataSource) {
    winston.warn(``); // TODO: Define warning;
    response.status(404).send();
  }
  Object.keys(request.body).forEach((entry) => {
    if (!allowed.includes(entry)) {
      winston.warn(
        `dataSourcePatchHandler tried to change property: ${entry}. Not allowed`
      );
      response.status(403).json({
        error: `Not allowed to change ${entry}`
      });
    }
  });

  const changedDatasource = { ...dataSource, ...request.body };
  const config = configManager.config;
  config.dataSources = [
    ...config.dataSources.filter(
      (dataSource) => dataSource.protocol !== protocol
    ),
    changedDatasource
  ];
  configManager.config = config;

  response.status(200).json(changedDatasource);
}

/**
 * Return all datapoints of the selected datasource
 */
function dataSourcesGetDatapointsHandler(
  request: Request,
  response: Response
): void {
  const dataSource = configManager.config.dataSources.find(
    (source) => source.protocol === request.params.datasourceProtocol
  );
  response.status(dataSource ? 200 : 404).json({
    dataPoints: dataSource.dataPoints
  });
}

/**
 * Insert a new datapoint
 */
function dataSourcesPostDatapointHandler(
  request: Request,
  response: Response
): void {
  //TODO: Inputvaidlation

  const config = configManager.config;
  const dataSource = config.dataSources.find(
    (source) => source.protocol === request.params.datasourceProtocol
  );
  const newData = { ...request.body, ...{ id: uuidv4() } };
  dataSource.dataPoints.push(newData);
  configManager.config = config;

  response.status(200).json({
    created: newData,
    href: `${request.originalUrl}/${newData.id}`
  });
}
/**
 * Returns datapoint selected by datasourceid and datapointid
 */
function dataSourcesGetDatapointHandler(
  request: Request,
  response: Response
): void {
  const dataSource = configManager.config.dataSources.find(
    (source) => source.protocol === request.params.datasourceProtocol
  );
  const point = dataSource?.dataPoints?.find(
    (point) => point.id === request.params.datapointId
  );
  response.status(dataSource && point ? 200 : 404).json(point);
}

/**
 * Deletes a datapoint selected by datasourceid and datapointid
 */
function dataSourcesDeleteDatapointHandler(
  request: Request,
  response: Response
): void {
  const config = configManager.config;
  const dataSource = config.dataSources.find(
    (source) => source.protocol === request.params.datasourceProtocol
  );
  const index = dataSource?.dataPoints?.findIndex(
    (point) => point.id === request.params.datapointId
  );
  const point = dataSource?.dataPoints[index];
  if (index >= 0) {
    dataSource.dataPoints.splice(index, 1);
  }
  configManager.config = config;

  response
    .status(dataSource && point ? 200 : 404)
    .json(dataSource && index >= 0 ? { deleted: point } : null);
}

/**
 * Overwrite a datapoint selected by datasourceid and datapointid
 */
function dataSourcesPatchDatapointHandler(
  request: Request,
  response: Response
): void {
  //TODO: Input validation
  const config = configManager.config;
  const dataSource = config.dataSources.find(
    (source) => source.protocol === request.params.datasourceProtocol
  );
  const index = dataSource?.dataPoints?.findIndex(
    (point) => point.id === request.params.datapointId
  );
  if (dataSource && index >= 0) {
    dataSource.dataPoints.splice(index, 1);

    const dataPoint = dataSource?.dataPoints?.find(
      (point) => point.id === request.params.datapointId
    );

    const newData = { ...request.body, dataPoint };
    dataSource.dataPoints.push(newData);
    configManager.config = config;
    response.status(200).json({
      changed: newData,
      href: `/api/v1/datasources/${request.params.datasourceId}/dataPoints/${newData.id}`
    });
  }
  response.status(404).send();
}

/**
 * Returns the current status of the selected datasource
 */
function dataSourceGetStatusHandler(request: Request, response: Response) {
  //TODO: Make more generic @markus
  if (!['ioshield', 's7'].includes(request.params.datasourceProtocol)) {
    response.status(404).json({ error: 'Protocol not valid' });
    winston.error(`dataSourceGetStatusHandler error due to no valid protocol!`);
    return;
  }
  if (!dataSourcesManager) {
    response.status(500).send();
    winston.error(
      `dataSourceGetStatusHandler error due to no dataSourcesManager found!`
    );
    return;
  }

  let status = dataSourcesManager
    .getDataSourceByProto(request.params.datasourceProtocol)
    .getCurrentStatus();
  status =
    status !== LifecycleEventStatus.Connected
      ? LifecycleEventStatus.Disconnected
      : status;
  response.status(200).json({ status });
}

export const dataSourceHandlers = {
  // Single DataSource
  dataSourceGet: dataSourceGetHandler,
  dataSourceGetStatus: dataSourceGetStatusHandler,
  dataSourcePatch: dataSourcePatchHandler,
  dataSourcesGet: dataSourcesGetHandler,
  // Multiple DataSources
  dataSourcesGetDatapoints: dataSourcesGetDatapointsHandler,
  dataSourcesPostDatapoint: dataSourcesPostDatapointHandler,
  dataSourcesGetDatapoint: dataSourcesGetDatapointHandler,
  dataSourcesDeleteDatapoint: dataSourcesDeleteDatapointHandler,
  dataSourcesPatchDatapoint: dataSourcesPatchDatapointHandler
};
