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
function systemInfoGetHandler(request: Request, response: Response) {
  response.status(200).json(configManager.config.systemInfo);
}

export const systemInfoHandlers = {
  systemInfoGet: systemInfoGetHandler
};
