import { Request, Response } from 'express';
import winston from 'winston';

import { ConfigManager } from '../../../../../ConfigManager';
import { System } from '../../../../../System';
import UpdateManager, {updateStatus} from '../../../../../UpdateManager';

let configManager: ConfigManager;
const updateManager = new UpdateManager();

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
  const timeOut = 10*60*1000;
  request.setTimeout(timeOut, () => {
    winston.error(`Request on /systemInfo/update timeout after ${timeOut} ms.`);
    response.sendStatus(408);
  })
  updateManager.triggerUpdate()
  .then((resp) => {
    switch(resp) {
      case updateStatus.AVAILABLE: {
        response.sendStatus(200);
        break;
      };
      case updateStatus.NOT_AVAILABLE: {
        response.sendStatus(204);
        break
      };
      case updateStatus.NETWORK_ERROR: {
        response.status(400).json({
          error: "No update possible. Please check your network configuration",
          code: "error_no_network"
        });
        break};
    }
  })
}

/**
 * Get System Time
 * @param  {Request} request
 * @param  {Response} response
 */
async function systemTimeGetHandler(request: Request, response: Response) {
  response.status(200).json({
    timestamp: Math.round(Date.now() / 1000)
  });
}

/**
 * Restart system
 * @param  {Request} request
 * @param  {Response} response
 */
async function restartPostHandler(request: Request, response: Response) {
  const system = new System();
  await system.restartDevice();
  response.status(204);
}

export const systemInfoHandlers = {
  systemInfoGet: systemInfoGetHandler,
  systemTimeGet: systemTimeGetHandler,
  restartPost: restartPostHandler,
  updateContainerGet: triggerContainerUpdate
};
