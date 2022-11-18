import { ConfigManager } from '../../../../../ConfigManager';
import { IDataSinkConfig } from '../../../../../ConfigManager/interfaces';
import { Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';
import { hash } from 'bcrypt';
import { DataSinksManager } from '../../../../../Northbound/DataSinks/DataSinksManager';
import { DataHubDataSink } from '../../../../../Northbound/DataSinks/DataHubDataSink';
import {
  DataSinkProtocols,
  LifecycleEventStatus
} from '../../../../../../common/interfaces';

let configManager: ConfigManager;
let dataSinksManager: DataSinksManager;

interface IDataSinkConfigResponse extends IDataSinkConfig {
  desired?: {
    services?: {
      [key: string]: {
        enabled: boolean;
      };
    };
  };
}

/**
 * Set ConfigManager to make accessible for local function
 * @param {ConfigManager} config
 */
export function setConfigManager(config: ConfigManager) {
  configManager = config;
}

/**
 * Set DataSinksManager to make accessible for local function
 * @param {DataSinksManager} manager
 */
export function setDataSinksManager(manager: DataSinksManager) {
  dataSinksManager = manager;
}

/**
 * Returns list of datasinks
 * @param  {Request} request
 * @param  {Response} response
 */
function dataSinksGetHandler(request: Request, response: Response): void {
  const dataSinks: IDataSinkConfigResponse[] = configManager.config.dataSinks;

  dataSinks.forEach((dataSink) => {
    if (dataSink.protocol === DataSinkProtocols.DATAHUB) {
      const sink = dataSinksManager.getDataSinkByProto(
        DataSinkProtocols.DATAHUB
      ) as DataHubDataSink;

      dataSink.desired = sink?.getDesiredPropertiesServices();
    }
  });

  response.status(200).json({
    dataSinks: configManager.config.dataSinks
  });
}
/**
 * Return single datasink resource selected by id
 * @param  {Request} request
 * @param  {Response} response
 */
function dataSinkGetHandler(request, response): void {
  const dataSink: IDataSinkConfigResponse = configManager.config.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );

  if (dataSink.protocol === DataSinkProtocols.DATAHUB) {
    const sink = dataSinksManager.getDataSinkByProto(
      DataSinkProtocols.DATAHUB
    ) as DataHubDataSink;
    dataSink.desired = sink?.getDesiredPropertiesServices();
  }

  response.status(dataSink ? 200 : 404).json(dataSink);
}

/**
 * Handle all patch requests for modifying a specific datasource.
 * Only enabling and disabling is allowed.
 * @param  {Request} request
 * @param  {Response} response
 */
async function dataSinkPatchHandler(
  request: Request,
  response: Response
): Promise<void> {
  let allowed = ['enabled', 'auth', 'customDataPoints'];
  const protocol = request.params.datasinkProtocol;

  const config = configManager.config;
  let dataSink = config.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );

  // If protocol is s7 it´s not allowed to change auth prop,
  if (protocol === 's7') allowed = ['enabled'];

  // If protocol is datahub it´s allowed to change only datahub,
  if (protocol === 'datahub') allowed = ['datahub'];

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
  }

  if (
    protocol === 'opcua' &&
    request.body.auth &&
    request.body.auth.type === 'anonymous'
  ) {
    delete request.body.auth.userName;
    delete request.body.auth.password;
  }

  if (
    request.body.auth &&
    'type' in request.body.auth &&
    'userName' in request.body.auth &&
    'password' in request.body.auth
  ) {
    request.body.auth.password = await hash(request.body.auth.password, 10);
  } else {
    winston.warn(
      `dataSinkPatchHandler tried to change property: auth .Infos missing.`
    );
  }

  dataSink = { ...dataSink, ...request.body };
  configManager.changeConfig(
    'update',
    'dataSinks',
    dataSink,
    (item) => item.protocol
  );
  await configManager.configChangeCompleted();
  response.status(200).json(dataSink);
}

/**
 * @async
 * Bulk dataPoint changes
 * @param  {Request} request
 * @param  {Response} response
 */
async function dataSinksPostDatapointBulkHandler(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const proto = request.params?.datasinkProtocol;
    if (!proto || !['mtconnect', 'opcua', 'datahub'].includes(proto)) {
      response.status(404).json({ error: 'Protocol not valid.' });
      winston.warn(
        'dataSinksPostDatapointBulkHandler error due to no valid protocol!'
      );
      return;
    }

    await configManager.bulkChangeDataSinkDataPoints(
      proto as DataSinkProtocols,
      request.body || {}
    );
    await configManager.configChangeCompleted();
    response.status(200).send();
  } catch (err) {
    winston.warn(
      `dataSinksPostDatapointBulkHandler tried to change bulk dataSink.dataPoints`
    );
    response
      .status(400)
      .json({ error: 'Cannot change datapoints. Try again!' });
  }
}

