import { ConfigManager } from '../../../../../ConfigManager';
import { Request, Response } from 'express';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 * @param {ConfigManager} manager
 */
export function setConfigManager(config: ConfigManager) {
  configManager = config;
}

/**
 * Returns all data from config.general section
 * @param  {Request} request
 * @param  {Response} response
 */
function deviceInfosGetHandler(request: Request, response: Response): void {
  response.status(200).json(configManager?.config?.general);
}

/**
 * Update all properties provided by the request body.
 * @param  {Request} request
 * @param  {Response} response
 */
async function deviceInfosPatchHandler(
  request: Request,
  response: Response
): Promise<void> {
  const newData = { ...configManager.config.general, ...request.body };

  await configManager.saveConfig({ general: request.body });
  await configManager.configChangeCompleted();
  response.status(200).json(newData);
}

export const deviceInfosHandlers = {
  deviceInfosGet: deviceInfosGetHandler,
  deviceInfosPatch: deviceInfosPatchHandler
};
