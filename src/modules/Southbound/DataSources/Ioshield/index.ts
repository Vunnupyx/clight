import winston from 'winston';
import { DataSource } from '../DataSource';
import {
  DataSourceLifecycleEventTypes,
  LifecycleEventStatus
} from '../../../../common/interfaces';
import { IDataPointConfig } from '../../../ConfigManager/interfaces';
import { IMeasurement } from '../interfaces';
import {
  Iot2050MraaDI10,
  Iot2050MraaDI2AI5
} from '../../../Iot2050MraaDI10/Iot2050mraa';

/**
 * Implementation of io shield data source
 */
export class IoshieldDataSource extends DataSource {
  protected name = IoshieldDataSource.name;

  mraaClient: Iot2050MraaDI10 | Iot2050MraaDI2AI5 | null = null;

  /**
   * Initializes ioshield data source, sets up driver and validates configuration
   * @returns void
   */
  public init(): void {
    const logPrefix = `${this.name}::init`;
    winston.info(`${logPrefix} initializing.`);

    const { enabled } = this.config;

    if (!enabled) {
      winston.info(
        `${logPrefix} io shield data source is disabled. Skipping initialization.`
      );
      this.updateCurrentStatus(LifecycleEventStatus.Disabled);
      return;
    }

    if (!this.termsAndConditionsAccepted) {
      winston.warn(
        `${logPrefix} skipped start of ioshield data source due to not accepted terms and conditions`
      );
      this.updateCurrentStatus(
        LifecycleEventStatus.TermsAndConditionsNotAccepted
      );
      return;
    }

    switch (this.config.type) {
      case '10di':
        this.mraaClient = new Iot2050MraaDI10();
        break;
      case 'ai-100+5di':
      case 'ai-150+5di':
      default: // TODO Error handling if wrong type
        this.mraaClient = new Iot2050MraaDI2AI5();
        break;
    }

    this.mraaClient.init();

    this.validateDataPointConfiguration();
    this.setupDataPoints(500);
    this.updateCurrentStatus(LifecycleEventStatus.Connected);
    this.setupLogCycle();
  }

  /**
   * Reads all datapoints for current cycle and creates resulting events
   * @param  {Array<number>} currentIntervals
   * @returns Promise
   */
  protected async dataSourceCycle(
    currentIntervals: Array<number>
  ): Promise<void> {
    this.readCycleCount = this.readCycleCount + 1;

    const currentCycleDataPoints: Array<IDataPointConfig> =
      this.config.dataPoints.filter((dp: IDataPointConfig) => {
        const rf = Math.max(dp.readFrequency || 500, 500);
        return currentIntervals.includes(rf);
      });

    try {
      if (!this.mraaClient) throw new Error('mraa client is undefined');
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
    const logPrefix = `${this.name}::disconnect`;
    winston.debug(`${logPrefix} triggered.`);

    this.updateCurrentStatus(LifecycleEventStatus.Disconnected);
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
