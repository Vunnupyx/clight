import { Request, Response } from 'express';
import winston from 'winston';
import { ConfigManager } from '../../../../../ConfigManager';
import NetworkManagerCliController from '../../../../../NetworkManager';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 * @param {ConfigManager} config
 */
export function setConfigManager(config: ConfigManager) {
  configManager = config;
}

/**
 * Collect information about current network configuration and return merged information.
 * @param  {Request} request
 * @param  {Response} response
 */
async function networkConfigGetHandler(
  request: Request,
  response: Response
): Promise<void> {
  // Get real configuration of host
  const logPrefix = `${networkConfigGetHandler.name}`;

  const [x1, x2] = await Promise.all([
    NetworkManagerCliController.getConfiguration('eth0'),
    NetworkManagerCliController.getConfiguration('eth1')
  ]).catch((e) => {
    winston.warn(
      `${logPrefix} connection to host network manager failed. Returning configuration from config file.`
    );
    return [undefined, undefined];
  });

  const { x1: cx1, x2: cx2 } = configManager.config.networkConfig;

  const merged = {
    x1: {
      useDhcp: x1?.dhcp || cx1.useDhcp,
      ipAddr: x1?.ipAddress || cx1.ipAddr,
      netmask: x1?.subnetMask || cx1.netmask,
      defaultGateway: x1?.gateway || cx1.defaultGateway,
      dnsServer: x1?.dns || cx1.dnsServer
    },
    x2: {
      useDhcp: x2?.dhcp || cx2.useDhcp,
      ipAddr: x2?.ipAddress || cx2.ipAddr,
      netmask: x2?.subnetMask || cx2.netmask,
      defaultGateway: x2?.gateway || cx2.defaultGateway,
      dnsServer: x2?.dns || cx2.dnsServer
    },
    proxy: configManager.config.networkConfig.proxy,
    time: configManager.config.networkConfig.time
  };
  response.status(200).json(merged);
}

/**
 * Update Network Config
 * @param  {Request} request
 * @param  {Response} response
 */
async function networkConfigPatchHandler(
  request: Request,
  response: Response
): Promise<void> {
  const logPrefix = `${networkConfigPatchHandler.name}`;

  const x2Config = NetworkManagerCliController.generateNetworkInterfaceInfo(
    request.body.x2,
    'eth1'
  );
  const x1Config = NetworkManagerCliController.generateNetworkInterfaceInfo(
    request.body.x1,
    'eth0'
  );

  await Promise.allSettled([
    NetworkManagerCliController.setConfiguration('eth0', x1Config),
    NetworkManagerCliController.setConfiguration('eth1', x2Config)
  ]).then((results) => {
    results.forEach((result) => {
      if (result.status === 'rejected')
        winston.error(
          `networkConfigPatchHandler error due to ${result.reason}. Only writing configuration to config file.`
        );
    });
  });
  configManager.saveConfig({ networkConfig: request.body });
  response.status(200).json(configManager.config.networkConfig);
}

export const networkConfigHandlers = {
  networkConfigGet: networkConfigGetHandler,
  networkConfigPatch: networkConfigPatchHandler
};
