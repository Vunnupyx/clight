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
export function setConfigManager(config: ConfigManager): void {
  configManager = config;
}

/**
 * Set DataSinksManager to make accessible for local function
 * @param {DataSinksManager} manager
 */
export function setDataSinksManager(manager: DataSinksManager): void {
  dataSinksManager = manager;
}

/**
 * Returns list of datasinks
 */
function getAllDataSinksHandler(request: Request, response: Response): void {
  const dataSinks: IDataSinkConfigResponse[] = configManager.config?.dataSinks;

  dataSinks.forEach((dataSink) => {
    if (dataSink.protocol === DataSinkProtocols.DATAHUB) {
      const sink = dataSinksManager.getDataSinkByProto(
        DataSinkProtocols.DATAHUB
      ) as DataHubDataSink;

      dataSink.desired = sink?.getDesiredPropertiesServices();
    }
  });

  response.status(200).json({
    dataSinks: configManager.config?.dataSinks
  });
}

/**
 * Handle all patch requests for modifying a specific datasource.
 * Only certain changes within "allowed" variable are allowed.
 */
async function patchSingleDataSinkHandler(
  request: Request,
  response: Response
): Promise<void> {
  let allowed = ['enabled', 'auth', 'customDataPoints'];
  const protocol = request.params.datasinkProtocol as DataSinkProtocols;

  // If protocol is datahub it´s allowed to change only datahub,
  if (protocol === 'datahub') allowed = ['datahub'];

  const incomingConfig = request.body as Omit<
    IDataSinkConfig,
    'dataPoints' | 'protocol'
  >;

  if (!isValidProtocol(protocol)) {
    response.status(400).json({ error: 'Protocol not valid.' });
    return Promise.resolve();
  }

  const config = configManager.config;
  let dataSink = config?.dataSinks?.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );

  if (!dataSink) {
    winston.warn(
      `patchSingleDataSinkHandler error due to datasink with protocol ${protocol} not found.`
    );
    response.status(404).send();
    return Promise.resolve();
  }
  for (const entry of Object.keys(incomingConfig)) {
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
    incomingConfig.auth &&
    incomingConfig.auth.type === 'anonymous'
  ) {
    delete incomingConfig.auth.userName;
    delete incomingConfig.auth.password;
  }

  if (
    incomingConfig.auth &&
    'type' in incomingConfig.auth &&
    'userName' in incomingConfig.auth &&
    'password' in incomingConfig.auth &&
    typeof incomingConfig.auth.password === 'string'
  ) {
    incomingConfig.auth.password = await hash(incomingConfig.auth.password, 10);
  } else {
    winston.warn(
      `dataSinkPatchHandler tried to change property: auth .Infos missing.`
    );
  }

  const updatedDataSink: IDataSinkConfig = { ...dataSink, ...incomingConfig };

  if (!isValidDataSink(updatedDataSink)) {
    response.status(400).json({ error: 'Input not valid.' });
    return Promise.resolve();
  }

  configManager.updateInConfig<'dataSinks', IDataSinkConfig>(
    'dataSinks',
    updatedDataSink,
    (item) => item.protocol === updatedDataSink?.protocol
  );
  await configManager.configChangeCompleted();
  response.status(200).json(updatedDataSink);
}

/**
 * Bulk dataPoint changes
 */
async function patchAllDataSinkDatapointsHandler(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const protocol = request.params.datasinkProtocol as DataSinkProtocols;
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
        `patchAllDataSinkDatapointsHandler error due to datasink with protocol ${protocol} not found.`
      );
      response.status(404).send();
      return Promise.resolve();
    }
    dataSink = { ...dataSink, dataPoints: newDataPointsArray };
    configManager.updateInConfig<'dataSinks', IDataSinkConfig>(
      'dataSinks',
      dataSink,
      (item) => item.protocol === dataSink?.protocol
    );
    await configManager.configChangeCompleted();
    response.status(200).send();
  } catch (err) {
    winston.warn(`patchAllDataSinkDatapointsHandler error due to: ${err}`);
    response
      .status(400)
      .json({ error: 'Cannot change datapoints. Try again!' });
  }
}

/**
 * Handle get request for a list of datapoints.
 */
function getAllDataSinkDatapointsHandler(
  request: Request,
  response: Response
): void {
  const sinkConfig = configManager?.config?.dataSinks.find(
    (sink) => sink.protocol === request.params.datasinkProtocol
  );
  if (!sinkConfig) {
    response.status(404).json();
    return;
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
  response.status(200).json({
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
 * Return the current status of the selected datasink. Status is collected from the EventBus
 */
function getSingleDataSinkStatusHandler(
  request: Request,
  response: Response
): void {
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

  let status: LifecycleEventStatus;

  try {
    const sink = dataSinksManager.getDataSinkByProto(
      request.params.datasinkProtocol
    )!;
    status = sink.getCurrentStatus();
  } catch (e) {
    status = LifecycleEventStatus.Unavailable;
  }
  response.status(200).json({ status });
}

export const dataSinksHandlers = {
  //Single data sink
  patchSingleDataSinkHandler,
  //Multiple data sinks
  getAllDataSinksHandler,
  //Multiple data points
  patchAllDataSinkDatapointsHandler,
  getAllDataSinkDatapointsHandler,
  //Status of data sink
  getSingleDataSinkStatusHandler
};
