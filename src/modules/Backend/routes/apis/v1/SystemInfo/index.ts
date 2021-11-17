import { Request, Response } from 'express';

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
 * Get System Time
 * @param  {Request} request
 * @param  {Response} response
 */
async function systemTimeGetHandler(request: Request, response: Response) {
  response.status(200).json({
    timestamp: Math.round(Date.now() / 1000)
  });
}

export const systemInfoHandlers = {
  systemInfoGet: systemInfoGetHandler,
  systemTimeGet: systemTimeGetHandler
};
