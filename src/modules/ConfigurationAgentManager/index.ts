import fetch from 'node-fetch';
import winston from 'winston';
import {
  ICosNetworkAdapterSetting,
  ICosNetworkAdapterSettings,
  ICosNetworkAdapterStatus,
  ICosResponseError,
  ICosSystemVersions
} from './interfaces';

export class ConfigurationAgentManager {
  public static hostname =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost'
      : 'http://172.17.0.1';

  public static port = '1884';
  public static pathPrefix = '/api/v1';

  private static async request(method = 'GET', endpoint) {
    const logPrefix = `${ConfigurationAgentManager.name}::request`;

    const url = `${this.hostname}:${this.port}${this.pathPrefix}${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok || response.status !== 200) {
        winston.error(`${logPrefix} error in response: ${response.status}`);
        return Promise.reject(new Error(`Error: ${response.status}`));
      }

      let responseData:
        | ICosNetworkAdapterSettings
        | ICosNetworkAdapterSetting
        | ICosNetworkAdapterStatus
        | ICosSystemVersions
        | ICosResponseError = await response.json();

      winston.verbose(
        `${logPrefix} got response for ${url} : ${JSON.stringify(responseData)}`
      );

      return responseData;
    } catch (e) {
      winston.error(
        `${logPrefix} got error response for ${url} : ${JSON.stringify(e)}`
      );
      return Promise.reject(new Error(e));
    }
  }

  public static async getSystemVersions() {
    return this.request('GET', '/system/versions');
  }
  public static async systemRestart() {
    return this.request('POST', '/system/restart');
  }

  public static async getNetworkAdapters() {
    return this.request('GET', '/network/adapters');
  }

  public static async getSingleNetworkAdapterSetting(adapterId) {
    if (!adapterId || typeof adapterId !== 'string') {
      return Promise.reject(new Error('Adapter Id missing or not string'));
    }
    return this.request('GET', `/network/adapters/${adapterId}`);
  }

  public static async getSingleNetworkAdapterStatus(adapterId) {
    if (!adapterId || typeof adapterId !== 'string') {
      return Promise.reject(new Error('Adapter Id missing or not string'));
    }
    return this.request('GET', `/network/adapters/${adapterId}/status`);
  }
}
