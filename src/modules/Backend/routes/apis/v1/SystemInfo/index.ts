import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import { ConfigManager } from '../../../../../ConfigManager';
import winston from 'winston';
import { ModuleClient, Message } from 'azure-iot-device';
import { Mqtt as IotHubTransport } from 'azure-iot-device-mqtt';
import { inspect } from 'util';

let configManager: ConfigManager;
let moduleClient: ModuleClient;

interface CommandEventPayload {
  Command?: string;
  Layer?: string;
  Release?: string;
  TwinVersion?: string;
  BaseLayerVersion?: string;
  Locale?: string;
}

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
async function systemInfoGetHandler(request: Request, response: Response) {
  const systemInfo = await configManager.getSystemInformation();
  response.status(200).json(systemInfo);
}

/**
 * Trigger update mechanism of docker images
 */
async function triggerAzureFunction(request: Request, response: Response) {
  const logPrefix = `SystemInfo::triggerAzureFunction`;
  winston.error(`${logPrefix} routes handler called.`);
  if (process.env.NODE_ENV === 'development') {
    const warn = `${logPrefix} development environment detected. Update mechanisms not available.`;
    winston.warn(warn);
    return response.status(500).json({
      msg: warn.replace(logPrefix + ' d', 'D')
    });
  }
  if (!moduleClient) {
    winston.warn(
      `${logPrefix} moduleClient instance not available. Creating module client.`
    );
    moduleClient =
      (await ModuleClient.fromEnvironment(IotHubTransport).catch(() => {
        winston.error(
          `${logPrefix} no azure environment information available. `
        );
        response.status(500).json({
          msg: `Update mechanisms not available.`
        });
      })) || null;
    // TODO: Add error handling
    const connected = await moduleClient.open();
    winston.info(`${logPrefix} moduleClient instance connected.`);
  }

  try {
    const devtestCbHandler = (request, response) => {
      winston.error(`devtestCbHandler callback called: ${inspect(request)}`);
      moduleClient.off('devtestMethode', devtestCbHandler);
      response.send(200, {
        message: `Call to devtestCbHandler successfully. Unregister Method`
      });
    };
    winston.error(`register devtestMethode`);
    moduleClient.onMethod('devtestMethode', devtestCbHandler);
  } catch (error) {
    winston.error(`devtestMethode already registered.`);
  }

  try {
    const devtestCbHandler2 = (request, response) => {
      winston.error(`devtestCbHandler2 callback called: ${inspect(request)}`);
      response.send(200, {
        message: `Call to devtestCbHandler2 successfully. Method is still registered`
      });
    };
    winston.error(`register devtestMethode2`);
    moduleClient.onMethod('devtestMethode2', devtestCbHandler2);
  } catch (error) {
    winston.error(`devtestMethode2 already registered.`);
  }

  await sendGetMDCLUpdateInfos1();
  await sendGetMDCLUpdateInfos2();
}

/**
 * With commandid
 */
async function sendGetMDCLUpdateInfos1() {
  const logPrefix = `systemInfo::sendGetMDCLUpdateInfos1`;
  const azureFuncName = 'get-mdclight-updates';
  const commandId = uuid();
  const uniqueMethodName = azureFuncName + '/' + commandId;

  const updateCbHandler = (request, response) => {
    winston.error(
      `${logPrefix} ${commandId} callback called: ${inspect(request)}`
    );
    moduleClient.off(commandId, updateCbHandler);
    response.send(200, {
      message: `Call to ${commandId} successfully.`
    });
  };

  winston.error(`${logPrefix} registering ${commandId}`);
  try {
    moduleClient.onMethod(commandId, updateCbHandler);
    winston.error(`${logPrefix} ${commandId} registered.`);
  } catch (err) {
    winston.error(`${logPrefix} ${commandId} already registered.`);
  }

  const payload: CommandEventPayload = {};
  const msg = new Message(JSON.stringify(payload));

  msg.properties.add('messageType', 'command');
  msg.properties.add('moduleId', process.env.IOTEDGE_MODULEID);
  msg.properties.add('command', azureFuncName);
  msg.properties.add('commandId', commandId);
  msg.properties.add('methodName', uniqueMethodName);

  await moduleClient.sendEvent(msg).catch((error) => {
    winston.error(`${logPrefix} error sending event msg ${inspect(error)}`);
  });
}

/**
 * With uniqueName
 */
async function sendGetMDCLUpdateInfos2() {
  const logPrefix = `systemInfo::sendGetMDCLUpdateInfos2`;
  const azureFuncName = 'get-mdclight-updates';
  const commandId = uuid();
  const uniqueMethodName = azureFuncName + '/' + commandId;

  const updateCbHandler = (request, response) => {
    winston.error(
      `${logPrefix} ${uniqueMethodName} callback called: ${inspect(request)}`
    );
    moduleClient.off(uniqueMethodName, updateCbHandler);
    response.send(200, {
      message: `Call to ${uniqueMethodName} successfully.`
    });
  };

  winston.error(`${logPrefix} registering ${uniqueMethodName}`);
  try {
    moduleClient.onMethod(uniqueMethodName, updateCbHandler);
    winston.error(`${logPrefix} ${uniqueMethodName} registered.`);
  } catch (err) {
    winston.error(`${logPrefix} ${uniqueMethodName} already registered.`);
  }

  const payload: CommandEventPayload = {};
  const msg = new Message(JSON.stringify(payload));

  msg.properties.add('messageType', 'command');
  msg.properties.add('moduleId', process.env.IOTEDGE_MODULEID);
  msg.properties.add('command', azureFuncName);
  msg.properties.add('commandId', commandId);
  msg.properties.add('methodName', uniqueMethodName);

  await moduleClient.sendEvent(msg).catch((error) => {
    winston.error(`${logPrefix} error sending event msg ${inspect(error)}`);
  });
}

/**
 * Returns current set env variable ENV
 * @param request HTTP Request
 * @param response
 */
function systemGetEnvironment(request: Request, response: Response) {
  response.json({ env: configManager.config.env.selected }).status(200);
}

export const systemInfoHandlers = {
  systemInfoGet: systemInfoGetHandler,
  updateGet: triggerAzureFunction,
  systemEnvironmentGet: systemGetEnvironment
};
