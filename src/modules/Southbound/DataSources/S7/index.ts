import NodeS7 from 'nodes7';
import winston from 'winston';
import { DataSource } from '../DataSource';
import {
  DataSourceLifecycleEventTypes,
  LifecycleEventStatus,
  DataPointLifecycleEventTypes,
  EventLevels
} from '../../../../common/interfaces';
import { IDataPointConfig } from '../../../ConfigManager/interfaces';
import { IMeasurement } from '../interfaces';
import SinumerikNCK from './SinumerikNCK/NCDriver';
interface S7DataPointsWithError {
  datapoints: Array<any>;
  error: boolean;
}

interface NCDataPointWithStatus {
  value?: any;
  error?: string;
}

/**
 * Implementation of s7 data source
 * @returns void
 */
export class S7DataSource extends DataSource {
  private isDisconnected = false;
  private cycleActive = false;

  private client = new NodeS7({
    silent: true
  });
  private nckClient = new SinumerikNCK();

  /**
   * Initializes s7 data source and connects to device
   * @returns void
   */
  public async init(): Promise<void> {
    const { name, protocol, connection } = this.config;
    this.submitLifecycleEvent({
      id: protocol,
      level: this.level,
      type: DataSourceLifecycleEventTypes.Connecting,
      status: LifecycleEventStatus.Connecting,
      dataSource: { protocol, name }
    });
    this.currentStatus = LifecycleEventStatus.Connecting;

    const nckDataPointsConfigured = this.config.dataPoints.find(
      (dp: IDataPointConfig) => {
        return dp.type === 'nck';
      }
    );

    try {
      if (nckDataPointsConfigured)
        await Promise.all([
          this.connectPLC(connection),
          this.nckClient.connect(connection.ipAddr)
        ]);
      else await this.connectPLC(connection);
    } catch (error) {
      this.submitLifecycleEvent({
        id: protocol,
        level: this.level,
        type: DataSourceLifecycleEventTypes.ConnectionError,
        status: LifecycleEventStatus.ConnectionError,
        dataSource: { name, protocol },
        payload: error
      });
      this.currentStatus = LifecycleEventStatus.ConnectionError;
      this.reconnectTimeoutId = setTimeout(() => {
        if (this.isDisconnected) {
          return;
        }
        this.submitLifecycleEvent({
          id: protocol,
          level: this.level,
          type: DataSourceLifecycleEventTypes.Reconnecting,
          status: LifecycleEventStatus.Reconnecting,
          dataSource: { name, protocol }
        });
        this.currentStatus = LifecycleEventStatus.Reconnecting;
        this.init();
      }, this.RECONNECT_TIMEOUT);
      return;
    }

    this.submitLifecycleEvent({
      id: protocol,
      level: this.level,
      type: DataSourceLifecycleEventTypes.Connected,
      status: LifecycleEventStatus.Connected,
      dataSource: { name, protocol }
    });
    this.currentStatus = LifecycleEventStatus.Connected;
    this.isDisconnected = false;
    this.setupDataPoints();
  }

