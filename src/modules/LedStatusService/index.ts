import winston from 'winston';
import { LifecycleEventStatus } from '../../common/interfaces';
import { ConfigManager } from '../ConfigManager';
import { DataSourcesManager } from '../Southbound/DataSources/DataSourcesManager';
import { DataSourceEventTypes } from '../Southbound/DataSources/interfaces';
import { ConfigurationAgentManager } from '../ConfigurationAgentManager';

type TLedColors = 'red' | 'green' | 'orange';

/**
 * Set LEDs or blink to display status of the runtime for user.
 */
export class LedStatusService {
  #configured = false;
  #southboundConnected = false;
  #configCheckRunning = false;
  #ledIds: { [key: string]: string } = { '1': 'user1', '2': 'user2' }; // Received LED Ids are "user1" and "user2", already assigned to avoid undefined at beginning

  constructor(
    private configManager: ConfigManager,
    private datasourceManager: DataSourcesManager
  ) {
    this.configManager.once('configsLoaded', async () => {
      this.registerDataSourceEvents();
      await this.checkConfigTemplateTerms();
      await this.getLedIds();
    });
    this.datasourceManager.on('dataSourcesRestarted', async () => {
      // Re-register data source event listeners as they were deleted and recreated during restart
      this.registerDataSourceEvents();
      await this.checkConfigTemplateTerms();
    });
    this.configManager.on('configChange', async () => {
      await this.checkConfigTemplateTerms();
    });
  }

  private registerDataSourceEvents(): void {
    const logPrefix = `${LedStatusService.name}::registerDataSourceEvents`;

    const sources = this.datasourceManager.getDataSources();
    if (!sources || sources.length < 1) {
      winston.error(`${logPrefix} no data sources available`);
    }
    winston.debug(`${logPrefix} registering listeners on data sources.`);

    sources.forEach((source) => {
      source.on(DataSourceEventTypes.Lifecycle, async (status) => {
        switch (status) {
          case LifecycleEventStatus.Connected: {
            if (this.#configCheckRunning) {
              this.#southboundConnected = true;
              return;
            }
            if (this.#southboundConnected) return;
            if (this.#configured) {
              winston.debug(
                `${logPrefix} successfully configured and connected to at least one data source. Set USER 1 LED to green light.`
              );
              await this.setLed(1, 'green');
            } else {
              winston.debug(
                `${logPrefix} successfully connected to at least one data source but not configured yet.`
              );
            }
            this.#southboundConnected = true;

            return;
          }
          case LifecycleEventStatus.Disconnected: {
            winston.debug(
              `${logPrefix} successfully configured and but not connected to at least one data source. Set USER 1 LED to orange light.`
            );
            this.#southboundConnected = false;
            await this.setLed(1, 'orange');

            return;
          }
          default: {
            // Ignore all other events!
            return;
          }
        }
      });
    });
  }

  public async init(): Promise<LedStatusService> {
    return this;
  }

  /**
   * Turn on the given LED with color and frequency. Frequency default is 0 (=non blink)
   */
  private async setLed(
    ledNumber: number | string,
    color: TLedColors,
    frequency?: number
  ): Promise<void> {
    await ConfigurationAgentManager.setLedStatus(
      this.#ledIds[ledNumber],
      'on',
      color,
      frequency
    );
  }

  /**
   * Turn off the given LED.
   */
  private async unsetLed(ledNumber: number | string): Promise<void> {
    await ConfigurationAgentManager.setLedStatus(
      this.#ledIds[ledNumber],
      'off'
    );
  }

  /**
   * Reads IDs of LEDs from configuration agent
   */
  private async getLedIds() {
    let list = await ConfigurationAgentManager.getLedList();
    list?.forEach((id, index) => {
      let letNumber = `${index + 1}`;
      this.#ledIds[letNumber] = id;
    });
  }

  /**
   * Check if:
   * - Configuration is valid
   * - Template is selected
   * - Terms and Conditions are accepted
   */
  private async checkConfigTemplateTerms(): Promise<void> {
    this.#configCheckRunning = true;
    const terms = this.configManager.config.termsAndConditions;
    const logPrefix = `${LedStatusService.name}::checkConfigTemplateTerms`;

    winston.debug(`${logPrefix} start checking.`);

    // Fast way out of check
    if (!terms) {
      winston.debug(`${logPrefix} terms and conditions not accepted.`);
      this.noConfigBlink();
      return;
    }

    /*
     * WARNING: Very bad bad performance! In worst case O(n * m * o * p * q)
     * n = count of mappings
     * m = count of sources
     * o = count of datapoints in sources
     * p = count of sinks
     * q = count of datapoints in sinks
     */
    loop1: for (const mapping of this.configManager.config.mapping) {
      const sourceDatapoint = mapping.source;
      const sinkDatapoint = mapping.target;

      loop2: for (const source of this.configManager.config.dataSources) {
        if (!source.enabled) continue;
        if (source.dataPoints.some((point) => point.id === sourceDatapoint)) {
          loop3: for (const sink of this.configManager.config.dataSinks) {
            if (!sink.enabled) continue;
            if (sink.dataPoints.some((point) => point.id === sinkDatapoint)) {
              winston.debug(
                `${logPrefix} correct configuration found. Set USER 1 LED to orange.`
              );
              await this.setLed(1, 'orange');
              if (this.#southboundConnected) {
                winston.debug(
                  `${logPrefix} catch connected event during check. Set USER 1 LED to green.`
                );
                await this.setLed(1, 'green');
              }
              this.#configured = true;
              this.#configCheckRunning = false;
              return;
            }
          }
        }
      }
    }
    this.noConfigBlink();
    this.#configured = false;
    this.#configCheckRunning = false;
  }

  /**
   * Enable or disable orange blinking USER LED 1.
   * Represented one of this state:
   *  - No Configuration
   *  - No Template
   *  - Not accepted AGB
   */
  private noConfigBlink(): void {
    const logPrefix = `${LedStatusService.name}::noConfigBlink`;
    winston.info(
      `${logPrefix} set USER LED 1 to 'orange blinking' because not not completely configured.`
    );

    // Blink LED 1 with 1 Hertz = 0.5s on, 0.5s off
    this.setLed(1, 'orange', 1);
  }

  /**
   * Set/unset LED2 for display of runtime status.
   */
  public async runTimeStatus(status: boolean): Promise<void> {
    const logPrefix = `${LedStatusService.name}::runTimeStatus`;
    winston.info(
      `${logPrefix} set USER LED 2 to ${
        status ? 'green' : 'OFF'
      } (Runtime status: ${status ? 'RUNNING' : 'NOT RUNNING'})`
    );

    if (status) {
      await this.setLed(2, 'green');
    } else {
      await this.unsetLed(2);
    }
  }

  /**
   * Turns off both led's of the device
   */
  public async turnOffLeds() {
    await Promise.all([this.unsetLed(1), this.unsetLed(2)]);
  }

  /**
   * Shutdown LED Service
   */
  public async shutdown(): Promise<void> {
    const logPrefix = `${LedStatusService.name}::shutdown`;
    winston.info(`${logPrefix} starting.`);

    await this.turnOffLeds();
    winston.info(`${logPrefix} successfully.`);
  }
}
