/**
 * All request handlers for requests to datasource endpoints
 */

import { ConfigManager } from '../../../../../ConfigManager';
import { Request, Response } from 'express';
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(manager: ConfigManager) {
  configManager = manager;
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
  configManager.changeConfig('update', 'dataSources', changedDatasource);
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
  const dataSource = configManager.config.dataSources.find(
    (source) => source.protocol === request.params.datasourceProtocol
  );
  const newData = { ...request.body, ...{ id: uuidv4() } };
  dataSource.dataPoints.push(newData);
  configManager.changeConfig('update', 'dataSources', dataSource);
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
  const dataSource = configManager.config.dataSources.find(
    (source) => source.protocol === request.params.datasourceProtocol
  );
  const index = dataSource?.dataPoints?.findIndex(
    (point) => point.id === request.params.datapointId
  );
  const point = dataSource?.dataPoints[index];
  if (index >= 0) {
    dataSource.dataPoints.splice(index, 1);
    configManager.changeConfig('update', 'dataSources', dataSource);
  }
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
  const dataSource = configManager.config.dataSources.find(
    (source) => source.protocol === request.params.datasourceProtocol
  );
  const index = dataSource?.dataPoints?.findIndex(
    (point) => point.id === request.params.datapointId
  );
  if (dataSource && index >= 0) {
    dataSource.dataPoints.splice(index, 1);
    const newData = { ...request.body, ...{ id: uuidv4() } };
    dataSource.dataPoints.push(newData);
    configManager.changeConfig('update', 'dataSources', dataSource);
    response.status(200).json({
      changed: newData,
      href: `/api/v1/datasources/${request.params.datasourceId}/dataPoints/${newData.id}`
    });
  }
  response.status(404).send();
}

export const dataSourceHandlers = {
  dataSourcesGet: dataSourcesGetHandler,
  dataSourceGet: dataSourceGetHandler,
  dataSourcePatch: dataSourcePatchHandler,
  dataSourcesGetDatapoints: dataSourcesGetDatapointsHandler,
  dataSourcesPostDatapoint: dataSourcesPostDatapointHandler,
  dataSourcesGetDatapoint: dataSourcesGetDatapointHandler,
  dataSourcesDeleteDatapoint: dataSourcesDeleteDatapointHandler,
  dataSourcesPatchDatapoint: dataSourcesPatchDatapointHandler
};
