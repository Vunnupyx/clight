import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import { ConfigManager } from '../../../../../ConfigManager';
import winston from 'winston';
import { ModuleClient, Message } from 'azure-iot-device';
import { Mqtt as IotHubTransport } from 'azure-iot-device-mqtt';
import { inspect } from 'util';

let configManager: ConfigManager;
let moduleClient: ModuleClient;

const updateCbHandler = (request, response) => {
  winston.error(
    `${logPrefix} update infos 
    handler callback called: ${inspect(request)}`
  );
  response.send(200, {
    message: `Call to ${commandId} successfully.`
  });
};

interface CommandEventPayload {
  command?: string;
  layer?: string;
  release?: string;
  twinVersion?: string;
  baseLayerVersion?: string;
  locale?: string;
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
  await setUpModuleClient().catch((error) => {
    winston.error(
      `${logPrefix} error setting up module client due to ${JSON.stringify(
        error || ''
      )}`
    );
    return response.status(500).json({
      msg: `No CelosXChange connection available.`
    });
  });

  await sendGetMDCLUpdateInfos();
}

/**
 * Setup instance of module client.
 * @returns
 *  reject in case of:  - Missing environment information.
 *                      - Connection to IoT Datahub not possible.
 */
async function setUpModuleClient(): Promise<void> {
  const logPrefix = `systeminfo::setUpModuleClient`;

  if (moduleClient) {
    return Promise.resolve();
  }

  winston.info(
    `${logPrefix} module client not yet instantiated. Creating module client.`
  );
  moduleClient = await ModuleClient.fromEnvironment(IotHubTransport).catch(
    (error) => {
      moduleClient = null;
      return Promise.reject(
        `${logPrefix} error creating module client due to ${JSON.stringify(
          error || ''
        )}.`
      );
    }
  );
  winston.verbose(`${logPrefix} module client successfully created.`);
  await moduleClient.open().catch((error) => {
    return Promise.reject(
      `${logPrefix} error connecting module client due to ${JSON.stringify(
        error || ''
      )}.`
    );
  });
  winston.verbose(`${logPrefix} moduleClient instance connected.`);
}

async function sendGetMDCLUpdateInfos(cb: () => {}) {
  const logPrefix = `systemInfo::sendGetMDCLUpdateInfos1`;
  const azureFuncName = 'get-mdclight-updates';
  const commandId = uuid();
  const callbackName = commandId;

  winston.error(`${logPrefix} registering ${commandId}`);
  try {
    moduleClient.onMethod(callbackName, updateCbHandler);
    winston.error(`${logPrefix} ${commandId} registered.`);
  } catch (err) {
    winston.error(`${logPrefix} ${commandId} already registered.`);
  }

  const payload: CommandEventPayload = {
    locale: 'en'
  };
  const msg = new Message(JSON.stringify(payload));

  msg.properties.add('messageType', 'command');
  msg.properties.add('moduleId', process.env.IOTEDGE_MODULEID);
  msg.properties.add('command', azureFuncName);
  msg.properties.add('commandId', commandId);
  msg.properties.add('methodName', callbackName);

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
