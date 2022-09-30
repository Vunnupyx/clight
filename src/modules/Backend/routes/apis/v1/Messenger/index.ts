/**
 * All request handlers for requests to messenger endpoints
 */
import { Request, Response } from 'express';
import winston from 'winston';
import { DataSinkProtocols } from '../../../../../../common/interfaces';

import { ConfigManager } from '../../../../../ConfigManager';
import {
  IMessengerServerConfig,
  IMessengerServerStatus
} from '../../../../../ConfigManager/interfaces';
import { DataSinksManager } from '../../../../../Northbound/DataSinks/DataSinksManager';

let configManager: ConfigManager;
let dataSinksManager: DataSinksManager;

interface IMessengerServerConfigResponse
  extends Omit<IMessengerServerConfig, 'password'> {
  password: boolean;
}

/**
 * Set ConfigManager to make accessible for local function
 * @param  {ConfigManager} manager
 */
export function setConfigManager(manager: ConfigManager) {
  configManager = manager;
}

/**
 * Set DataSinksManager to make accessible for local function
 * @param {DataSinksManager} manager
 */
export function setDataSinksManager(manager: DataSinksManager) {
  dataSinksManager = manager;
}

/**
 * Returns current server configuration.
 * @param  {Request} request
 * @param  {Response} response
 */
function messengerConfigurationGetHandler(
  request: Request,
  response: Response
): void {
  const currentConfig = configManager.config.dataSinks?.find(
    (dataSink) => dataSink.protocol === DataSinkProtocols.MTCONNECT
  )?.messenger;

  let payload: IMessengerServerConfigResponse;

  if (currentConfig) {
    payload = {
      ...currentConfig,
      password: currentConfig.password?.length > 0
    };
  } else {
    payload = {
      hostname: null,
      username: null,
      password: false,
      model: null,
      name: null,
      organization: null,
      timezone: null
    };
  }

  response.status(200).json(payload);
}

/**
 * Updates current server configuration
 * @param  {Request} request
 * @param  {Response} response
 */
async function messengerConfigurationPostHandler(
  request: Request,
  response: Response
): Promise<void> {
  let incomingMessengerConfig: IMessengerServerConfig = request.body;

  if (!incomingMessengerConfig.hostname || !incomingMessengerConfig.username) {
    response.status(400).json({ message: 'Invalid Body' });
    return;
  }
  const config = configManager.config;

  let mtConnectSink = config.dataSinks?.find(
    (dataSink) => dataSink.protocol === DataSinkProtocols.MTCONNECT
  );

  let currentMessengerSettings = mtConnectSink.messenger;

  if (currentMessengerSettings) {
    //TBD: Will frontend send unchanged values as null or same as old value?
    currentMessengerSettings = {
      ...currentMessengerSettings,
      ...incomingMessengerConfig,
      password:
        incomingMessengerConfig.password?.length > 0
          ? incomingMessengerConfig.password
          : currentMessengerSettings.password
    };
  } else if (mtConnectSink) {
    mtConnectSink.messenger = incomingMessengerConfig;
  } else {
    //if mtconnect sink doesn't exist yet, is it usecase?
    // TBD
    config.dataSinks.push({
      name: '', // TBD!
      dataPoints: [],
      enabled: true,
      protocol: 'mtconnect',
      messenger: incomingMessengerConfig
    });
  }
  configManager.config = config;

  await configManager.configChangeCompleted();
  // TBD: actually it will automatically checkstatus after configChange event
  await dataSinksManager.messengerManager.checkStatus();

  response.status(200).json(null);
}

/**
 * Returns the current status of server
 * @param  {Request} request
 * @param  {Response} response
 */
async function messengerStatusGetHandler(request: Request, response: Response) {
  try {
    await dataSinksManager.messengerManager.checkStatus();

    const payload: IMessengerServerStatus =
      dataSinksManager.messengerManager.serverStatus;

    response.status(200).json(payload);
  } catch (err) {
    winston.warn(
      `messengerStatusGetHandler:: Error while getting Messenger server status ${JSON.stringify(
        err
      )}`
    );
    response.status(500).json(err); //TODO
  }
}

/**
 * Returns server metadata
 */
async function messengerMetadataGetHandler(
  request: Request,
  response: Response
): Promise<void> {
  //TBD

  response.status(501).json(null);
}

export const messengerHandlers = {
  messengerConfigurationGetHandler,
  messengerConfigurationPostHandler,
  messengerStatusGetHandler,
  messengerMetadataGetHandler
};
