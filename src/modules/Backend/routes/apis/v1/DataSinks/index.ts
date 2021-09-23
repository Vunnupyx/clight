import { ConfigManager } from '../../../../../ConfigManager';
import { Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(config: ConfigManager) {
  configManager = config;
}

/**
 * Returns list of datasinks
 */
function dataSinksGetHandler(request: Request, response: Response): void {
  response.status(200).json({
    dataSinks: configManager.config.dataSinks
  });
}
/**
 * Return single datasink resource selected by id
 */
function dataSinkGetHandler(request, response): void {
  const dataSink = configManager.config.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );
  response.status(dataSink ? 200 : 404).json(dataSink);
}

/**
 * Handle all patch requests for modifying a specific datasource.
 * Only enabling and disabling is allowed.
 */
function dataSinkPatchHandler(request: Request, response: Response): void {
  const allowed = ['enabled', 'auth'];
  const protocol = request.params.datasinkProtocol;

  const config = configManager.config;
  const dataSink = config.dataSources.find(
    (source) => source.protocol === request.params.datasourceProtocol
  );
  if (!dataSink) {
    winston.warn(``); // TODO: Define warning;
    response.status(404).send();
  }
  Object.keys(request.body).forEach((entry) => {
    if (!allowed.includes(entry)) {
      winston.warn(
        `dataSinkPatchHandler tried to change property: ${entry}. Not allowed`
      );
      response.status(403).json({
        error: `Not allowed to change ${entry}`
      });
    }
  });

  const changedDatasource = { ...dataSink, ...request.body };

  config.dataSinks = [
    ...config.dataSinks.filter((dataSink) => dataSink.protocol !== protocol),
    changedDatasource
  ];
  configManager.config = config;

  response.status(200).json(changedDatasource);
}

/**
 * Handle get request for a list of datapoints.
 */
function dataPointsGetHandler(request: Request, response: Response) {
  // @ts-ignore // TODO
  const sink = configManager?.config?.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );
  response
    .status(sink ? 200 : 404)
    .json(sink ? { dataPoints: sink.dataPoints } : null);
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
  const config = configManager.config;
  const changedSinkObject = config.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );
  const newData = { ...request.body, ...{ id: uuidv4() } };
  changedSinkObject.dataPoints.push(newData);
  configManager.config = config;

  response.status(200).json({
    created: newData,
    href: `${request.originalUrl}/datapoints/${newData.id}`
  });
}
/**
 * Change datapoint resource for datasink with selected id
 */
function dataPointPatchHandler(request: Request, response: Response) {
  //TODO: INPUT VALIDATION
  const config = configManager.config;
  const sink = config?.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );
  const dataPoint = sink?.dataPoints?.find(
    (point) => point.id === request.params.dataPointId
  );
  sink?.dataPoints.filter((point) => point.id !== request.params.dataPointId);
  const newData = { ...dataPoint, ...request.body };
  sink.dataPoints.push(newData);
  configManager.config = config;

  response.status(200).json({
    changed: newData,
    href: `${request.originalUrl}/${newData.id}`
  });
}

/**
 * Delete a datapoint inside of a datasink selected by datasinkProtocol and datapointid
 */
function dataPointDeleteHandler(request: Request, response: Response) {
  // TODO: INPUT VALIDATION
  const config = configManager?.config;
  const sink = config?.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );
  const index = sink.dataPoints.findIndex(
    (point) => point.id === request.params.dataPointId
  );
  const point = sink.dataPoints[index];
  sink.dataPoints.splice(index, 1);
  configManager.config = config;
  response.status(200).json({
    deleted: point
  });
}

export const dataSinksHandlers = {
  dataSinksGet: dataSinksGetHandler,
  dataSinkGet: dataSinkGetHandler,
  dataSinkPatch: dataSinkPatchHandler,
  dataSinksDataPointsGet: dataPointsGetHandler,
  dataSinksDataPointsPost: dataPointsPostHandler,
  dataSinksDataPointPatch: dataPointPatchHandler,
  dataSinksDataPointDelete: dataPointDeleteHandler,
  dataSinksDataPointGet: dataPointGetHandler
};
