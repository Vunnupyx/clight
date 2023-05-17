import winston from 'winston';
import { LifecycleEventStatus } from '../../common/interfaces';
import { ConfigManager } from '../ConfigManager';
import { DataSourcesManager } from '../Southbound/DataSources/DataSourcesManager';
import { DataSourceEventTypes } from '../Southbound/DataSources/interfaces';
import { ConfigurationAgentManager } from '../ConfigurationAgentManager';

enum LED {
  ON = '1',
  OFF = '0'
}

type TLedColors = 'red' | 'green' | 'orange';

/**
 * Set LEDs or blink to display status of the runtime for user.
 */
export class LedStatusService {
  #led1Blink: NodeJS.Timer = null;
  #led2Blink: NodeJS.Timer = null;
  #configWatcher: NodeJS.Timer = null;
  #configured = false;
  #southboundConnected = false;
  #configCheckRunning = false;
  #sysfsPrefix = process.env.SYS_PREFIX || '';
  #ledIds: { [key: string]: string } = { '1': 'user1', '2': 'user2' }; // Received LED Ids are currently "user1" and "user2", default added to avoid undefined at beginning

  constructor(
    private configManager: ConfigManager,
    private datasourceManager: DataSourcesManager
  ) {
    this.configManager.once('configsLoaded', async () => {
      this.registerDataSourceEvents();
      await this.checkConfigTemplateTerms();
      await this.getLedIds();
    });
    this.configManager.on('configChange', async () => {
      await this.checkConfigTemplateTerms();
    });
  }

  private registerDataSourceEvents(): void {
    const logPrefix = `${LedStatusService.name}::registerDataSourceEvents`;
    const sources = this.datasourceManager.getDataSources();
    if (!sources || sources.length < 1) {
      winston.error(`${logPrefix} no datasources available`);
    }
    winston.debug(`${logPrefix} register on sources.`);
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
              await this.clearLed(1);
              await this.setLed(1, 'green');
            }
            this.#southboundConnected = true;
            winston.debug(
              `${logPrefix} successfully configured and connected to NC. Set USER 1 LED to green light.`
            );
            return;
          }
          case LifecycleEventStatus.Disconnected: {
            await this.clearLed(1);
            // Orange light
            await this.setLed(1, 'orange');
            this.#southboundConnected = false;
            winston.debug(
              `${logPrefix} successfully configured and but not connected to NC. Set USER 1 LED to orange light.`
            );
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
   * Start blinking of selected led.
   */
  private blink(
    ledNumber: 1 | 2,
    OnDurationMs: number,
    OffDurationMs: number,
    color: TLedColors
  ): void {
    const logPrefix = `${LedStatusService.name}::blink`;
    switch (color) {
      case 'green': {
        break;
      }
      case 'red': {
        break;
      }
      case 'orange': {
        break;
      }
      default: {
        const errMSg = `${logPrefix} error setting blink due to wrong color.`;
        winston.error(errMSg);
        throw new Error(errMSg);
      }
    }

    if (ledNumber === 1) {
      const set = () => {
        this.#led1Blink = setTimeout(async () => {
          await this.setLed(ledNumber, color);
          unset();
        }, OffDurationMs);
      };

      const unset = () => {
        this.#led1Blink = setTimeout(async () => {
          await this.unsetLed(ledNumber);
          set();
        }, OnDurationMs);
      };
      unset();
    } else {
      const set = () => {
        this.#led2Blink = setTimeout(async () => {
          await this.setLed(ledNumber, color);
          unset();
        }, OffDurationMs);
      };

      const unset = () => {
        this.#led2Blink = setTimeout(async () => {
          await this.unsetLed(ledNumber);
          set();
        }, OnDurationMs);
      };
      unset();
    }
  }

  /**
   * Stop blinking of selected LED.
   */
  private async clearLed(ledNumber: 1 | 2) {
    const logPrefix = `${LedStatusService.name}::clearLed`;

    switch (ledNumber) {
      case 1: {
        if (this.#led1Blink) {
          clearTimeout(this.#led1Blink);
          winston.debug(`${logPrefix} USER ${ledNumber} disable blinking.`);
        }
        this.#led1Blink = null;
        break;
      }
      case 2: {
        if (this.#led2Blink) {
          clearTimeout(this.#led2Blink);
          winston.debug(`${logPrefix} USER ${ledNumber} disable blinking.`);
        }
        this.#led2Blink = null;
        break;
      }
      default: {
        const errMsg = `${logPrefix} error due to invalid LED number ${ledNumber}`;
        winston.error(errMsg);
        throw new Error(errMsg);
      }
    }
    await this.unsetLed(ledNumber);
    winston.debug(`${logPrefix} successfully cleared USER ${ledNumber} LED.`);
  }

  /**
   * Set LED status, color and frequency.
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
   * Disable LED.
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
                `${logPrefix} correct configuration found. Set USER 1 LED to orange`
              );
              // disable blinking
              await this.clearLed(1);
              // led orange
              await this.setLed(1, 'orange');
              if (this.#southboundConnected) {
                winston.debug(
                  `${logPrefix} catch connected event during check. Set USER 1 LED to green. `
                );
                await this.clearLed(1);
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
   * Shutdown Service
   */
  public async shutdown(): Promise<void> {
    const logPrefix = `${LedStatusService.name}::shutdown`;
    winston.info(`${logPrefix} running.`);
    clearTimeout(this.#led1Blink);
    clearTimeout(this.#led2Blink);
    clearTimeout(this.#configWatcher);

    await this.unsetLed(1);
    await this.unsetLed(2);
    winston.info(`${logPrefix} successfully.`);
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
    if (this.#led1Blink) return;
    this.blink(1, 500, 500, 'orange');

    winston.info(
      `${logPrefix} set USER LED 1 to 'orange blinking' because not not completely configured.`
    );
  }

  /**
   * Set/unset LED2 for display of runtime status.
   */
  public runTimeStatus(status: boolean): void {
    const logPrefix = `${LedStatusService.name}::runTimeStatus`;

    this.clearLed(2).then(async () => {
      if (status) {
        await this.setLed(2, 'green');
        winston.info(
          `${logPrefix} set USER LED 2 to ${
            status ? 'green' : 'OFF'
          } (Runtime status: ${status ? 'RUNNING' : 'NOT RUNNING'})`
        );
      }
    });
  }

  /**
   * Turns off both led's of the device
   */
  public async turnOffLeds() {
    await this.clearLed(1);
    await this.clearLed(2);
  }
}
