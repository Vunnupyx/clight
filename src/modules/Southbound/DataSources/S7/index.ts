import NodeS7 from 'nodes7';
import winston from 'winston';
import { DataSource } from '../DataSource';
import {
  DataSourceLifecycleEventTypes,
  LifecycleEventStatus,
  DataPointLifecycleEventTypes,
  EventLevels
} from '../../../../common/interfaces';
import {
  IDataPointConfig,
  IS7DataSourceConnection
} from '../../../ConfigManager/interfaces';
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

const defaultS7300Connection: IS7DataSourceConnection = {
  ipAddr: '',
  port: 102,
  rack: 0,
  slot: 2
};

const defaultS71500Connection: IS7DataSourceConnection = {
  ipAddr: '',
  port: 102,
  rack: 0,
  slot: 1
};

const defaultNckSlConnection: IS7DataSourceConnection = {
  ipAddr: '',
  port: 102,
  rack: 0,
  slot: 2 // That's only the plc (300) slot. For the nck, the slot 4 is set inside that driver
};

const defaultNckPlConnection: IS7DataSourceConnection = {
  ipAddr: '',
  port: 102,
  rack: 0,
  slot: 2 // That's only the plc (300) slot. For the nck, the slot 3 is set inside that driver
};

const NCK_SL_SLOT = 4;
const NCK_PL_SLOT = 3;

/**
 * Implementation of s7 data source
 * @returns void
 */
export class S7DataSource extends DataSource {
  protected name = S7DataSource.name;
  private isDisconnected = false;
  private cycleActive = false;

  private nckEnabled = false;

  private client = new NodeS7({
    silent: true
  });
  private nckClient = new SinumerikNCK();

  get nckSlot() {
    switch (this.config.type) {
      case 'nck-pl':
        return NCK_PL_SLOT;
      case 'nck':
      default:
        return NCK_SL_SLOT;
    }
  }

