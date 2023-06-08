/**
 * All request handlers for requests to messenger endpoints
 */
import { Request, Response } from 'express';
import winston from 'winston';

import { ConfigManager } from '../../../../../ConfigManager';
import {
  IMessengerServerConfig,
  IMessengerServerStatus,
  IMessengerMetadata
} from '../../../../../ConfigManager/interfaces';
import { DataSinksManager } from '../../../../../Northbound/DataSinks/DataSinksManager';
import { isValidIpOrHostname } from '../../../../../Utilities';

let configManager: ConfigManager;
let dataSinksManager: DataSinksManager;

interface IMessengerServerConfigResponse
  extends Omit<IMessengerServerConfig, 'password'> {
  password: boolean;
}

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(manager: ConfigManager): void {
  configManager = manager;
}

/**
 * Set DataSinksManager to make accessible for local function
 */
export function setDataSinksManager(manager: DataSinksManager): void {
  dataSinksManager = manager;
}

/**
 * Returns current server configuration.
 */
function messengerConfigurationGetHandler(
  request: Request,
  response: Response
): void {
  const currentConfig = configManager.config.messenger;

  let payload: IMessengerServerConfigResponse = {
    hostname: null,
    username: null,
    password: false,
    model: null,
    name: null,
    organization: null,
    timezone: null
  };

  if (currentConfig) {
    payload = {
      ...currentConfig,
      password: currentConfig.password?.length > 0
    };
  }

  response.status(200).json(payload);
}

/**
 * Updates current server configuration
 */
async function messengerConfigurationPostHandler(
  request: Request,
  response: Response
): Promise<void> {
  try {
    let incomingMessengerConfig: IMessengerServerConfig = request.body;

    if (
      !isValidIpOrHostname(incomingMessengerConfig.hostname) ||
      typeof incomingMessengerConfig.hostname !== 'string' ||
      incomingMessengerConfig.hostname.length === 0 ||
      typeof incomingMessengerConfig.username !== 'string' ||
      incomingMessengerConfig.username.length === 0
    ) {
      response
        .status(400)
        .json({ error: { message: 'Invalid hostname or username' } });
      return;
    }

    await configManager.updateMessengerConfig(incomingMessengerConfig);

    response.status(200).json(null);
  } catch (err) {
    winston.warn(
      `messengerConfigurationPostHandler:: Error while processing Post request ${JSON.stringify(
        err
      )}`
    );
    response.status(500).json({
      error: {
        message: 'Unexpected error occurred. Please try again later.'
      }
    });
  }
}

/**
 * Returns the current status of server
 */
async function messengerStatusGetHandler(
  request: Request,
  response: Response
): Promise<void> {
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
    response.status(500).json({
      error: {
        message: 'Unexpected error occurred. Please try again later.'
      }
    });
  }
}

/**
 * Returns server metadata
 */
async function messengerMetadataGetHandler(
  request: Request,
  response: Response
): Promise<void> {
  try {
    let payload: IMessengerMetadata =
      await dataSinksManager.messengerManager.getMetadata();

    response.status(200).json(payload);
  } catch (err) {
    winston.warn(
      `messengerMetadataGetHandler:: Error while getting Messenger metadata ${JSON.stringify(
        err
      )}`
    );
    response.status(500).json({
      error: {
        msg: 'Unexpected  error occurred. Please try again later.'
      }
    });
  }
}

export const messengerHandlers = {
  messengerConfigurationGetHandler,
  messengerConfigurationPostHandler,
  messengerStatusGetHandler,
  messengerMetadataGetHandler
};
