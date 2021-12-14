import { ConfigManager } from '../../../../../ConfigManager';
import { Request, Response } from 'express';
import winston from 'winston';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
const execPromise = promisify(exec);

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

async function logsGetHandler(
  request: Request,
  response: Response
): Promise<void> {
  const logPrefix = `Backup::logsGetHandler`;
  const date = new Date();
  const dateString = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
  const fileName = `logs-${dateString}.zip`;
  const path = '/mdclight/logs';
  const zipCommand = `zip -0 -j -r ${path}/${fileName} ${path}/*.log`;

  const saveDelete = () => {
    fs.unlink(`${path}/${fileName}`, (err) => {
      if (err) {
        winston.error(
          `${logPrefix} error during cleanup zip file. Retry after delay of 5sec`
        );
        setTimeout(saveDelete, 5 * 1000);
        return;
      }
      winston.info(`${logPrefix} cleanup zip file successfully.`);
    });
  };

  try {
    const { stderr } = await execPromise(zipCommand);
    if (stderr !== '') {
      throw stderr;
    }
  } catch (err) {
    winston.error(`${logPrefix} error during zip log file due to ${err}`);
    response.status(500).send('Internal server error. Please try again later.');
    return;
  }
  response.writeHead(200, {
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': `attachment; filename=${fileName}`
  });
  let stream;
  try {
    stream = fs.createReadStream(`${path}/${fileName}`);
  } catch (err) {
    winston.error(`${logPrefix} error during read file due to ${err?.msg}`);
    saveDelete();
    response.status(500).send('Internal server error. Please try again later.');
    return;
  }
  stream.on('end', () => {
    saveDelete();
  });
  stream.pipe(response);
}

export const backupHandlers = {
  backupGet: backupGetHandle,
  backupPost: backupPostHandle,
  logsGet: logsGetHandler
};
