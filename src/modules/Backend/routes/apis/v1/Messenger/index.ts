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
  const currentConfig = configManager.config.messenger;

  let payload: IMessengerServerConfigResponse = {
    hostname: null,
    username: null,
    password: false,
    license: null,
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
 * @param  {Request} request
 * @param  {Response} response
 */
async function messengerConfigurationPostHandler(
  request: Request,
  response: Response
): Promise<void> {
  try {
    let incomingMessengerConfig: IMessengerServerConfig = request.body;

    if (
      typeof incomingMessengerConfig.hostname !== 'string' ||
      incomingMessengerConfig.hostname.length === 0 ||
      typeof incomingMessengerConfig.username !== 'string' ||
      incomingMessengerConfig.username.length === 0
    ) {
      response.status(400).json({ message: 'Missing hostname or username' });
      return;
    }
    //If host is already known and model/organization/timezone changes, check if the new values are correct
    if (
      configManager.config.messenger?.hostname &&
      incomingMessengerConfig.hostname ===
        configManager.config.messenger?.hostname &&
      (incomingMessengerConfig.model ||
        incomingMessengerConfig.organization ||
        incomingMessengerConfig.timezone)
    ) {
      const messengerMetadata =
        await dataSinksManager.messengerManager.getMetadata();
      if (
        (incomingMessengerConfig.model &&
          !messengerMetadata?.models?.find(
            (m) => m.id === incomingMessengerConfig.model
          )) ||
        (incomingMessengerConfig.organization &&
          !messengerMetadata?.organizations?.find(
            (o) => o.id === incomingMessengerConfig.organization
          )) ||
        (incomingMessengerConfig.timezone &&
          !messengerMetadata?.timezones?.find(
            (t) => t.id === incomingMessengerConfig.timezone
          ))
      ) {
        response.status(400).json({ message: 'Invalid metadata option' });
        return;
      }
    }

    await configManager.updateMessengerConfig(incomingMessengerConfig);
    await configManager.configChangeCompleted();
    await dataSinksManager.messengerManager.handleConfigChange();

    response.status(200).json(null);
  } catch (err) {
    winston.warn(
      `messengerConfigurationPostHandler:: Error while processing Post request ${JSON.stringify(
        err
      )}`
    );
    response.status(500).json(err);
  }
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
    response.status(500).json(err); // TODO
  }
}

export const messengerHandlers = {
  messengerConfigurationGetHandler,
  messengerConfigurationPostHandler,
  messengerStatusGetHandler,
  messengerMetadataGetHandler
};
