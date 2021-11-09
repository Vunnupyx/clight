import NodeS7 from 'nodes7';
import winston from 'winston';
import { DataSource } from '../DataSource';
import {
  DataSourceLifecycleEventTypes,
  LifecycleEventStatus
} from '../../../../common/interfaces';
import { IDataPointConfig } from '../../../ConfigManager/interfaces';
import { IMeasurement } from '../interfaces';
import { Iot2050MraaDI10 } from '../../../Iot2050MraaDI10/Iot2050mraa';

/**
 * Implementation of io shield data source
 */
export class IoshieldDataSource extends DataSource {
  mraaClient: Iot2050MraaDI10;

  /**
   * Initializes ioshield data source, sets up driver and validates configuration
   * @returns void
   */
  public init(): void {
    const { name, protocol } = this.config;
    this.submitLifecycleEvent({
      id: protocol,
      level: this.level,
      type: DataSourceLifecycleEventTypes.Connected,
      status: LifecycleEventStatus.Connected,
      dataSource: { protocol, name }
    });

    this.mraaClient = new Iot2050MraaDI10();
    this.mraaClient.init();

    this.validateDataPointConfiguration();
    this.setupDataPoints();
    this.currentStatus = LifecycleEventStatus.Connected;
  }

  /**
   * Reads all datapoints for current cycle and creates resulting events
   * @param  {Array<number>} currentIntervals
   * @returns Promise
   */
  protected async dataSourceCycle(
    currentIntervals: Array<number>
  ): Promise<void> {
    const currentCycleDataPoints: Array<IDataPointConfig> =
      this.config.dataPoints.filter((dp: IDataPointConfig) => {
        const rf = Math.max(dp.readFrequency, 1000);
        return currentIntervals.includes(rf);
      });

    try {
      const digitalInputValues = await this.mraaClient.getDigitalValues();
      const analogInputValues = await this.mraaClient.getAnalogValues();
      const measurements: IMeasurement[] = [];
      for (const dp of currentCycleDataPoints) {
        const value =
          digitalInputValues[dp.address] || analogInputValues[dp.address];

        if (typeof value === 'undefined') continue;

        const measurement: IMeasurement = {
          id: dp.id,
          name: dp.name,
          value
        };

        measurements.push(measurement);
      }
      if (measurements.length > 0) this.onDataPointMeasurement(measurements);
    } catch (e) {
      // TODO: Markus welcher status ist hier? Die Messungen sind fehlgeschlagen? Disconnected? Reconnection?
      winston.error('Failed to read ioshield data');
      winston.error(JSON.stringify(e));
      winston.error(e);
    }
  }

  /**
   * Disconnects data source
   * @returns Promise<void>
   */
  public async disconnect(): Promise<void> {
    this.currentStatus = LifecycleEventStatus.Disconnected;
  }

  /**
   * Validates data source configuration and throws errors for wrong configured data points
   */
  private validateDataPointConfiguration() {
    this.config.dataPoints.forEach((dp) => {
      if (!/\b(DI|AI)[0-9]\b/.test(dp.address))
        throw new Error(`Invalid data point address: ${dp.address}`);
    });
  }
}
