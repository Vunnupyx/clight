import { ConfigManager } from '../../../../../ConfigManager';
import { Request, Response } from 'express';
import winston from 'winston';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(config: ConfigManager) {
  configManager = config;
}

/**
 * Handles download requests of the config file.
 */
function backupGetHandle(request: Request, response: Response): void {
  try {
    const config = configManager?.config;
    if (!config) {
      response.status(404);
      response.send();
      winston.error(`backupGetHandle error due to no config file loaded.`);
      return;
    }
    response.status(200);
    response.setHeader(
      'Content-disposition',
      'attachment; filename=config.json'
    );
    response.send(JSON.stringify(config, null, 2));
  } catch (err) {
    winston.error(`backupGetHandle error due to ${JSON.stringify(err)}`);
  }
}

/**
 * Handles upload requests of a new config file
 */
function backupPostHandle(request: Request, response: Response): void {
  // TODO: Implement -> bodyparser disable for this route for input validation ?
  configManager.config = request.body;
  response.status(200).send();
}

export const backupHandlers = {
  backupGet: backupGetHandle,
  backupPost: backupPostHandle
};
