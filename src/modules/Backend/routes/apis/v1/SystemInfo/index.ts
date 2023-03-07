import { Request, Response } from 'express';

import { ConfigManager } from '../../../../../ConfigManager';
import winston from 'winston';
import { DataSinksManager } from '../../../../../Northbound/DataSinks/DataSinksManager';
import { DataSinkProtocols } from '../../../../../../common/interfaces';
import { DataHubDataSink } from '../../../../../Northbound/DataSinks/DataHubDataSink';

let configManager: ConfigManager;
let dataSinksManager: DataSinksManager;

/**
 * Set ConfigManager to make accessible for local function
 * @param configMng
 */
export function setConfigManager(configMng: ConfigManager): void {
  configManager = configMng;
}

/**
 * Set datahub module client to use in routes
 * @param client
 */
export function setDataSinksManager(client: DataSinksManager): void {
  dataSinksManager = client;
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
 * Helper function to handle dev environment. Log information and set response status and msg
 *
 * @param response  express response object
 * @param logPrefix for logging
 * @returns         boolean value
 */
function isDevEnvironment(response: Response, logPrefix: string): boolean {
  if (process.env.NODE_ENV === 'development') {
    const warn = `${logPrefix} development environment detected. Update mechanisms not available.`;
    winston.warn(warn);
    response.status(500).json({
      msg: warn.replace(logPrefix + ' d', 'D')
    });
    return true;
  }
  return false;
}

/**
 * Return available MDCL versions higher than the currently installed.
 * Update information are requested from azure backend.
 */
async function getMDCLUpdates(request: Request, response: Response) {
  const logPrefix = `SystemInfo::getMDCLUpdates`;
  winston.info(`${logPrefix} routes handler called.`);

  if (isDevEnvironment(response, logPrefix)) return;

  if (!dataSinksManager) {
    winston.warn(`${logPrefix} called but no module client is available.`);
    return response.status(500).json({
      msg: `No CelosXChange connection available.`
    });
  }
  // find datahub
  const datahubSink = dataSinksManager.getDataSinkByProto(
    DataSinkProtocols.DATAHUB
  );
  if (!(datahubSink instanceof DataHubDataSink)) {
    winston.warn(`${logPrefix} called but no module client is available.`);
    return response.status(500).json({
      msg: `No CelosXChange connection available.`
    });
  }
  const datahubAdapter = datahubSink.getAdapter();
  if (!datahubAdapter) {
    return response.status(403).json({
      error: 'Terms and conditions not accepted.'
    });
  }
  await datahubAdapter.getUpdate(response);
}

/**
 * Trigger update mechanism of mdclight docker images.
 */
async function updateMdcl(request: Request, response: Response) {
  const logPrefix = `SystemInfo::updateMdcl`;
  winston.info(`${logPrefix} routes handler called.`);

  if (isDevEnvironment(response, logPrefix)) return;

  if (typeof request.body.release === 'undefined') {
    winston.warn(`${logPrefix} called without version information`);
    response
      .status(400)
      .json({ error: 'No version information in request found.' });
    return;
  }
  if (typeof request.body.baseLayerVersion === 'undefined') {
    winston.warn(`${logPrefix} called without baseLayerVersion information`);
    return response
      .status(400)
      .json({ error: 'No version information in request found.' });
  }

  if (!dataSinksManager) {
    winston.warn(`${logPrefix} called but no module client is available.`);
    return response.status(500).json({
      msg: `No CelosXChange connection available.`
    });
  }
  // find datahub
  const datahubSink = dataSinksManager.getDataSinkByProto(
    DataSinkProtocols.DATAHUB
  );
  if (!(datahubSink instanceof DataHubDataSink)) {
    winston.warn(`${logPrefix} called but no module client is available.`);
    return response.status(500).json({
      msg: `No CelosXChange connection available.`
    });
  }
  const datahubAdapter = datahubSink.getAdapter();
  if (!datahubAdapter) {
    return response.status(403).json({
      error: 'Terms and conditions not accepted.'
    });
  }

  return datahubAdapter.setUpdate(response, request.body);
}

/**
 * Performs factory reset
 * @param request HTTP Request
 * @param response
 */
async function systemFactoryResetHandler(request: Request, response: Response) {
  const logPrefix = `systemInfo::systemFactoryResetHandler`;
  winston.info(`${logPrefix} factory reset requested`);

  try {
    await configManager.factoryResetConfiguration();
    winston.info(`${logPrefix} factory reset successfully done`);
    response.status(200).send();
  } catch (e) {
    winston.error(
      `systemFactoryResetHandler:: Error performing factory reset: ${e?.message}`
    );
    response.sendStatus(500);
  }
}

export const systemInfoHandlers = {
  systemInfoGet: systemInfoGetHandler,
  updateGet: getMDCLUpdates,
  updateMDCL: updateMdcl,
  systemFactoryReset: systemFactoryResetHandler
};
