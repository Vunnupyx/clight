import { ConfigManager } from '../../../../../ConfigManager';
import { Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';
import { hash } from 'bcrypt';
import { DataSinkManager } from '../../../../../DataSinkManager';
import { LifecycleEventStatus } from '../../../../../../common/interfaces';

let configManager: ConfigManager;
let dataSinksManager: DataSinkManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(config: ConfigManager) {
  configManager = config;
}

export function setDataSinksManager(manager: DataSinkManager) {
  dataSinksManager = manager;
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
async function dataSinkPatchHandler(
  request: Request,
  response: Response
): Promise<void> {
  let allowed = ['enabled', 'auth'];
  const protocol = request.params.datasinkProtocol;

  const config = configManager.config;
  let dataSink = config.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );

  // If protocol is s7 it´s not allowed to change auth prop,
  if (protocol !== 'opcua') allowed = ['enabled'];
  if (!dataSink) {
    winston.warn(
      `dataSinkPatchHandler error due to datasink with protocol ${protocol} not found.`
    );
    response.status(404).send();
    return Promise.resolve();
  }
  for (const entry of Object.keys(request.body)) {
    if (!allowed.includes(entry)) {
      winston.warn(
        `dataSinkPatchHandler tried to change property: ${entry}. Not allowed`
      );
      response.status(403).json({
        error: `Not allowed to change ${entry}`
      });
      return Promise.resolve();
    }
  };
  if (request.body.auth && 
    'type' in request.body.auth &&
    'userName' in request.body.auth &&
    'password' in request.body.auth
    ) {
    request.body.auth.password = await hash(
      request.body.auth.password,
      10
    );
  } else {
    winston.warn(`dataSinkPatchHandler tried to change property: auth .Infos missing.`)
  }

  dataSink = { ...dataSink, ...request.body };
  configManager.changeConfig('update', 'dataSinks', dataSink);
  response.status(200).json(dataSink);
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

/** 
 * Return the current status of the selected datasink. Status is collected from the EventBus 
*/
function dataSinkGetStatusHandler(request: Request, response: Response) {
  const proto = request.params?.datasinkProtocol
  if(!proto || !['mtconnect', 'opcua'].includes(proto)) {
    response.status(404).json({error: "Protocol not valid."});
    winston.warn('dataSinkGetStatusHandler error due to no valid protocol!')
    return;
  }
  if(!dataSinksManager) {
    response.status(500).send();
    winston.error('dataSinkGetStatusHandler error no dataSinksManager set.');
    return;
  }


  const boolStatus = dataSinksManager.getDataSinkByProto(request.params.datasinkProtocol).currentStatus();
  let status: LifecycleEventStatus = LifecycleEventStatus.Connected;
  if(!boolStatus) { 
    status = LifecycleEventStatus.Disconnected;
  }
  response.status(200).json({status})
}

export const dataSinksHandlers = {
  dataSinksGet: dataSinksGetHandler,
  dataSinkGet: dataSinkGetHandler,
  dataSinkPatch: dataSinkPatchHandler,
  dataSinksDataPointsGet: dataPointsGetHandler,
  dataSinksDataPointsPost: dataPointsPostHandler,
  dataSinksDataPointPatch: dataPointPatchHandler,
  dataSinksDataPointDelete: dataPointDeleteHandler,
  dataSinksDataPointGet: dataPointGetHandler,
  dataSinkGetStatus: dataSinkGetStatusHandler
};
