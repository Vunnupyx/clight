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
  protected static className = IoshieldDataSource.name;

  mraaClient: Iot2050MraaDI10;

  /**
   * Initializes ioshield data source, sets up driver and validates configuration
   * @returns void
   */
  public init(): void {
    const logPrefix = `${IoshieldDataSource.className}::init`;
    winston.info(`${logPrefix} initializing.`);

    const { name, protocol, enabled } = this.config;

    if (!enabled) {
      winston.info(
        `${logPrefix} io shield data source is disabled. Skipping initialization.`
      );
      this.currentStatus = LifecycleEventStatus.Disabled;
      return;
    }

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
    const logPrefix = `${IoshieldDataSource.className}::dataSourceCycle`;
    const currentCycleDataPoints: Array<IDataPointConfig> =
      this.config.dataPoints.filter((dp: IDataPointConfig) => {
        const rf = Math.max(dp.readFrequency || 1000, 1000);
        return currentIntervals.includes(rf);
      });

    try {
      winston.debug(`${logPrefix} reading io shield values`);
      const digitalInputValues = await this.mraaClient.getDigitalValues();
      const analogInputValues = await this.mraaClient.getAnalogValues();

      const formattedAnalogInputValues: {
        [label: string]: number;
      } = {};
      Object.keys(analogInputValues).forEach((key) => {
        switch (this.config.type) {
          case 'ai-150+5di':
            formattedAnalogInputValues[key] = analogInputValues[key] * 1.5; // Converting to 150A output
            break;
          case 'ai-100+5di':
          case '10di':
          default:
            formattedAnalogInputValues[key] = analogInputValues[key];
            break;
        }
      });

      const measurements: IMeasurement[] = [];
      for (const dp of currentCycleDataPoints) {
        const value =
          digitalInputValues[dp.address] ||
          formattedAnalogInputValues[dp.address] ||
          0;

        if (typeof value === 'undefined') continue;

        const measurement: IMeasurement = {
          id: dp.id,
          name: dp.name,
          value
        };

        measurements.push(measurement);
      }
      if (measurements.length > 0) {
        this.onDataPointMeasurement(measurements);
      }
    } catch (e) {
      // TODO: Define status here. Disconnected?
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
    const logPrefix = `${IoshieldDataSource.className}::disconnect`;
    winston.debug(`${logPrefix} triggered.`);

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
