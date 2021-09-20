import { ConfigManager } from '../../../../../ConfigManager';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManger(config: ConfigManager) {
  configManager = config;
}

/**
 * Handle get request for a list of datapoints.
 */
function dataPointsGetHandler(request: Request, response: Response) {
  // @ts-ignore // TODO
  const sink = configManager?.config?.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol);
  response.status(sink ? 200 : 404).json(sink ? { dataPoints: sink.dataPoints} : null);
}

/**
 * Handle get request for a single datapoint, selected by id via path parameter.
 */
function dataPointGetHandler(request: Request, response: Response) {
  const sink = configManager?.config?.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );
  const point = sink.dataPoints.find(
    (datapoint) => datapoint.id === request.params.dataPointId
  );
  response.status(point && sink ? 200 : 404).json(point);
}

/**
 * Create a new dataPoints resource for datasink selected by id.
 */
function dataPointsPostHandler(request: Request, response: Response) {
  // TODO: Input validation, maybe id is already taken
  const changedSinkObject = configManager.config.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );
  const newData = {...request.body,...{id: uuidv4()}}
  changedSinkObject.dataPoints.push(newData);
  configManager?.changeConfig('update', 'dataSinks', changedSinkObject);
  response.status(200).json({
    created: newData,
    href: `$/datasinks/${request.params.datasinkId}/datapoints/${newData.id}`
  });
}
/**
 * Change datapoint resource for datasink with selected id
 */
function dataPointPatchHandler(request: Request, response: Response) {
  //TODO: INPUT VALIDATION
  const sink = configManager?.config?.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );
  const index = sink?.dataPoints?.findIndex(
    (point) => point.id === request.params.dataPointId
  );
  sink.dataPoints.splice(index, 1);
  const newData = {...request.body,...{id: uuidv4()}};
  sink.dataPoints.push(newData);
  configManager?.changeConfig('update', 'dataSinks', sink);
  response.status(200).json({
    changed: newData,
    href: `$/datasinks/${request.params.datasinkId}/datapoints/${newData.id}`
  });
}

/**
 * Delete a datapoint inside of a datasink selected by datasinkid and datapointid
 */
function dataPointDeleteHandler(request: Request, response: Response) {
  // TODO: INPUT VALIDATION
  const sink = configManager?.config?.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );
  const index = sink.dataPoints.findIndex(
    (point) => point.id === request.params.dataPointId
  );
  const point = sink.dataPoints[index];
  sink.dataPoints.splice(index, 1);
  configManager?.changeConfig('update', 'dataSinks', sink);
  response.status(200).json({
    deleted: point
  });
}

export const dataPointsHandlers = {
  dataPointsGet: dataPointsGetHandler,
  dataPointsPost: dataPointsPostHandler,
  dataPointPatch: dataPointPatchHandler,
  dataPointDelete: dataPointDeleteHandler,
  dataPointGet: dataPointGetHandler
};
