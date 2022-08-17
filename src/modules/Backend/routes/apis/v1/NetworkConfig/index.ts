import { Request, Response } from 'express';
import winston from 'winston';
import moment from 'moment';
import { ConfigManager } from '../../../../../ConfigManager';
import { ITimeConfig } from '../../../../../ConfigManager/interfaces';
import NetworkManagerCliController from '../../../../../NetworkManager';
import { TimeManager } from '../../../../../NetworkManager/TimeManager';
import SshService from '../../../../../SshService';

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

  const {
    x1: cx1,
    x2: cx2,
    time: cfgTime
  } = configManager.config.networkConfig;

  let currentTime = moment().toISOString(); // may be in wrong timezone, because docker doesn't now it

  try {
    const timeRes = await SshService.sendCommand('date +%FT%T');

    if (timeRes.stderr === '') {
      currentTime = (timeRes.stdout as string).trim();
    }
  } catch (err) {
    winston.warn(
      `${logPrefix} failed to read current date. Returning docker time instead (always UTC). Error: ${JSON.stringify(
        err
      )}`
    );
  }

  const reachable = await TimeManager.testNTPServer(cfgTime.ntpHost)
    .then(() => true)
    .catch(() => false);
  const time = {
    ...cfgTime,
    reachable,
    currentTime
  };
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
    time
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

  const timeConfig: ITimeConfig = request.body?.time;
  let timePromise;
  if (timeConfig) {
    if (!timeConfig.useNtp) {
      // ISO8601 to YYYY-MM-DD hh:mm:ss
      const [YYYY, MM, DD, hh, mm, ss] =
        timeConfig.currentTime.split(/[/:\-T]/);
      timePromise = TimeManager.setTimeAndZoneManually(
        `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss.slice(0, 2)}`,
        timeConfig.timezone
      );
    } else {
      const allReadyConfigured =
        timeConfig.ntpHost === configManager.config.networkConfig.time?.ntpHost;
      if (allReadyConfigured)
        winston.debug(`${logPrefix} received ntp-config again, ignore data.`);
      timePromise = allReadyConfigured
        ? Promise.resolve()
        : TimeManager.setNTPServer(timeConfig.ntpHost);
    }
  }

  let errorMsg = '';
  await Promise.allSettled([
    NetworkManagerCliController.setConfiguration('eth0', x1Config),
    NetworkManagerCliController.setConfiguration('eth1', x2Config),
    timePromise
  ])
    .then((results) => {
      results.forEach((result) => {
        if (result.status === 'rejected') {
          winston.error(
            `networkConfigPatchHandler error due to ${result.reason}. Only writing configuration to config file.`
          );
        }
      });
    })
    .then(() => {
      configManager.saveConfig({ networkConfig: request.body });
      response
        .status(errorMsg ? 400 : 200)
        .json(errorMsg || configManager.config.networkConfig);
    })
    .catch((err) => {
      winston.error(`${logPrefix} error due to ${err?.msg}`);
    });
}

export const networkConfigHandlers = {
  networkConfigGet: networkConfigGetHandler,
  networkConfigPatch: networkConfigPatchHandler
};
