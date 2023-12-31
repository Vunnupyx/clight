import { createSocket } from 'dgram';
import { Response, Request } from 'express';
import winston from 'winston';
import { ConfigurationAgentManager } from '../../../../../ConfigurationAgentManager';
import {
  ICosNetworkAdapterSetting,
  ICosNetworkAdapterSettings,
  ICosNetworkAdapterStatus,
  ICosResponseError
} from '../../../../../ConfigurationAgentManager/interfaces';
const dns = require('dns').promises;

/**
 * Type guard for ResponseError
 * @param obj Object to check if it is a ICosResponseError
 * @returns
 */
function isResponseError(obj: any): obj is ICosResponseError {
  return typeof obj.error === 'string' && typeof obj.message === 'string';
}

/**
 * Type guard for AdapterSettings
 * @param obj Object to check if it is a IAdapterSettings
 * @returns
 */
function isAdapterSettings(obj: any): obj is ICosNetworkAdapterSetting {
  obj = obj as ICosNetworkAdapterSetting;
  return (
    typeof (obj as ICosNetworkAdapterSetting).enabled === 'boolean' &&
    typeof (obj as ICosNetworkAdapterSetting).id === 'string'
  );
}

/**
 * Interface for Response data
 */
interface ICheckedNTPEntry {
  address: string;
  reachable: boolean;
  valid: boolean;
}

/**
 * Route handler for /check-ntp
 */
async function ntpCheckGetHandler(
  request: Request,
  response: Response
): Promise<void> {
  const logPrefix = `getCheckedNTPServer::/check-ntp`;

  const ntpList = Array.isArray(request.query.addresses)
    ? (request.query.addresses as Array<string>)
    : typeof request.query.addresses === 'string'
    ? [request.query.addresses]
    : undefined;

  winston.verbose(`${logPrefix} route called. Query: ${ntpList}`);
  if (!ntpList) {
    response.status(400).json({
      msg: 'Error: Invalid query parameters'
    });
    return;
  }
  await ntpCheck(ntpList)
    .then((checkedList) => {
      response.status(200).json(checkedList);
      return;
    })
    .catch((err) => {
      response.status(500).json({
        msg: 'Internal server error'
      });
    });
}

/**
 * Update Network Config
 */
async function ntpCheck(
  ntpArray: Array<string>
): Promise<Array<ICheckedNTPEntry>> {
  const validated = ntpArray.map<ICheckedNTPEntry>((ntpEntry: string) => {
    const ntpListEntry = {
      address: ntpEntry,
      reachable: false,
      valid: false
    };

    if (typeof ntpEntry !== 'string') {
      return ntpListEntry;
    }

    if (isIpAddress(ntpEntry) || isHostname(ntpEntry)) {
      ntpListEntry.valid = true;
    }
    return ntpListEntry;
  });

  if (process.env.NODE_ENV !== 'development' && !(await checkInterfaces())) {
    return Promise.resolve(validated);
  }

  const reachableCheck = validated.map<Promise<ICheckedNTPEntry>>((entry) => {
    return new Promise(async (res) => {
      return res({
        ...entry,
        reachable: entry.valid ? await testNTPServer(entry.address) : false
      });
    });
  });
  return Promise.all(reachableCheck);
}

/**
 * Check if is a valid ip.
 */
function isIpAddress(toCheck: string): boolean {
  const ipAddressRegex = new RegExp(
    '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$'
  );
  return ipAddressRegex.test(toCheck);
}

/**
 * Check if is a valid hostname.
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
  const timeOut = 1000 * 1; // NTP request abort
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
      try {
        client.close();
        client.removeAllListeners();
        winston.error(`${logPrefix} ntp request timed out.`);
        return res(false);
      } catch (error) {
        winston.error(
          `${logPrefix} error with timeout of ntp request: ${error}`
        );
      }
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
 * Check if a request can be send over any interface. Response as true means interface is enabled and connected
 */
async function checkInterfaces(): Promise<boolean> {
  const logPrefix = `NTPCheck::checkInterfaces`;

  let adapterInfos: Array<ICosNetworkAdapterSetting['id']> = [];
  winston.debug(`${logPrefix} sending request to get all interfaces.`);

  return await ConfigurationAgentManager.getNetworkAdapters()
    .then((payload: ICosNetworkAdapterSettings | ICosResponseError) => {
      winston.debug(`${logPrefix} Got payload: ${JSON.stringify(payload)}`);
      if (isResponseError(payload)) {
        winston.debug(`${logPrefix} Payload is error response`);
        return Promise.reject(
          new Error((payload as ICosResponseError).message)
        );
      }
      if (
        !(
          Array.isArray(payload) &&
          payload.length > 0 &&
          isAdapterSettings(payload[0])
        )
      ) {
        winston.debug(`${logPrefix} Payload is invalid`);
        return Promise.reject(
          new Error(`${logPrefix} invalid payload: ${payload}`)
        );
      }
      payload.forEach(({ enabled, id }) => {
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
      const requests = adapterInfos.map((id: 'enoX1' | 'enoX2') =>
        ConfigurationAgentManager.getSingleNetworkAdapterStatus(id)
      );
      return Promise.all(requests);
    })
    .then((payload: Array<ICosNetworkAdapterStatus>) => {
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
  ntpCheckGetHandler
};
