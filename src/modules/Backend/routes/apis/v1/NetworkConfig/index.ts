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
 * Get Network Config
 * @param  {Request} request
 * @param  {Response} response
 */
function networkConfigGetHandler(request: Request, response: Response): void {
  response.status(200).json(configManager.config.networkConfig);
}

/**
 * Update Network Config
 * @param  {Request} request
 * @param  {Response} response
 */
function networkConfigPatchHandler(request: Request, response: Response): void {
  configManager.saveConfig({ networkConfig: request.body });

  response.status(200).json(configManager.config.networkConfig);
}

export const networkConfigHandlers = {
  networkConfigGet: networkConfigGetHandler,
  networkConfigPatch: networkConfigPatchHandler
};
