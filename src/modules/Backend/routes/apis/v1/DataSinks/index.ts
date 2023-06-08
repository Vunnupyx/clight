import { ConfigManager } from '../../../../../ConfigManager';
import {
  IDataSinkConfig,
  IDataSinkDataPointConfig,
  isValidDataSink,
  isValidDataSinkDatapoint
} from '../../../../../ConfigManager/interfaces';
import { Response, Request } from 'express';
import winston from 'winston';
import { hash } from 'bcryptjs';
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
 * Checks if given protocol is a valid data sink protocol
 */
function isValidProtocol(protocol: any): boolean {
  return Object.values(DataSinkProtocols).includes(protocol);
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
function getAllDataSinksHandler(request: Request, response: Response): void {
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
function getSingleDataSinkHandler(request, response): void {
  if (!isValidProtocol(request.params.datasinkProtocol)) {
    response.status(400).json({ error: 'Protocol not valid.' });
    return;
  }
  const dataSink: IDataSinkConfigResponse =
    configManager.config?.dataSinks?.find(
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
 * Only certain changes within "allowed" variable are allowed.
 * @param  {Request} request
 * @param  {Response} response
 */
async function patchSingleDataSinkHandler(
  request: Request,
  response: Response
): Promise<void> {
  let allowed = ['enabled', 'auth', 'customDataPoints'];
  const protocol = request.params.datasinkProtocol;
  const updatedDataSink = request.body;

  if (!isValidProtocol(protocol) || isValidDataSink(updatedDataSink)) {
    response.status(400).json({ error: 'Input not valid.' });
    return Promise.resolve();
  }

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
      `patchSingleDataSinkHandler error due to datasink with protocol ${protocol} not found.`
    );
    response.status(404).send();
    return Promise.resolve();
  }
  for (const entry of Object.keys(updatedDataSink)) {
    if (!allowed.includes(entry)) {
      winston.warn(
        `patchSingleDataSinkHandler tried to change property: ${entry}. Not allowed`
      );
      response.status(403).json({
        error: `Not allowed to change ${entry}`
      });
      return Promise.resolve();
    }
  }

  if (
    protocol === 'opcua' &&
    updatedDataSink.auth &&
    updatedDataSink.auth.type === 'anonymous'
  ) {
    delete updatedDataSink.auth.userName;
    delete updatedDataSink.auth.password;
  }

  if (
    updatedDataSink.auth &&
    'type' in updatedDataSink.auth &&
    'userName' in updatedDataSink.auth &&
    'password' in updatedDataSink.auth
  ) {
    updatedDataSink.auth.password = await hash(
      updatedDataSink.auth.password,
      10
    );
  } else {
    winston.warn(
      `dataSinkPatchHandler tried to change property: auth .Infos missing.`
    );
  }

  dataSink = { ...dataSink, ...updatedDataSink };
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
async function patchAllDatapointsHandler(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const protocol = request.params.datasinkProtocol;
    const newDataPointsArray = request.body as IDataSinkDataPointConfig[];

    if (
      !isValidProtocol(protocol) ||
      !newDataPointsArray.every(isValidDataSinkDatapoint)
    ) {
      response.status(400).json({ error: 'Input not valid.' });
      return Promise.resolve();
    }

    let dataSink = configManager.config?.dataSinks?.find(
      (sink) => sink.protocol === protocol
    );
    if (!dataSink) {
      winston.warn(
        `patchAllDatapointsHandler error due to datasink with protocol ${protocol} not found.`
      );
      response.status(404).send();
      return Promise.resolve();
    }
    dataSink = { ...dataSink, dataPoints: newDataPointsArray };
    configManager.changeConfig(
      'update',
      'dataSinks',
      dataSink,
      (item) => item.protocol
    );
    await configManager.configChangeCompleted();
    response.status(200).send();
  } catch (err) {
    winston.warn(`patchAllDatapointsHandler error due to: ${err}`);
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
function getAllDatapointsHandler(request: Request, response: Response) {
  const sinkConfig = configManager?.config?.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );
  if (!sinkConfig) {
    return response.status(404).json();
  }
  const allSignalGroups = configManager.runtimeConfig?.datahub?.signalGroups;
  let dpSignalGroupArray: { [key: string]: string[] } = {};
  for (let service in allSignalGroups) {
    for (let dpAddress of allSignalGroups[service]) {
      if (!dpSignalGroupArray[dpAddress]) {
        dpSignalGroupArray[dpAddress] = [service];
      } else {
        dpSignalGroupArray[dpAddress].push(service);
      }
    }
  }
  const dataSink = dataSinksManager.getDataSinkByProto(
    DataSinkProtocols.DATAHUB
  ) as DataHubDataSink;
  const desiredServices = dataSink?.getDesiredPropertiesServices();
  return response.status(200).json({
    dataPoints: sinkConfig.dataPoints.map((dp) => ({
      ...dp,
      enabled: dpSignalGroupArray[dp.address]?.find(
        (service) => desiredServices?.services?.[service]?.enabled
      )
        ? true
        : false
    }))
  });
}

/**
 * Handle get request for a single datapoint, selected by id via path parameter.
 * @param  {Request} request
 * @param  {Response} response
 */
function getSingleDatapointHandler(request: Request, response: Response) {
  const sink = configManager?.config?.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );
  const point = sink?.dataPoints?.find(
    (datapoint) => datapoint.id === request.params.dataPointId
  );
  response.status(point && sink ? 200 : 404).json(point);
}

/**
 * Create a new dataPoints resource for datasink selected by id.
 * @param  {Request} request
 * @param  {Response} response
 */
async function postSingleDatapointHandler(
  request: Request,
  response: Response
): Promise<void> {
  const newDatapoint = request.body as IDataSinkDataPointConfig;

  if (
    !isValidProtocol(request.params.datasinkProtocol) ||
    !isValidDataSinkDatapoint(newDatapoint) ||
    typeof request.params.dataPointId !== 'string'
  ) {
    response.status(400).json({ error: 'Input not valid.' });
    return Promise.resolve();
  }

  const config = configManager.config;
  const changedSinkObject = config.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );

  if (
    changedSinkObject.dataPoints.some(
      (dp) => dp.address === newDatapoint.address || dp.id === newDatapoint.id
    )
  ) {
    winston.warn(
      `Can't create new data point because address or id already exists. Given data point:${newDatapoint}`
    );

    response.status(400).send();
    return Promise.resolve();
  }

  changedSinkObject.dataPoints.push(newDatapoint);
  configManager.config = config;
  await configManager.configChangeCompleted();
  response.status(200).json({
    created: newDatapoint,
    href: `${request.originalUrl}/datapoints/${newDatapoint.id}`
  });
}

/**
 * Change datapoint resource for datasink with selected id
 * @param  {Request} request
 * @param  {Response} response
 */
async function patchSingleDataPointHandler(
  request: Request,
  response: Response
): Promise<void> {
  const updatedDatapoint = request.body as IDataSinkDataPointConfig;

  if (
    !isValidProtocol(request.params.datasinkProtocol) ||
    !isValidDataSinkDatapoint(updatedDatapoint) ||
    typeof request.params.dataPointId !== 'string'
  ) {
    response.status(400).json({ error: 'Input not valid.' });
    return Promise.resolve();
  }

  const config = configManager.config;
  const sink = config?.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );
  const dataPoint = sink?.dataPoints?.find(
    (point) => point.id === request.params.dataPointId
  );
  if (!dataPoint) {
    response.status(404).json({ error: 'Datapoint not found' });
    return Promise.resolve();
  }
  const isAddressAlreadyUsedByAnotherDatapoint = sink.dataPoints.some(
    (point) =>
      updatedDatapoint.address &&
      point.id !== request.params.dataPointId &&
      point.address === updatedDatapoint.address
  );

  if (isAddressAlreadyUsedByAnotherDatapoint) {
    winston.warn(
      `Can't patch data sink data point as same address exists with another data point! Address:${request.body.address}`
    );

    response.status(400).send();
    return Promise.resolve();
  }

  sink.dataPoints = sink?.dataPoints.filter(
    (point) => point.id !== request.params.dataPointId
  );
  const newData = { ...dataPoint, ...updatedDatapoint };
  sink.dataPoints.push(newData);
  configManager.config = config;
  await configManager.configChangeCompleted();
  response.status(200).json({
    changed: newData,
    href: `${request.originalUrl}/${newData.id}`
  });
}

