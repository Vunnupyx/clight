import { ConfigManager } from '../../../../../ConfigManager';
import { Request, Response } from 'express';
import { IGeneralConfig } from '../../../../../ConfigManager/interfaces';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(config: ConfigManager): void {
  configManager = config;
}

/**
 * Returns all data from config.general section
 */
function deviceInfosGetHandler(request: Request, response: Response): void {
  response.status(200).json(configManager?.config?.general);
}

/**
 * Update all properties provided by the request body.
 */
async function deviceInfosPatchHandler(
  request: Request,
  response: Response
): Promise<void> {
  const incomingGeneralConfig: IGeneralConfig = request.body;
  const updatedGeneralConfig: IGeneralConfig = {
    ...configManager.config?.general,
    ...(incomingGeneralConfig ?? {})
  };

  await configManager.saveConfig({ general: updatedGeneralConfig });
  await configManager.configChangeCompleted();
  response.status(200).json(updatedGeneralConfig);
}

export const deviceInfosHandlers = {
  deviceInfosGetHandler,
  deviceInfosPatchHandler
};