  /**
   * Initializes s7 data source and connects to device
   * @returns void
   */
  public async init(): Promise<void> {
    const logPrefix = `${S7DataSource.name}::init`;
    winston.info(`${logPrefix} initializing.`);

    const { connection, enabled } = this.config;

    if (!this.isLicensed) {
      winston.warn(`${logPrefix} no valid license found. Stop initializing.`);
      this.updateCurrentStatus(LifecycleEventStatus.NoLicense);
      return;
    }

    if (!enabled) {
      winston.info(
        `${logPrefix} S7 data source is disabled. Skipping initialization.`
      );
      this.updateCurrentStatus(LifecycleEventStatus.Disabled);
      return;
    }

    if (!this.termsAndConditionsAccepted) {
      winston.warn(
        `${logPrefix} skipped start of S7 data source due to not accepted terms and conditions`
      );
      this.updateCurrentStatus(
        LifecycleEventStatus.TermsAndConditionsNotAccepted
      );
      return;
    }
    this.updateCurrentStatus(LifecycleEventStatus.Connecting);

    this.nckEnabled =
      this.config.type === 'nck' || this.config.type === 'nck-pl';
    winston.info(`NC enabled: ${this.nckEnabled}`);

    const nckDataPointsConfigured =
      this.nckEnabled &&
      this.config.dataPoints.find((dp: IDataPointConfig) => {
        return dp.type === 'nck';
      });

    const plcDataPointsConfigured = this.config.dataPoints.find(
      (dp: IDataPointConfig) => {
        return dp.type === 's7';
      }
    );

    try {
      if (nckDataPointsConfigured && plcDataPointsConfigured) {
        winston.debug(`${logPrefix} Connecting to NCK & PLC`);
        await Promise.all([
          this.connectPLC(),
          this.nckClient.connect(
            connection.ipAddr,
            undefined,
            undefined,
            this.nckSlot
          )
        ]);
        clearTimeout(this.reconnectTimeoutId);
      } else if (nckDataPointsConfigured && !plcDataPointsConfigured) {
        winston.debug(`${logPrefix} Connecting to NCK only`);
        await this.nckClient.connect(
          connection.ipAddr,
          undefined,
          undefined,
          this.nckSlot
        );
        clearTimeout(this.reconnectTimeoutId);
      } else if (plcDataPointsConfigured && !nckDataPointsConfigured) {
        winston.debug(`${logPrefix} Connecting to PLC only`);
        await this.connectPLC();
        clearTimeout(this.reconnectTimeoutId);
      }
    } catch (error) {
      winston.error(`${logPrefix} ${JSON.stringify(error)}`);
      this.updateCurrentStatus(LifecycleEventStatus.ConnectionError);
      this.reconnectTimeoutId = setTimeout(() => {
        // if (!this.isDisconnected) {
        //   return;
        // }
        this.updateCurrentStatus(LifecycleEventStatus.Reconnecting);
        this.init();
      }, this.RECONNECT_TIMEOUT);
      return;
    }
    this.updateCurrentStatus(LifecycleEventStatus.Connected);
    this.isDisconnected = false;
    this.setupDataPoints();
    this.setupLogCycle();
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
   * Override setupDataPoints to set fixed intervals for s7 data source
   */
  protected setupDataPoints(defaultFrequency: number = 1000): void {
    if (this.readSchedulerListenerId) return;

    const logPrefix = `${this.name}::setupDataPoints`;
    winston.debug(`${logPrefix} setup data points`);

    let interval = 1000;
    switch (this.config.type) {
      case 'nck-pl':
        interval = 5000;
        break;
      case 's7-300/400':
      case 's7-1200/1500':
      case 'nck':
      case 'custom':
      default:
        interval = 1000;
        break;
    }

    this.readSchedulerListenerId = this.scheduler.addListener(
      [interval],
      this.dataSourceCycle.bind(this)
    );
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

    this.readCycleCount = this.readCycleCount + 1;

    try {
      this.cycleActive = true;

      // const currentCycleDataPoints: Array<IDataPointConfig> =
      //   this.config.dataPoints.filter((dp: IDataPointConfig) => {
      //     const rf = Math.max(dp.readFrequency || 1000, 1000);
      //     return currentIntervals.includes(rf);
      //   });

      // Always read all data points
      const currentCycleDataPoints: Array<IDataPointConfig> =
        this.config.dataPoints;

      const plcAddressesToRead = [];
      for (const dp of currentCycleDataPoints) {
        if (dp.type === 's7') plcAddressesToRead.push(dp.address);
      }

      let nckDataPointsToRead = [];
      for (const dp of currentCycleDataPoints) {
        if (dp.type === 'nck') nckDataPointsToRead.push(dp.address);
      }

      // Don't read NC data points in case there is no nc configured
      nckDataPointsToRead = this.nckEnabled ? nckDataPointsToRead : [];

      // winston.debug(
      //   `Reading S7 data points, PLC: ${plcAddressesToRead}, NCK: ${nckDataPointsToRead}`
      // );
      const [plcResults, nckResults] = await Promise.all([
        this.readPlcData(plcAddressesToRead),
        this.readNckData(nckDataPointsToRead)
      ]);

      let allDpError =
        [...nckDataPointsToRead, ...plcAddressesToRead].length > 0;

      const measurements: IMeasurement[] = [];
      for (const dp of currentCycleDataPoints) {
        // Skip is current data point wasn't read
        if (
          ![...nckDataPointsToRead, ...plcAddressesToRead].some(
            (address) => address === dp.address
          )
        )
          continue;

        let value,
          error = null;
        if (dp.type === 's7') {
          value = plcResults.datapoints[dp.address];
          error = this.checkError(plcResults.error, value);
        } else if (dp.type === 'nck' && this.nckEnabled) {
          const index = nckDataPointsToRead.indexOf(dp.address);
          const result = nckResults[index];
          value = result.value;
          error = result.error;
        } else if (dp.type === 'nck' && this.nckEnabled) {
          error = true;
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
          // winston.error(
          //   `Failed to read datapoint ${dp.name} - Error: ${error}`
          // );
          this.handleReadDpError(error);
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
        await this.disconnect();
        this.init();
      }

      if (measurements.length > 0) this.onDataPointMeasurement(measurements);
    } catch (e) {
      winston.error(`S7DataSource Error: ${e.message} / ${JSON.stringify(e)}`);
    }
    this.cycleActive = false;
  }

  /**
   * Handles connection result from connecting to device
   * @param  {} err
   */
  private connectPLC(): Promise<void> {
    let connection: IS7DataSourceConnection;

    switch (this.config.type) {
      case 's7-1200/1500':
        connection = {
          ...defaultS71500Connection,
          ipAddr: this.config.connection.ipAddr
        };
        break;
      case 's7-300/400':
        connection = {
          ...defaultS7300Connection,
          ipAddr: this.config.connection.ipAddr
        };
        break;
      case 'nck':
        connection = {
          ...defaultNckSlConnection,
          ipAddr: this.config.connection.ipAddr
        };
        break;
      case 'nck-pl':
        connection = {
          ...defaultNckPlConnection,
          ipAddr: this.config.connection.ipAddr
        };
        break;
      case 'custom':
      default:
        connection = this.config.connection;
    }

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
          if (error) {
            winston.error(`PLC connection error ${error.message}`);
            reject(error);
          } else {
            winston.debug(`PLC connected successfully`);
            resolve();
          }
        }
      );
    });
  }

  /**
   * Disconnects from data source
   * @returns Promise
   */
  public async disconnect(): Promise<void> {
    const logPrefix = `${this.name}::disconnect`;
    winston.debug(`${logPrefix} triggered.`);

    const { name, protocol } = this.config;
    this.isDisconnected = true;
    this.updateCurrentStatus(LifecycleEventStatus.Disconnected);

    clearTimeout(this.reconnectTimeoutId);
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        winston.warn(`${logPrefix} closing s7 connection timed out after 5s`);
        resolve();
      }, 5000);
      this.client.dropConnection(() => {
        winston.info(`${logPrefix} successfully closed s7 connection`);
        clearTimeout(timeout);
        resolve();
      });
    });

    winston.info(`${logPrefix} shutdown nck client`);
    await this.nckClient.disconnect();

    this.updateCurrentStatus(LifecycleEventStatus.Disconnected);
  }
}
