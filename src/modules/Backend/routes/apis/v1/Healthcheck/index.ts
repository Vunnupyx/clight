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
async function healthCheckGetHandler(request: Request, response: Response) {
  if(!configManager) response.status(500).json({error: "init in progress"});
  const mdcVersion = (await configManager.getSystemInformation())[1]['items'][0]['value'];
  response.status(200).json({
    version: mdcVersion
  });
}

export const healthCheckHandlers = {
  healthCheckGet: healthCheckGetHandler
};