/**
 * Handle get request for a list of datapoints.
 * @param  {Request} request
 * @param  {Response} response
 */
function dataPointsGetHandler(request: Request, response: Response) {
  const sink = configManager?.config?.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );
  response
    .status(sink ? 200 : 404)
    .json(sink ? { dataPoints: sink.dataPoints } : null);
}

/**
 * Handle get request for a single datapoint, selected by id via path parameter.
 * @param  {Request} request
 * @param  {Response} response
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
 * @param  {Request} request
 * @param  {Response} response
 */
async function dataPointsPostHandler(
  request: Request,
  response: Response
): Promise<void> {
  // TODO: Input validation, maybe id is already taken
  const config = configManager.config;
  const changedSinkObject = config.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );

  if (
    changedSinkObject.dataPoints.some(
      (dp) => dp.address === request.body.address
    )
  ) {
    winston.warn(`dataPointsPostHandler error due to existance of dataPoint`);

    response.status(400).send();
    return Promise.resolve();
  }

  const newData = { ...request.body, ...{ id: uuidv4() } };
  changedSinkObject.dataPoints.push(newData);
  configManager.config = config;
  await configManager.configChangeCompleted();
  response.status(200).json({
    created: newData,
    href: `${request.originalUrl}/datapoints/${newData.id}`
  });
}

/**
 * Change datapoint resource for datasink with selected id
 * @param  {Request} request
 * @param  {Response} response
 */
async function dataPointPatchHandler(
  request: Request,
  response: Response
): Promise<void> {
  //TODO: INPUT VALIDATION
  const config = configManager.config;
  const sink = config?.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );
  const dataPoint = sink?.dataPoints?.find(
    (point) => point.id === request.params.dataPointId
  );

  const hasOtherDataPointChangedAddress = sink.dataPoints.some(
    (point) =>
      request.body.address &&
      point.id !== request.params.dataPointId &&
      point.address === request.body.address
  );

  if (hasOtherDataPointChangedAddress) {
    winston.warn(`dataPointsPostHandler error due to existance of dataPoint`);

    response.status(400).send();
    return Promise.resolve();
  }

  sink.dataPoints = sink?.dataPoints.filter(
    (point) => point.id !== request.params.dataPointId
  );
  const newData = { ...dataPoint, ...request.body };
  sink.dataPoints.push(newData);
  configManager.config = config;
  await configManager.configChangeCompleted();
  response.status(200).json({
    changed: newData,
    href: `${request.originalUrl}/${newData.id}`
  });
}

/**
 * Delete a datapoint inside of a datasink selected by datasinkProtocol and datapointid
 * @param  {Request} request
 * @param  {Response} response
 */
async function dataPointDeleteHandler(
  request: Request,
  response: Response
): Promise<void> {
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
  await configManager.configChangeCompleted();
  response.status(200).json({
    deleted: point
  });
}

/**
 * Return the current status of the selected datasink. Status is collected from the EventBus
 * @param  {Request} request
 * @param  {Response} response
 */
function dataSinkGetStatusHandler(request: Request, response: Response) {
  const proto = request.params?.datasinkProtocol;
  if (!proto || !['mtconnect', 'opcua', 'datahub'].includes(proto)) {
    response.status(404).json({ error: 'Protocol not valid.' });
    winston.warn('dataSinkGetStatusHandler error due to no valid protocol!');
    return;
  }
  if (!dataSinksManager) {
    response.status(500).send();
    winston.error('dataSinkGetStatusHandler error no dataSinksManager set.');
    return;
  }

  let status;

  try {
    status = dataSinksManager
      .getDataSinkByProto(request.params.datasinkProtocol)
      .getCurrentStatus();
  } catch (e) {
    status = LifecycleEventStatus.Unavailable;
  }
  response.status(200).json({ status });
}

export const dataSinksHandlers = {
  dataSinksGet: dataSinksGetHandler,
  dataSinkGet: dataSinkGetHandler,
  dataSinkPatch: dataSinkPatchHandler,
  dataSinksPostDatapointBulk: dataSinksPostDatapointBulkHandler,
  dataSinksDataPointsGet: dataPointsGetHandler,
  dataSinksDataPointsPost: dataPointsPostHandler,
  dataSinksDataPointPatch: dataPointPatchHandler,
  dataSinksDataPointDelete: dataPointDeleteHandler,
  dataSinksDataPointGet: dataPointGetHandler,
  dataSinkGetStatus: dataSinkGetStatusHandler
};
