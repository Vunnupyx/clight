import fetch from 'node-fetch';
import winston from 'winston';
import {
  ICosNetworkAdapterSetting,
  ICosNetworkAdapterSettings,
  ICosNetworkAdapterStatus,
  ICosResponseError,
  ICosSystemVersions,
  ICosSystemRestartResponse,
  ICosSystemCommissioningStatus,
  ICosLedsList,
  IMachineInfo
} from './interfaces';

export class ConfigurationAgentManager {
  public static hostname =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost'
      : 'http://172.17.0.1';

  public static port = '1884';
  public static pathPrefix = '/api/v1';

  private static async request(
    method: string = 'GET',
    endpoint: string,
    skipResponseParsing: boolean = false
  ): Promise<
    | ICosNetworkAdapterSettings
    | ICosNetworkAdapterSetting
    | ICosNetworkAdapterStatus
    | ICosSystemVersions
    | ICosSystemRestartResponse
    | ICosLedsList
    | ICosResponseError
  > {
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
      if (
        !response.ok ||
        (response.status !== 200 && response.status !== 201)
      ) {
        winston.error(`${logPrefix} error in response: ${response.status}`);
        return Promise.reject(new Error(`Error: ${response.status}`));
      }

      if (skipResponseParsing) {
        return response;
      }

      let responseData:
        | ICosNetworkAdapterSettings
        | ICosNetworkAdapterSetting
        | ICosNetworkAdapterStatus
        | ICosSystemRestartResponse
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

  public static async getCommissioningStatus(): Promise<boolean> {
    const result = (await this.request(
      'GET',
      '/system/commissioning'
    )) as ICosSystemCommissioningStatus;
    return result?.Finished ?? false;
  }

  public static async getSystemVersions(): Promise<ICosSystemVersions> {
    const result = (await this.request(
      'GET',
      '/system/versions'
    )) as ICosSystemVersions;
    return result;
  }

  public static async getMachineInfo(): Promise<IMachineInfo> {
    const result = (await this.request('GET', '/machine/info')) as IMachineInfo;
    return result;
  }

  public static async systemRestart(): Promise<ICosSystemRestartResponse> {
    const result = (await this.request(
      'POST',
      '/system/restart'
    )) as ICosSystemRestartResponse;
    return result;
  }

  public static async getNetworkAdapters(): Promise<ICosNetworkAdapterSettings> {
    const result = (await this.request(
      'GET',
      '/network/adapters'
    )) as ICosNetworkAdapterSettings;

    return result;
  }

  public static async getSingleNetworkAdapterSetting(
    adapterId: 'enoX1' | 'enoX2'
  ): Promise<ICosNetworkAdapterSetting> {
    if (adapterId !== 'enoX1' && adapterId !== 'enoX2') {
      return Promise.reject(new Error('Adapter Id not correct'));
    }
    const result = (await this.request(
      'GET',
      `/network/adapters/${adapterId}`
    )) as ICosNetworkAdapterSetting;
    return result;
  }

  public static async getSingleNetworkAdapterStatus(
    adapterId: 'enoX1' | 'enoX2'
  ): Promise<ICosNetworkAdapterStatus> {
    if (adapterId !== 'enoX1' && adapterId !== 'enoX2') {
      return Promise.reject(new Error('Adapter Id not correct'));
    }
    const result = (await this.request(
      'GET',
      `/network/adapters/${adapterId}/status`
    )) as ICosNetworkAdapterStatus;
    return result;
  }

  /**
   * Gets the ids of the LEDs on CELOS, currently defined as "user1" and "user2"
   */
  public static async getLedList(): Promise<ICosLedsList> {
    const logPrefix = `${ConfigurationAgentManager.name}::getLedList`;
    try {
      const result = (await this.request(
        'GET',
        `/system/leds`
      )) as ICosLedsList;
      return result;
    } catch (error) {
      winston.error(`${logPrefix} error setting LED status: ${error}`);

      return [];
    }
  }

  /**
   * Sets the new LED status, on/off, its color and frequency
   */
  public static async setLedStatus(
    ledId: string,
    newStatus: 'on' | 'off' = 'off',
    color?: 'green' | 'red' | 'orange',
    frequency?: number // 0-20, DEFAULT is 0
  ): Promise<boolean> {
    const logPrefix = `${ConfigurationAgentManager.name}::setLedStatus`;
    try {
      const freq = !frequency
        ? 0
        : frequency > 20
        ? 20
        : frequency < 0
        ? 0
        : frequency;
      const baseQuery = `/system/leds/${ledId}/${newStatus}`;
      const offQuery = baseQuery;
      let onQuery = `${baseQuery}?colour=${color}`; // API query is "colour"
      if (freq) {
        onQuery = `${onQuery}&frequency=${freq}`;
      }

      await this.request('POST', newStatus === 'on' ? onQuery : offQuery, true);
      return true;
    } catch (error) {
      winston.error(`${logPrefix} error setting LED status: ${error}`);
      return false;
    }
  }
}
