import { createSocket } from 'dgram';
import { Response, Request } from 'express';
import winston from 'winston';
import fetch from 'node-fetch';
const dns = require('dns').promises;

interface IAdapterSettings {
  id: string;
  displayName?: string;
  enabled: boolean;
  ipv4Settings: any; // currently not required
  ipv6Settings?: any; // currently not required
  macAddress?: string;
  ssid?: string;
}

interface IAdapterStatus {
  linkStatus: 'disabled' | 'disconnected' | 'connected' | 'unknown';
  configurationStatus:
    | 'configuring'
    | 'unmanaged'
    | 'failed'
    | 'pending'
    | 'linger'
    | 'unknown';
  message: string;
}

interface IResponseError {
  message: string;
  error: string;
}

/**
 * Type guard for ResponseError
 * @param obj Object to check if it is a IResponseError
 * @returns
 */
function isResponseError(obj: any): obj is IResponseError {
  return typeof obj.error === 'string' && typeof obj.message === 'string';
}

/**
 * Type guard for AdapterSettings
 * @param obj Object to check if it is a IAdapterSettings
 * @returns
 */
function isAdapterSettings(obj: any): obj is IAdapterSettings {
  obj = obj as IAdapterSettings;
  return (
    typeof (obj as IAdapterSettings).enabled === 'boolean' &&
    typeof (obj as IAdapterSettings).id === 'string'
  );
}

/**
 * Interface for Response data
 */
interface ICheckedNTPEntry {
  address: string;
  responsible: boolean;
  valid: boolean;
}

/**
 * Route handler for /check-ntp
 * @param req Express request object
 * @param res Express response object
 */
async function getCheckedNTPServer(req: Request, res: Response) {
  ntpCheck(
    Array.isArray(req.params.address)
      ? req.params.address
      : [req.params.address]
  )
    .then((checkedList) => {
      res.status(200).json(checkedList);
      return;
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          msg: 'Internal server error'
        }
      });
    });
}

/**
 * Update Network Config
 * @param request request object from ntp
 * @param response
 */
async function ntpCheck(
  ntpArray: Array<string>
): Promise<Array<ICheckedNTPEntry>> {
  const logPrefix = `ntpCheck`;

  const validated = ntpArray.map<ICheckedNTPEntry>((nptEntry: string) => {
    if (typeof nptEntry !== 'string') {
      return {
        address: nptEntry,
        responsible: false,
        valid: false
      };
    }

    if (!isIpAddress(nptEntry) && !isHostname(nptEntry)) {
      return {
        address: nptEntry,
        responsible: false,
        valid: false
      };
    }
    return {
      address: nptEntry,
      responsible: undefined,
      valid: true
    };
  });

  const responsibleCheck = validated.map<Promise<ICheckedNTPEntry>>((entry) => {
    return new Promise(async (res) => {
      if (!entry.valid) res(entry);
      return res({
        ...entry,
        responsible: await testNTPServer(entry.address)
      });
    });
  });
  return Promise.all(responsibleCheck);
}

/**
 * Check if is a valid ip.
 * @param toCheck Address to check
 * @returns
 */
function isIpAddress(toCheck: string): boolean {
  const ipAddressRegex = new RegExp(
    '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$'
  );
  return ipAddressRegex.test(toCheck);
}

/**
 * Checkl if is a valid hostname.
 * @param toCheck Address to check
 * @returns
 */
function isHostname(toCheck: string): boolean {
  const hostnameRegex = new RegExp(
    '^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$'
  );
  return hostnameRegex.test(toCheck);
}

/**
 * Test if a server is a valid and available ntp server.
 */
function testNTPServer(server: string): Promise<boolean> {
  const logPrefix = `NTP::testNTPServer`;
  winston.debug(`${logPrefix} start testing: ${server}`);

  return new Promise<boolean>(async (res, rej) => {
    if (await checkInterfaces()) {
      winston.warn(`${logPrefix} fo interface available.`);
      return res(false);
    }
    if (isHostname(server)) {
      await dns.lookup(server).catch(() => {
        winston.error(
          `${logPrefix} DNS lookup for ${server} failed. Testing NTP Server aborted.`
        );
        return res(false);
      });
    }

    const client = createSocket('udp4');
    const bufferData = new Array(48).fill(0);
    bufferData[0] = 0x1b;
    const requestData = Buffer.from(bufferData);

    const timeout = setTimeout(() => {
      client.close();
      client.removeAllListeners();
      winston.error(`${logPrefix} ntp request timed out.`);
      return res(false);
    }, 1000 * 10);

    client.on('error', (err) => {
      client.close();
      clearTimeout(timeout);
      return res(false);
    });

    client.once('message', (msg) => {
      winston.debug(`${logPrefix} received response. NTP server available`);
      client.close();
      clearTimeout(timeout);
      return res(true);
    });

    client.send(requestData, 123, server, (err, bytes) => {
      if (err) {
        winston.error(
          `${logPrefix} ${server} not available due to ${JSON.stringify(err)}`
        );
        client.close();
        client.removeAllListeners();
        clearTimeout(timeout);
        rej(false);
      }
      winston.info(`${logPrefix} send ntp request to ${server}`);
    });
  });
}

/**
 * Check if a request can be send over any interface.
 *
 * @returns Is any interface enabled and connected ?
 */
async function checkInterfaces(): Promise<boolean> {
  const logPrefix = `NTPCheck::checkInterfaces`;
  const adaptersEndpoint = '/network/adapters';
  const adapterStatus = '/network/adapters/{adapterID}/status';
  let adapterInfos: Array<IAdapterSettings['id']>;
  winston.debug(`${logPrefix} send request to get all interfaces.`);

  return await fetch(adaptersEndpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then((res) => {
      return Promise.all[(res.json(), res.status)];
    })
    .then((payload: [Array<IAdapterSettings> | IResponseError, number]) => {
      if (payload[1] !== 200) {
        if (isResponseError(payload[0])) {
          return Promise.reject(new Error(payload[0].message));
        }
      }
      if (
        !(
          Array.isArray(payload[0]) &&
          payload[0].length > 0 &&
          isAdapterSettings(payload[0][0])
        )
      ) {
        return Promise.reject(
          new Error(`${logPrefix} invalid payload: ${payload}`)
        );
      }
      payload[0].forEach(({ enabled, id }) => {
        // Filter disabled Adapters
        if (enabled) {
          adapterInfos.push(id);
        }
      });
      winston.debug(
        `${logPrefix} received interfaces ${JSON.stringify(adapterInfos)}`
      );
    })
    .then(() => {
      const requests = Object.keys(adapterInfos).map((id) => {
        return fetch(adapterStatus.replace('{adapterID}', id));
      });
      return Promise.all(requests);
    })
    .then((resArray) => {
      return Promise.all(resArray.map((res) => res.json()));
    })
    .then((payload: Array<IAdapterStatus>) => {
      for (const [index] of adapterInfos.entries()) {
        if (payload[index].linkStatus === 'connected') {
          winston.debug(
            `${logPrefix} found available interface: ${adapterInfos[index]}: connected`
          );
          return true;
        }
      }
      winston.debug(`${logPrefix} no available interface found.`);
      return false;
    })
    .catch((err) => {
      winston.error(
        `${logPrefix} no available interface found due to ${JSON.stringify(
          err
        )}`
      );
      return false;
    });
}

export const ntpCheckHandlers = {
  checkNTPGet: getCheckedNTPServer
};
