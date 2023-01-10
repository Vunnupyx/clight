import { Request, Response } from 'express';
import winston from 'winston';

import { ConfigManager } from '../../../../../ConfigManager';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 * @param {ConfigManager} config
 */
export function setConfigManager(config: ConfigManager) {
  configManager = config;
}

/**
 * Get System Info
 * @param  {Request} request
 * @param  {Response} response
 */
async function systemInfoGetHandler(request: Request, response: Response) {
  const systemInfo = await configManager.getSystemInformation();
  response.status(200).json(systemInfo);
}

/**
 * Returns current set env variable ENV
 * @param request HTTP Request
 * @param response
 */
async function systemFactoryResetHandler(request: Request, response: Response) {
  try {
    await configManager.factoryResetConfiguration();
    response.status(200).send();
  } catch (e) {
    response.sendStatus(500);
  }
}

export const systemInfoHandlers = {
  systemInfoGet: systemInfoGetHandler,
  systemFactoryReset: systemFactoryResetHandler
};
