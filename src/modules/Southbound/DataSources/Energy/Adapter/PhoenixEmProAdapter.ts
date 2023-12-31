import winston from 'winston';
import fetch from 'node-fetch';

import { IEnergyDataSourceConnection } from '../../../../ConfigManager/interfaces';
import { EMPRO_GET_ENDPOINTS } from './EmProGetEndpoints';
import { IMeasurement } from '../../interfaces';
import {
  IEmProReadingResponse,
  IEmProBulkReadingResponse,
  IEmProTariffChangeResponse,
  IHostConnectivityState
} from '../interfaces';
import { isValidIpOrHostname } from '../../../../Utilities';

/**
 * Phoenix Contact EMpro Adapter
 */
export class PhoenixEmProAdapter {
  public hostConnectivityState = IHostConnectivityState.UNKNOWN;
  private hostname: string | null;
  private allMeasurementsEndpoint = '/api/v1/measurements';
  private allMetersEndpoint = '/api/v1/meters';
  private allInformationEndpoint = '/api/v1/information';

  public currentTariff = '0';

  constructor(private connection: IEnergyDataSourceConnection) {
    this.hostname = isValidIpOrHostname(this.connection?.ipAddr)
      ? this.connection?.ipAddr?.startsWith('http')
        ? this.connection?.ipAddr
        : `http://${this.connection?.ipAddr}`
      : null;
  }

  public get isReady() {
    return typeof this.hostname === 'string' && this.hostname?.length > 0;
  }

  /**
   * Tests connectivity to given hostname
   */
  public async testHostConnectivity(): Promise<void> {
    const logPrefix = `${PhoenixEmProAdapter.name}::testHostConnectivity`;

    if (!this.isReady) {
      return Promise.resolve();
    }
    try {
      const result = await this.performApiCall(
        'GET',
        `${this.hostname}${this.allInformationEndpoint}`
      );

      if (result) {
        this.hostConnectivityState = IHostConnectivityState.OK;
      }
    } catch (err) {
      winston.warn(
        `${logPrefix} error connecting to Phoenix EMpro host at ${this.hostname}, error: ${err}`
      );
      this.hostConnectivityState = IHostConnectivityState.ERROR;
    }
  }

  /**
   * It reads all measurements and meters from EMpro
   * @returns {Array<IMeasurement>}
   */
  public getAllDatapoints(): Promise<Array<IMeasurement>> {
    const logPrefix = `${PhoenixEmProAdapter.name}::readAllDatapoints`;
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        return reject(new Error('Hostname is not valid'));
      }
      let resultArray: IMeasurement[] = [];
      let hasMeasurementReadingError = false;
      let hasMeterReadingError = false;
      let hasTariffReadingError = false;
      let hasDeviceInformationReadingError = false;

      //Get all measurements
      try {
        const allMeasurements: IEmProBulkReadingResponse =
          await this.performApiCall(
            'GET',
            `${this.hostname}${this.allMeasurementsEndpoint}`
          );
        for (let measurement of allMeasurements.items) {
          resultArray.push({
            id: measurement.id,
            name: measurement.name,
            value: measurement.value,
            unit: measurement.unit,
            description: measurement.description
          });
        }
      } catch (e) {
        winston.warn(
          `${logPrefix} Error reading all measurements: ${
            (e as Error)?.message || e
          }`
        );
        hasMeasurementReadingError = true;
      }
      //Get all meters
      try {
        const allMeters: IEmProBulkReadingResponse = await this.performApiCall(
          'GET',
          `${this.hostname}${this.allMetersEndpoint}`
        );
        for (let measurement of allMeters.items) {
          resultArray.push({
            id: measurement.id,
            name: measurement.name,
            value: measurement.value,
            unit: measurement.unit,
            description: measurement.description
          });
        }
      } catch (e) {
        winston.warn(
          `${logPrefix} Error reading all meters: ${(e as Error)?.message || e}`
        );
        hasMeterReadingError = true;
      }

      // Get device information
      try {
        const allDeviceInfo: IEmProBulkReadingResponse =
          await this.performApiCall(
            'GET',
            `${this.hostname}${this.allInformationEndpoint}`
          );
        for (let measurement of allDeviceInfo.items) {
          resultArray.push({
            id: measurement.id,
            name: measurement.name,
            value: measurement.value,
            unit: measurement.unit,
            description: measurement.description
          });
        }
      } catch (e) {
        winston.warn(
          `${logPrefix} Error reading device information: ${
            (e as Error)?.message || e
          }`
        );
        hasDeviceInformationReadingError = true;
      }

