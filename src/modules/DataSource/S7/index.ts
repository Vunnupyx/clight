import NodeS7 from "nodes7";
import winston from "winston";
import { DataSource } from "../DataSource";
import {
  DataSourceLifecycleEventTypes,
  LifecycleEventStatus,
  DataPointLifecycleEventTypes,
  EventLevels,
} from "../../../common/interfaces";
import { IDataPointConfig } from "../../ConfigManager/interfaces";
import { IMeasurement } from "../interfaces";

interface S7DataPointsWithError {
  datapoints: Array<any>;
  error: boolean;
}
export class S7DataSource extends DataSource {
  private isDisconnected = false;
  private cycleActive = false;
  private client = new NodeS7({
    silent: true,
  });

  public async init(): Promise<void> {
    const { name, protocol, id, connection } = this.config;
    this.submitLifecycleEvent({
      id,
      level: this.level,
      type: DataSourceLifecycleEventTypes.Connecting,
      status: LifecycleEventStatus.Connecting,
      dataSource: { protocol, name },
    });

    this.client.initiateConnection(
      {
        host: connection.ipAddr,
        port: connection.port,
        // connection_name: name,
        slot: connection.slot,
        rack: connection.rack,
        timeout: 2000,
      },
      (err) => {
        this.onConnect(err);
      }
    );
  }

  private readData(addresses): Promise<S7DataPointsWithError> {
    return new Promise((resolve, reject) => {
      try {
        this.client.addItems(addresses);
        this.client.readAllItems((error, values) => {
          resolve({
            datapoints: values,
            error: error,
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  private checkError(s7error: boolean, value: any): boolean {
    if (typeof value === "undefined") return true;
    if (!s7error) return false;
    const valueToCheck = value.toString();
    const STATIC_ERRORS = ["BAD 255"];
    const isError = STATIC_ERRORS.includes(valueToCheck);
    return isError;
  }

  protected async dataSourceCycle(
    currentIntervals: Array<number>
  ): Promise<void> {
    if (this.isDisconnected) return;
    if (this.cycleActive) {
      winston.warn("S7: Skipping read cycle");
      return;
    }
    this.cycleActive = true;
    const currentCycleDataPoints: Array<IDataPointConfig> =
      this.config.dataPoints.filter((dp: IDataPointConfig) => {
        const rf = Math.max(dp.readFrequency, 1000);
        return currentIntervals.includes(rf);
      });

    try {
      const addressesToRead = [];
      for (const dp of currentCycleDataPoints) {
        addressesToRead.push(dp.address);
      }

      winston.debug(`Reading ${addressesToRead}`);
      const results = await this.readData(addressesToRead);
      console.log(results);

      let allDpError = currentCycleDataPoints.length > 0;

      const measurements: IMeasurement[] = [];
      for (const dp of currentCycleDataPoints) {
        const value = results.datapoints[dp.address];

        const measurement: IMeasurement = {
          id: dp.id,
          name: dp.name,
          value,
        };

        const dpError = this.checkError(results.error, value);

        if (!dpError) {
          allDpError = false;
          measurements.push(measurement);
          this.onDataPointLifecycle({
            id: dp.id,
            level: EventLevels.DataPoint,
            type: DataPointLifecycleEventTypes.ReadSuccess,
          });
        } else {
          winston.warn(`Failed to read datapoint ${dp.id}`);
          this.onDataPointLifecycle({
            id: dp.id,
            level: EventLevels.DataPoint,
            type: DataPointLifecycleEventTypes.ReadError,
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
      winston.error(e);
    }
    this.cycleActive = false;
  }

  private onConnect(err) {
    const level = this.level;
    const { name, protocol, id } = this.config;
    if (err) {
      // We have an error.  Maybe the PLC is not reachable.
      this.submitLifecycleEvent({
        id,
        level: this.level,
        type: DataSourceLifecycleEventTypes.ConnectionError,
        status: LifecycleEventStatus.ConnectionError,
        dataSource: { name, protocol },
        payload: err,
      });
      this.reconnectTimeoutId = setTimeout(() => {
        if (this.isDisconnected) {
          return;
        }
        this.submitLifecycleEvent({
          id,
          level,
          type: DataSourceLifecycleEventTypes.Reconnecting,
          status: LifecycleEventStatus.Reconnecting,
          dataSource: { name, protocol },
        });
        this.init();
      }, this.RECONNECT_TIMEOUT);
      return;
    }

    this.submitLifecycleEvent({
      id,
      level,
      type: DataSourceLifecycleEventTypes.Connected,
      status: LifecycleEventStatus.Connected,
      dataSource: { name, protocol },
    });
    this.isDisconnected = false;
    this.setupDataPoints();
  }

  public async disconnect(): Promise<void> {
    const { name, protocol, id } = this.config;
    this.isDisconnected = true;
    this.submitLifecycleEvent({
      id,
      level: this.level,
      type: DataSourceLifecycleEventTypes.Disconnected,
      status: LifecycleEventStatus.Disconnected,
      dataSource: { name, protocol },
    });
    clearTimeout(this.reconnectTimeoutId);
    this.client.dropConnection();
  }
}
