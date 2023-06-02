import NodeS7 from 'nodes7';
import winston from 'winston';
import { DataSource } from '../DataSource';
import { LifecycleEventStatus } from '../../../../common/interfaces';
import {
  IDataPointConfig,
  IS7DataSourceConnection
} from '../../../ConfigManager/interfaces';
import { IMeasurement } from '../interfaces';
import SinumerikNCK from './SinumerikNCK/NCDriver';

interface S7DataPointsWithError {
  datapoints: NodeS7.ReadValues;
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

  private client: NodeS7 | null = null;
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
            (connection as IS7DataSourceConnection).ipAddr,
            undefined,
            undefined,
            this.nckSlot
          )
        ]);
        clearTimeout(this.reconnectTimeoutId);
      } else if (nckDataPointsConfigured && !plcDataPointsConfigured) {
        winston.debug(`${logPrefix} Connecting to NCK only`);
        await this.nckClient.connect(
          (connection as IS7DataSourceConnection).ipAddr,
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
        try {
          // if (!this.isDisconnected) {
          //   return;
          // }
          this.updateCurrentStatus(LifecycleEventStatus.Reconnecting);
          this.init();
        } catch (error) {
          winston.error(`${logPrefix} error in reconnecting: ${error}`);
        }
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
  private readPlcData(): Promise<S7DataPointsWithError> {
    return new Promise((resolve, reject) => {
      if (this.getPlcAddresses().length === 0)
        resolve({ datapoints: {}, error: false });
      try {
        if (!this.client) {
          throw new Error('client not defined');
        }
        const timeoutId = setTimeout(
          () =>
            reject(
              new Error(
                `PLC read data timeout for addresses: [${this.getPlcAddresses()}]`
              )
            ),
          10000
        );
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
        dp.error = (error as Error).toString();
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
  private checkS7Error(s7error: boolean, value: any): boolean {
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

  private getPlcAddresses(): string[] {
    return this.config.dataPoints
      .filter((dp) => dp.type === 's7')
      .map((dp) => dp.address);
  }

  private getNckAddresses(): string[] {
    return this.config.dataPoints
      .filter((dp) => dp.type === 'nck')
      .map((dp) => dp.address);
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

      //? Always read all data points
      // const currentCycleDataPoints: Array<IDataPointConfig> =
      //   this.config.dataPoints.filter((dp: IDataPointConfig) => {
      //     const rf = Math.max(dp.readFrequency || 1000, 1000);
      //     return currentIntervals.includes(rf);
      //   });

      //? Don't read NC data points in case there is no nc configured
      const nckDataPointsToRead = this.nckEnabled
        ? this.getNckAddresses()
        : ([] as string[]);

      // winston.debug(
      //   `Reading S7 data points, PLC: ${plcAddressesToRead}, NCK: ${nckDataPointsToRead}`
      // );

      const [plcResults, nckResults] = await Promise.all([
        this.readPlcData(),
        this.readNckData(nckDataPointsToRead)
      ]);

      let allNCKDpError = nckDataPointsToRead?.length > 0;
      let allS7DpError = this.getPlcAddresses()?.length > 0;

      const measurements: IMeasurement[] = [];
      for (const dp of this.config.dataPoints) {
        // Skip is current data point wasn't read
        if (
          !this.config.dataPoints
            .map((dp) => dp.address)
            .some((address) => address === dp.address)
        )
          continue;

        // Prevent to add nck data point with an undefined value in case we have no nck connection
        if (dp.type === 'nck' && !this.nckEnabled) continue;

        let value: any = undefined;
        let error: string | undefined = undefined;

        if (dp.type === 's7') {
          value = plcResults.datapoints[dp.address];
          error = this.checkS7Error(plcResults.error, value)
            ? 's7error'
            : undefined;

          if (!error) allS7DpError = false;
        } else if (dp.type === 'nck') {
          const index = nckDataPointsToRead.indexOf(dp.address);
          const result = nckResults[index];
          value = result.value;
          error = result.error;

          if (!error) allNCKDpError = false;
        }

        const measurement: IMeasurement = {
          id: dp.id,
          name: dp.name,
          value
        };

        if (!error) {
          measurements.push(measurement);
        } else {
          // winston.error(
          //   `Failed to read datapoint ${dp.name} - Error: ${error}`
          // );
          this.handleReadDpError(error);
        }
      }

      if (allNCKDpError || allS7DpError) {
        if (allNCKDpError)
          winston.warn(
            `Failed to read all nck datapoints. Disconnecting datasource.`
          );
        if (allS7DpError)
          winston.warn(
            `Failed to read all s7 datapoints. Disconnecting datasource.`
          );

        await this.disconnect();
        this.init();
      }

      if (measurements.length > 0) this.onDataPointMeasurement(measurements);
    } catch (e) {
      winston.error(
        `S7DataSource Error: ${(e as Error).message} / ${JSON.stringify(e)}`
      );
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
          ipAddr: (this.config.connection as IS7DataSourceConnection).ipAddr
        };
        break;
      case 's7-300/400':
        connection = {
          ...defaultS7300Connection,
          ipAddr: (this.config.connection as IS7DataSourceConnection).ipAddr
        };
        break;
      case 'nck':
        connection = {
          ...defaultNckSlConnection,
          ipAddr: (this.config.connection as IS7DataSourceConnection).ipAddr
        };
        break;
      case 'nck-pl':
        connection = {
          ...defaultNckPlConnection,
          ipAddr: (this.config.connection as IS7DataSourceConnection).ipAddr
        };
        break;
      case 'custom':
      default:
        connection = this.config.connection as IS7DataSourceConnection;
    }

    return new Promise((resolve, reject) => {
      this.client = new NodeS7({
        silent: true
      });
      this.client.addItems(this.getPlcAddresses());
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
            winston.error(`PLC connection error ${error.message ?? error}`); //The error response on ISO failing is only a string from NodeS7 library
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

    this.isDisconnected = true;
    this.updateCurrentStatus(LifecycleEventStatus.Disconnected);

    clearTimeout(this.reconnectTimeoutId);
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        winston.warn(`${logPrefix} closing s7 connection timed out after 5s`);
        resolve();
      }, 5000);
      if (this.client) {
        this.client.dropConnection(() => {
          winston.info(`${logPrefix} successfully closed s7 connection`);
          clearTimeout(timeout);
          resolve();
        });
      } else {
        winston.info(`${logPrefix} s7 not connected. Skipping disconnect.`);
        clearTimeout(timeout);
        resolve();
      }
    });

    this.client = null;

    winston.info(`${logPrefix} shutdown nck client`);
    try {
      await this.nckClient.disconnect();
    } catch (error) {
      winston.error(`${logPrefix} error in disconnecting nck client: ${error}`);
    }
    this.updateCurrentStatus(LifecycleEventStatus.Disconnected);
  }
}