      // Get tariff number
      try {
        const currentTariff = (await this.getCurrentTariff(
          true
        )) as IEmProReadingResponse;
        resultArray.push({
          id: currentTariff.id,
          name: currentTariff.name,
          value: currentTariff.value,
          unit: currentTariff.unit,
          description: currentTariff.description
        });
      } catch (e) {
        winston.warn(
          `${logPrefix} Error reading current tariff: ${
            (e as Error)?.message || e
          }`
        );
        hasTariffReadingError = true;
      }
      if (
        hasMeasurementReadingError &&
        hasMeterReadingError &&
        hasTariffReadingError &&
        hasDeviceInformationReadingError
      ) {
        return reject(new Error('Could not read any values'));
      } else {
        return resolve(resultArray);
      }
    });
  }

  /**
   * Changes tariff to the given tariff number
   * @param newTariffNo new tariff number, must be 1, 2, 3 or 4
   * @returns {Promise<true>}  resolves to true or rejects
   */
  public changeTariff(newTariffNo: number | string): Promise<true> {
    const logPrefix = `${PhoenixEmProAdapter.name}::changeTariff`;
    return new Promise(async (resolve, reject) => {
      if (!['0', '1', '2', '3', '4'].includes(String(newTariffNo))) {
        winston.warn(`${logPrefix} new tariff number is wrong: ${newTariffNo}`);
        return reject(new Error('Wrong tariff number'));
      }
      const putEndpoint = `/api/v1/measurement-system-control/tariff-number?value=${newTariffNo}`;

      try {
        if (!this.isReady) {
          return reject(new Error('Hostname is not valid'));
        }
        const result: IEmProTariffChangeResponse = await this.performApiCall(
          'PUT',
          `${this.hostname}${putEndpoint}`
        );
        if (result.message === 'OK' && result.code === 200) {
          winston.debug(
            `${logPrefix} tariff changed successfully to: ${newTariffNo}`
          );
          return resolve(true);
        } else {
          // Fail
          winston.error(
            `${logPrefix} error occurred while trying to change tariff: ${result.error} ${result.code}`
          );
          return reject(new Error(result?.error));
        }
      } catch (e) {
        winston.warn(
          `${logPrefix} Error changing tariff: ${(e as Error)?.message || e}`
        );
        return reject(e);
      }
    });
  }

  /**
   *  Reads single data point
   * @param dataPointAddress Address field of the data point
   * @returns {Promise<IMeasurement>}
   */
  public getSingleDataPoint(dataPointAddress: string): Promise<IMeasurement> {
    const logPrefix = `${PhoenixEmProAdapter.name}::getSingleDataPoint`;
    return new Promise(async (resolve, reject) => {
      if (!EMPRO_GET_ENDPOINTS[dataPointAddress]) {
        winston.warn(
          `${logPrefix} Trying to read unknown data point: ${dataPointAddress}`
        );
        return reject(new Error('Datapoint not found'));
      }
      try {
        if (!this.isReady) {
          return reject(new Error('Hostname is not valid'));
        }
        const measurement = await this.performApiCall(
          'GET',
          `${this.hostname}${EMPRO_GET_ENDPOINTS[dataPointAddress]}`
        );
        let result = {
          id: measurement.id,
          name: measurement.name,
          value: measurement.value,
          unit: measurement.unit,
          description: measurement.description
        };

        return resolve(result);
      } catch (e) {
        winston.warn(
          `${logPrefix} Error reading data point: ${(e as Error)?.message || e}`
        );
        return reject(e);
      }
    });
  }

  /**
   *  Reads current tariff
   * @param fullResponse By default false and returns tariff number, true returns full response
   * @returns {Promise<string>}
   */
  public getCurrentTariff(
    fullResponse = false
  ): Promise<string | IEmProReadingResponse> {
    const logPrefix = `${PhoenixEmProAdapter.name}::getCurrentTariff`;
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.isReady) {
          return reject(new Error('Hostname is not valid'));
        }
        const result = await this.performApiCall(
          'GET',
          `${this.hostname}${EMPRO_GET_ENDPOINTS['tariff-number']}`
        );
        return resolve(
          fullResponse
            ? result
            : typeof result?.value === 'number'
            ? String(result.value)
            : '0'
        );
      } catch (e) {
        winston.warn(
          `${logPrefix} Error reading tariff: ${(e as Error)?.message || e}`
        );
        return reject(e);
      }
    });
  }

  /**
   * Handles API call and its response
   * @param method GET or PUT
   * @param url url string
   */
  private performApiCall(method: 'GET' | 'PUT', url: string): Promise<any> {
    const logPrefix = `${PhoenixEmProAdapter.name}::performApiCall`;
    return new Promise(async (resolve, reject) => {
      if (!['GET', 'PUT'].includes(method) || typeof url !== 'string') {
        winston.error(`${logPrefix} invalid parameters: ${method} ${url}`);
        return reject(new Error('Invalid Parameter'));
      }
      try {
        const response = await fetch(url, {
          method,
          timeout: 3000,
          compress: false
        });
        if (response.ok) {
          const data = await response?.json();
          this.hostConnectivityState = IHostConnectivityState.OK;
          //Success
          return resolve(data);
        }
        winston.error(
          `${logPrefix} response was NOT ok from the endpoint: ${url}`
        );
        this.hostConnectivityState = IHostConnectivityState.ERROR;
        return reject(new Error('Response not OK'));
      } catch (e) {
        this.hostConnectivityState = IHostConnectivityState.ERROR;
        winston.error(
          `${logPrefix} unexpected error occurred while making API call: ${
            (e as Error)?.message
          }`
        );
        return reject(new Error((e as Error)?.message || 'Unexpected Error'));
      }
    });
  }
}
