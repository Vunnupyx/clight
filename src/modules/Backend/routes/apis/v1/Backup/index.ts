import { ConfigManager } from '../../../../../ConfigManager';
import { Request, Response } from 'express';
import winston from 'winston';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { System } from '../../../../../System';
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

/**
 * Bundle logs into zip archiv and send it with response
 */
async function logsGetHandler(
  request: Request,
  response: Response
): Promise<void> {
  const logPrefix = `Backup::logsGetHandler`;
  winston.debug(`${logPrefix} incoming log download request`);
  const date = new Date();
  const dateString = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

  const hostname = await new System().getHostname();

  const outFileName = `${hostname}-${dateString}.zip`;
  const logFolderPath = '/mdclight/logs';
  const inputPaths = `${logFolderPath}/*log`;
  const outPath = '/mdclight/logs/out';
  const zipCommand = `mkdir -p ${outPath} && zip -0 -r ${outPath}/${outFileName} ${inputPaths}`;

  /**
   * Deletes all log archives inside the log folder
   */
  const saveDelete = () => {
    fs.readdir(outPath, (err, files) => {
      if (err) {
        winston.error(`${logPrefix} error during read zip folder`);
        return;
      }

      files.forEach((filename) => {
        winston.debug(
          `${logPrefix} deleting zip file ${outPath}/${filename}...`
        );
        fs.unlink(`${outPath}/${filename}`, (err) => {
          if (err) {
            winston.error(
              `${logPrefix} error during cleanup zip file ${outPath}/${filename}. ${JSON.stringify(
                err
              )}`
            );
            return;
          }
          winston.info(
            `${logPrefix} cleanup zip file ${outPath}/${filename} successfully.`
          );
        });
      });
    });
  };

  winston.debug(`${logPrefix} archiving log files`);
  try {
    const { stderr } = await execPromise(zipCommand);
    if (stderr !== '') {
      throw stderr;
    }
  } catch (err) {
    winston.error(`${logPrefix} error during zip log file due to ${err}`);
    response.status(500).send('Internal server error. Please try again later.');
    saveDelete();
    return;
  }
  winston.debug(`${logPrefix} writing response...`);
  const stat = fs.statSync(`${outPath}/${outFileName}`);
  response.writeHead(200, {
    'Content-Type': 'application/octet-stream',
    'Content-Length': `${stat.size}`,
    'Content-Disposition': `attachment; filename=${outFileName}`
  });
  let stream;
  try {
    stream = fs.createReadStream(`${outPath}/${outFileName}`);
  } catch (err) {
    winston.error(`${logPrefix} error during read file due to ${err?.msg}`);
    saveDelete();
    response.status(500).send('Internal server error. Please try again later.');
    return;
  }
  stream.on('end', () => {
    saveDelete();
    winston.debug(`${logPrefix} log download finished successfully.`);
  });
  stream.pipe(response);
}

export const backupHandlers = {
  backupGet: backupGetHandle,
  backupPost: backupPostHandle,
  logsGet: logsGetHandler
};
