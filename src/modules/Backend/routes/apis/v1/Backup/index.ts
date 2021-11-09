import { ConfigManager } from '../../../../../ConfigManager';
import { Request, Response } from 'express';
import winston from 'winston';
import fs from 'fs';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(config: ConfigManager) {
  configManager = config;
}

/**
 * Handles download requests of the config file.
 * @param  {Request} request
 * @param  {Response} response
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
    response.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=config.json'
    });
    fs.createReadStream(configManager.configPath).pipe(response);
  } catch (err) {
    winston.error(`backupGetHandle error due to ${JSON.stringify(err)}`);
  }
}

/**
 * Handles upload requests of a new config file
 * @param  {Request} request
 * @param  {Response} response
 */
async function backupPostHandle(
  request: Request,
  response: Response
): Promise<void> {
  const configFile = (request.files as any)?.config;

  if (!configFile) {
    winston.error('Backup restore failed. No file provided!');

    response.status(400).json({ message: 'No config file provided!' });
    return;
  }

  try {
    configManager.restoreConfigFile(configFile);
    await configManager.configChangeCompleted();
    response.status(200).send();
  } catch {
    winston.error('Backup restore failed. Wrong file provided!');

    response.status(400).json({ message: 'Wrong file provided!' });
  }
}

export const backupHandlers = {
  backupGet: backupGetHandle,
  backupPost: backupPostHandle
};
