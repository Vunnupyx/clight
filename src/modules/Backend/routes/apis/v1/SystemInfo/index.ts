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
 * Trigger update mechanism of docker images
 */
async function triggerContainerUpdate(request: Request, response: Response) {
  const timeOut = 10 * 60 * 1000;
  request.setTimeout(timeOut, () => {
    winston.error(`Request on /systemInfo/update timeout after ${timeOut} ms.`);
    response.sendStatus(408);
  });
  //TODO: Update to be done via CELOS
}

/**
 * Returns current set env variable ENV
 * @param request HTTP Request
 * @param response
 */
function systemGetEnvironment(request: Request, response: Response) {
  response.json({ env: configManager.config.env.selected }).status(200);
}

/**
 * Performs factory reset
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
  updateContainerGet: triggerContainerUpdate,
  systemEnvironmentGet: systemGetEnvironment,
  systemFactoryReset: systemFactoryResetHandler
};