/**
 * Delete a datapoint inside of a datasink selected by datasinkProtocol and datapoint id
 * @param  {Request} request
 * @param  {Response} response
 */
async function deleteSingleDatapointHandler(
  request: Request,
  response: Response
): Promise<void> {
  if (
    !isValidProtocol(request.params.datasinkProtocol) ||
    typeof request.params.dataPointId !== 'string'
  ) {
    response.status(400).json({ error: 'Input not valid.' });
    return Promise.resolve();
  }

  const config = configManager?.config;
  const sink = config?.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );
  const index = sink.dataPoints.findIndex(
    (point) => point.id === request.params.dataPointId
  );
  if (index === -1) {
    response.status(404).json({ error: 'Datapoint not found' });
    return Promise.resolve();
  }
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
function getSingleDataSinkStatusHandler(request: Request, response: Response) {
  const protocol = request.params?.datasinkProtocol;
  if (!isValidProtocol(protocol)) {
    response.status(400).json({ error: 'Protocol not valid.' });
    return;
  }
  if (!dataSinksManager) {
    response.status(500).send();
    winston.error(
      'Cannot get data sink status because dataSinksManager is not available.'
    );
    return;
  }

  let status;

  try {
    status = dataSinksManager
      .getDataSinkByProto(request.params.datasinkProtocol)
      ?.getCurrentStatus();
  } catch (e) {
    status = LifecycleEventStatus.Unavailable;
  }
  response.status(200).json({ status });
}

export const dataSinksHandlers = {
  //Single data sink
  dataSinkGet: getSingleDataSinkHandler,
  dataSinkPatch: patchSingleDataSinkHandler,
  //Multiple data sinks
  dataSinksGet: getAllDataSinksHandler,
  //Single data point
  dataSinksDataPointsPost: postSingleDatapointHandler,
  dataSinksDataPointPatch: patchSingleDataPointHandler,
  dataSinksDataPointDelete: deleteSingleDatapointHandler,
  dataSinksDataPointGet: getSingleDatapointHandler,
  //Multiple data points
  dataSinksPatchDatapoint: patchAllDatapointsHandler,
  dataSinksDataPointsGet: getAllDatapointsHandler,
  //Status of data sink
  dataSinkGetStatus: getSingleDataSinkStatusHandler
};
