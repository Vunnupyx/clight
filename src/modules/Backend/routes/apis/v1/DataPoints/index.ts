import { ConfigManager } from '../../../../../ConfigManager';
import { Request, Response } from 'express';

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
  response.status(200).json({ dataPoints: configManager?.config?.dataPoints });
}

/**
 * Handle get request for a single datapoint, selected by id via path parameter.
 */
function dataPointGetHandler(request: Request, response: Response) {
  const sink = configManager?.config?.dataSinks.find(
    (sink) => sink.id === request.params.datasinkId
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
    (sink) => sink.id === request.params.datasinkId
  );
  changedSinkObject.dataPoints.push(request.body);
  configManager?.changeConfig('update', 'dataSinks', changedSinkObject);
  response.status(200).json(request.body);
}
/**
 * Change datapoint resource for datasink with selected id
 */
function dataPointPatchHandler(request: Request, response: Response) {
  //TODO: INPUT VALIDATION
  const sink = configManager?.config?.dataSinks.find(
    (sink) => sink.id === request.params.datasinkId
  );
  const index = sink.dataPoints.findIndex(
    (point) => point.id === request.params.dataPointId
  );
  sink.dataPoints.splice(index, 1);
  sink.dataPoints.push(request.body);
  configManager?.changeConfig('update', 'dataSinks', sink);
  response.status(200).send();
}

/**
 * Delete a datepoint inside of a datasink selected be datasinkid and datapointid
 */
function dataPointDeleteHandler(request: Request, response: Response) {
  // TODO: INPUT VALIDATION
  const sink = configManager?.config?.dataSinks.find(
    (sink) => sink.id === request.params.datasinkId
  );
  const index = sink.dataPoints.findIndex(
    (point) => point.id === request.params.dataPointId
  );
  sink.dataPoints.splice(index, 1);
  configManager?.changeConfig('update', 'dataSinks', sink);
  response.status(200).send();
}

export const dataPointsHandlers = {
  dataPointsGet: dataPointsGetHandler,
  dataPointsPost: dataPointsPostHandler,
  dataPointPatch: dataPointPatchHandler,
  dataPointDelete: dataPointDeleteHandler,
  dataPointGet: dataPointGetHandler
};
