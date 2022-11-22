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
  const logPrefix = `getCheckedNTPServer::/check-ntp`;

  const ntpList = Array.isArray(req.query.addresses)
    ? (req.query.addresses as Array<string>)
    : typeof req.query.addresses === 'string'
    ? [req.query.addresses]
    : undefined;

  winston.verbose(`${logPrefix} route called. Query: ${ntpList}`);
  if (!ntpList) {
    res.status(400).json({
      msg: 'Error: Invalid query parameters'
    });
    return;
  }
  await ntpCheck(ntpList)
    .then((checkedList) => {
      res.status(200).json(checkedList);
      return;
    })
    .catch((err) => {
      res.status(500).json({
        msg: 'Internal server error'
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
    const ntpListEntry = {
      address: nptEntry,
      responsible: null,
      valid: false
    };

    if (typeof nptEntry !== 'string') {
      return ntpListEntry;
    }

    if (isIpAddress(nptEntry) || isHostname(nptEntry)) {
      ntpListEntry.valid = true;
    }
    return ntpListEntry;
  });

  if (process.env.NODE_ENV !== 'development' && !(await checkInterfaces())) {
    return Promise.resolve(validated);
  }

  const responsibleCheck = validated.map<Promise<ICheckedNTPEntry>>((entry) => {
    return new Promise(async (res) => {
      return res({
        ...entry,
        responsible: entry.valid ? await testNTPServer(entry.address) : false
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
  const timeOut = 1000 * 0.5; // NTP request abort
  winston.debug(`${logPrefix} start testing: ${server}`);

  return new Promise<boolean>(async (res, rej) => {
    if (isHostname(server)) {
      winston.verbose(`${logPrefix} start DNS lookup for: ${server}`);
      await dns
        .lookup(server)
        .then(() => {
          winston.verbose(
            `${logPrefix} DNS lookup for ${server} successfully.`
          );
        })
        .catch(() => {
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
    }, timeOut);

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

    winston.verbose(`${logPrefix} send ntp request to ${server}`);
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
  const basePath =
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:1884'
      : 'http://host.docker.internal:1884') + '/api/v1';
  const adaptersEndpoint = '/network/adapters';
  const adapterStatus = '/network/adapters/{adapterID}/status';
  let adapterInfos: Array<IAdapterSettings['id']>;
  winston.debug(
    `${logPrefix} send request to get all interfaces. GET ${
      basePath + adaptersEndpoint
    }`
  );

  return await fetch(basePath + adaptersEndpoint, {
    method: 'GET'
  })
    .then((res) => {
      winston.verbose(`${logPrefix} got response: ${JSON.stringify(res)}`);
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
        return fetch(basePath + adapterStatus.replace('{adapterID}', id));
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
