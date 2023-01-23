import winston from 'winston';
import { DataSource } from '../DataSource';
import { LifecycleEventStatus } from '../../../../common/interfaces';
import { IDataSourceParams, IMeasurement } from '../interfaces';
import { TariffNumbers } from './interfaces';
import { PhoenixEmProAdapter } from './Adapter/PhoenixEmProAdapter';
import { VirtualDataPointManager } from '../../../VirtualDataPointManager';

/**
 * Implementation of Energy data source
 */
export class EnergyDataSource extends DataSource {
  protected name = EnergyDataSource.name;
  private phoenixEemClient: PhoenixEmProAdapter;
  private virtualDataPointManager: VirtualDataPointManager;

  constructor(
    params: IDataSourceParams,
    virtualDataPointManager: VirtualDataPointManager
  ) {
    super(params);
    this.virtualDataPointManager = virtualDataPointManager;
  }

  /**
   * Initializes Energy data source
   * @returns void
   */
  public init(): void {
    const logPrefix = `${this.name}::init`;
    winston.info(`${logPrefix} initializing.`);

    const { enabled, connection } = this.config;

    if (!enabled) {
      winston.info(
        `${logPrefix} Energy data source is disabled. Skipping initialization.`
      );
      this.updateCurrentStatus(LifecycleEventStatus.Disabled);
      return;
    }

    if (!this.termsAndConditionsAccepted) {
      winston.warn(
        `${logPrefix} skipped start of Energy data source due to not accepted terms and conditions`
      );
      this.updateCurrentStatus(
        LifecycleEventStatus.TermsAndConditionsNotAccepted
      );
      return;
    }

    this.phoenixEemClient = new PhoenixEmProAdapter(connection);
    this.virtualDataPointManager.setEnergyCallback(
      this.handleMachineStatusChange.bind(this)
    );

    this.setupDataPoints();
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

    try {
      const readings = await this.phoenixEemClient.getAllDatapoints();

      const measurements: IMeasurement[] = [];
      for (const reading of readings) {
        if (typeof reading.value === 'undefined') continue;

        measurements.push(reading);
      }
      if (measurements.length > 0) {
        this.onDataPointMeasurement(measurements);
      }
    } catch (e) {
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
   * Returns the current tariff number of the EMpro
   * @return {string}
   */
  public getCurrentTariffNumber(): string {
    return this.phoenixEemClient.currentTariff;
  }

  /**
   * Changes the current tariff number of the EMpro after new status of the machine and
   * returns the new tariff number. Error case is just logged and not returned as it is
   * not processed in VDP side
   * @param newStatus
   */
  public async handleMachineStatusChange(newStatus): Promise<TariffNumbers> {
    const logPrefix = `${this.name}::handleMachineStatusChange`;

    const tariffStatusMapping = {
      running: '1',
      idle: '2',
      waiting: '3',
      alarm: '4'
    };
    let newTariffNo: TariffNumbers = tariffStatusMapping[newStatus];

    if (!newTariffNo) {
      winston.info(
        `${logPrefix} Unknown machine status: ${newStatus} - Setting tariff number to 0`
      );
      newTariffNo = '0';
    }

    try {
      const changeResult = await this.phoenixEemClient.changeTariff(
        newTariffNo
      );
      if (changeResult) {
        winston.debug(`${logPrefix} EEM Tariff changed to: ${newTariffNo}`);
        return newTariffNo;
      }
    } catch (e) {
      winston.warn(
        `${logPrefix} Error occurred while changing tariff: ${e?.message}`
      );
    }
  }
}
