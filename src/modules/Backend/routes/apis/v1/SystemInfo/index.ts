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
 * Trigger update mechanism of docker images.
 */
async function getUpdateInfos(request: Request, response: Response) {
  const logPrefix = `SystemInfo::triggerAzureFunction`;
  winston.error(`${logPrefix} routes handler called.`);

  if (process.env.NODE_ENV === 'development') {
    const warn = `${logPrefix} development environment detected. Update mechanisms not available.`;
    winston.warn(warn);
    return response.status(500).json({
      msg: warn.replace(logPrefix + ' d', 'D')
    });
  }

  type progressPayload = {
    progress: any;
  };

  type resultPayload = {
    result: any;
  };
  type remoteRequest = {
    requestId: string; // UUID generated by Azure backend
    methodName: string; // Name we register
    payload: {
      command: 'get-mdclight-updates';
      commandId: string; // Same as methodName
      payload: progressPayload | resultPayload;
    };
  };
  const updateCbHandler = (req: remoteRequest, res) => {
    winston.verbose(
      `${logPrefix} update infos 
      handler callback called: ${req.payload.commandId}`
    );
    // ACK response
    res.send(200, {
      message: `ACK`
    });

    // @ts-ignore //TODO: fix this.
    if (typeof req.payload.payload.result !== 'undefined') {
      return response.status(200).json({
        message: 'Available IoTFlex updates.',
        updates: req.payload.payload
      });
    }
  };

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

  await sendGetMDCLUpdateInfos(updateCbHandler);
  await shutdownModuleClient();
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

/**
 * Shutdown module client
 */
async function shutdownModuleClient(): Promise<void> {
  const logPrefix = `systeminfo::shutdownModuleClient`;

  if (!moduleClient) {
    winston.warn(`${logPrefix} no module client to shutdown available.`);
    return Promise.resolve();
  }

  winston.info(`${logPrefix} start module client shutdown.`);
  moduleClient.removeAllListeners();
  await moduleClient.close();
  moduleClient = null;
}

async function sendGetMDCLUpdateInfos(cb: (req, res) => {}) {
  const logPrefix = `systemInfo::sendGetMDCLUpdateInfos1`;
  const azureFuncName = 'get-mdclight-updates';
  const commandId = uuid();
  const callbackName = commandId;

  winston.error(`${logPrefix} registering ${commandId}`);
  try {
    moduleClient.onMethod(callbackName, cb);
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
 * Performs factory reset
 * @param request HTTP Request
 * @param response
 */
async function systemFactoryResetHandler(request: Request, response: Response) {
  try {
    await configManager.factoryResetConfiguration();
    response.status(200).send();
  } catch (e) {
    response.sendStatus(500);
  }
}

export const systemInfoHandlers = {
  systemInfoGet: systemInfoGetHandler,
  updateGet: getUpdateInfos,
  systemFactoryReset: systemFactoryResetHandler
};