  /**
   * Reading data from device
   * @param addresses
   * @returns Promise
   */
  private readPlcData(addresses: string[]): Promise<S7DataPointsWithError> {
    return new Promise((resolve, reject) => {
      if (addresses.length === 0) resolve({ datapoints: [], error: null });
      try {
        const timeoutId = setTimeout(
          () =>
            reject(new Error(`PLC data timeout for addresses: [${addresses}]`)),
          10000
        );
        this.client.addItems(addresses);
        this.client.readAllItems((error, values) => {
          clearTimeout(timeoutId);
          resolve({
            datapoints: values,
            error: error
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  private async readNckData(
    addresses: string[]
  ): Promise<NCDataPointWithStatus[]> {
    let results: NCDataPointWithStatus[] = [];
    for (const address of addresses) {
      let dp: NCDataPointWithStatus = {};
      try {
        dp.value = await this.nckClient.readVariableBTSS(address);
      } catch (error) {
        dp.error = error.toString();
      }
      results.push(dp);
    }
    return results;
  }
  /**
   * Checks for error in result of read request
   * @param  {boolean} s7error
   * @param  {any} value
   * @returns boolean
   */
  private checkError(s7error: boolean, value: any): boolean {
    if (typeof value === 'undefined') return true;
    if (!s7error) return false;
    const valueToCheck = value.toString();
    const STATIC_ERRORS = ['BAD 255'];
    const isError = STATIC_ERRORS.includes(valueToCheck);
    return isError;
  }

  /**
   * Reads all data points for current intervals and creates and publishes events
   * @param  {Array<number>} currentIntervals
   * @returns Promise
   */
  protected async dataSourceCycle(
    currentIntervals: Array<number>
  ): Promise<void> {
    if (this.isDisconnected) return;
    if (this.cycleActive) {
      winston.warn('S7: Skipping read cycle');
      return;
    }
    this.cycleActive = true;
    const currentCycleDataPoints: Array<IDataPointConfig> =
      this.config.dataPoints.filter((dp: IDataPointConfig) => {
        const rf = Math.max(dp.readFrequency, 1000);
        return currentIntervals.includes(rf);
      });

    try {
      const plcAddressesToRead = [];
      for (const dp of currentCycleDataPoints) {
        if (dp.type === 's7') plcAddressesToRead.push(dp.address);
      }

      const nckDataPointsToRead = [];
      for (const dp of currentCycleDataPoints) {
        if (dp.type === 'nck') nckDataPointsToRead.push(dp.address);
      }

      winston.debug(`Reading PLC data points: ${plcAddressesToRead}`);
      const [plcResults, nckResults] = await Promise.all([
        this.readPlcData(plcAddressesToRead),
        this.readNckData(nckDataPointsToRead)
      ]);

      let allDpError = currentCycleDataPoints.length > 0;

      const measurements: IMeasurement[] = [];
      for (const dp of currentCycleDataPoints) {
        let value,
          error = null;
        if (dp.type === 's7') {
          value = plcResults.datapoints[dp.address];
          error = this.checkError(plcResults.error, value);
        } else if (dp.type === 'nck') {
          const index = nckDataPointsToRead.indexOf(dp.address);
          const result = nckResults[index];
          value = result.value;
          error = result.error;
        }

        const measurement: IMeasurement = {
          id: dp.id,
          name: dp.name,
          value
        };

        if (!error) {
          allDpError = false;
          measurements.push(measurement);
          this.onDataPointLifecycle({
            id: dp.id,
            level: EventLevels.DataPoint,
            type: DataPointLifecycleEventTypes.ReadSuccess
          });
        } else {
          winston.error(`Failed to read datapoint ${dp.id} - Error: ${error}`);
          this.onDataPointLifecycle({
            id: dp.id,
            level: EventLevels.DataPoint,
            type: DataPointLifecycleEventTypes.ReadError
          });
        }
      }

      if (allDpError) {
        winston.warn(
          `Failed to read all datapoints for datasource. Disconnecting datasource.`
        );
        this.disconnect();
      }

      this.onDataPointMeasurement(measurements);
    } catch (e) {
      winston.error(`S7DataSource Error: ${e.message} / ${JSON.stringify(e)}`);
    }
    this.cycleActive = false;
  }

  /**
   * Handles connection result from connecting to device
   * @param  {} err
   */
  private connectPLC(connection): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.initiateConnection(
        {
          host: connection.ipAddr,
          port: connection.port,
          slot: connection.slot,
          rack: connection.rack,
          timeout: 2000
        },
        (error) => {
          if (error) reject(error);
          else resolve();
        }
      );
    });
  }

  /**
   * Disconnects from data source
   * @returns Promise
   */
  public async disconnect(): Promise<void> {
    const logPrefix = `${S7DataSource.className}::disconnect`;
    winston.debug(`${logPrefix} triggered.`);

    const { name, protocol } = this.config;
    this.isDisconnected = true;
    this.submitLifecycleEvent({
      id: protocol,
      level: this.level,
      type: DataSourceLifecycleEventTypes.Disconnected,
      status: LifecycleEventStatus.Disconnected,
      dataSource: { name, protocol }
    });
    this.currentStatus = LifecycleEventStatus.Disconnected;
    clearTimeout(this.reconnectTimeoutId);
    this.client.dropConnection();
    await this.nckClient.disconnect();
  }
}
