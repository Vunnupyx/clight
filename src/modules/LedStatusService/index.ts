import { PathLike } from 'fs';
import { promises as fs } from 'fs';
import { writeFile } from 'fs/promises';
import winston from 'winston';
import { LifecycleEventStatus } from '../../common/interfaces';
import { ConfigManager } from '../ConfigManager';
import { DataSource } from '../Southbound/DataSources/DataSource';
import { DataSourcesManager } from '../Southbound/DataSources/DataSourcesManager';
import { DataSourceEventTypes } from '../Southbound/DataSources/interfaces';

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
  #configuredAndConnected = false;
  #sysfsPrefix = '';

  constructor(
    private configManager: ConfigManager,
    private datasourceManager: DataSourcesManager
  ) {
    this.configManager.once('configsLoaded', () => {
      this.checkConfigTemplateTerms();
    });
    this.configManager.on('configChange', () => {
      this.checkConfigTemplateTerms();
    });
    this.datasourceManager.getDataSources().forEach((source) => {
      source.on(DataSourceEventTypes.Lifecycle, (status) => {
        if(this.#configuredAndConnected) return;
        switch (status) {
          case LifecycleEventStatus.Connected: {
            if (this.#configured) {
              this.stopBlinking(1);
              this.unsetLed([this.getLedPathByNumberAndColor(1, 'red'), this.getLedPathByNumberAndColor(1, 'green')]);
              this.setLed([this.getLedPathByNumberAndColor(1, 'green')]);
            }
            this.#configuredAndConnected = true;
            return;
          }
          case LifecycleEventStatus.Disconnected: {
            this.stopBlinking(1)
            this.unsetLed([this.getLedPathByNumberAndColor(1, 'red'), this.getLedPathByNumberAndColor(1, 'green')]);
            this.setLed([this.getLedPathByNumberAndColor(1, 'red'), this.getLedPathByNumberAndColor(1, 'green')]);
            this.#configuredAndConnected = false;
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
    await this.setSysfsPrefix();
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
    const logPrefix = `LedStatusService::blink`;
    let paths;
    switch (color) {
      case 'green': {
        paths = [this.getLedPathByNumberAndColor(ledNumber, color)];
        break;
      }
      case 'red': {
        paths = [this.getLedPathByNumberAndColor(ledNumber, color)];
        break;
      }
      case 'orange': {
        paths = [
          this.getLedPathByNumberAndColor(ledNumber, 'green'),
          this.getLedPathByNumberAndColor(ledNumber, 'red')
        ];
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
        this.#led1Blink = setTimeout(() => {
          this.setLed(paths);
          unset();
        }, OffDurationMs);
      };

      const unset = () => {
        this.#led1Blink = setTimeout(() => {
          this.unsetLed(paths);
          set();
        }, OnDurationMs);
      };
      unset();
    } else {
      const set = () => {
        this.#led2Blink = setTimeout(() => {
          this.setLed(paths);
          unset();
        }, OffDurationMs);
      };

      const unset = () => {
        this.#led2Blink = setTimeout(() => {
          this.unsetLed(paths);
          set();
        }, OnDurationMs);
      };
    }
    this.setLed(paths);
  }

  /**
   * Stop blinking of selected LED.
   */
  private stopBlinking(ledNumber: 1 | 2) {
    const paths = [
      this.getLedPathByNumberAndColor(ledNumber, 'red'),
      this.getLedPathByNumberAndColor(ledNumber, 'green')
    ];
    switch (ledNumber) {
      case 1: {
        if (this.#led1Blink) {
          clearTimeout(this.#led1Blink);
          this.unsetLed(paths);
        }
        this.#led1Blink = null;
        break;
      }
      case 2: {
        if (this.#led1Blink) {
          clearTimeout(this.#led2Blink);
          this.unsetLed(paths);
        }
        this.#led2Blink = null;
        break;
      }
      default: {
        const errMsg = ``; // TODO:
        winston.error(errMsg);
        throw new Error(errMsg);
      }
    }
  }

  /**
   * Generate path of the led brightness file.
   */
  private getLedPathByNumberAndColor(
    ledNumber: 1 | 2,
    color: 'red' | 'green'
  ): PathLike {
    return `${this.#sysfsPrefix}/sys/class/leds/user-led${ledNumber.toString(
      10
    )}-${color}/brightness`;
  }

  /**
   * Activate LED selected by paths.
   */
  private setLed(paths: PathLike[]): Promise<void> {
    return Promise.all([
      writeFile(paths[0], LED.ON),
      paths.length === 2 ? writeFile(paths[1], LED.ON) : Promise.resolve()
    ]).then();
  }

  /**
   * Disable LED selected by paths.
   */
  private unsetLed(paths: PathLike[]): Promise<void> {
    return Promise.all([
      writeFile(paths[0], LED.OFF),
      paths.length === 2 ? writeFile(paths[1], LED.OFF) : Promise.resolve()
    ]).then();
  }

  /**
   * Check if:
   * - Configuration is valid
   * - Template is selected
   * - Terms and Conditions are accepted
   */
  private checkConfigTemplateTerms(): void {
    const terms = this.configManager.config.termsAndConditions;

    // Fast way out of check
    if (!terms) {
      this.noConfigBlink(true);
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
              // disable blinking
              this.noConfigBlink(false);
              // led orange
              this.setLed([
                this.getLedPathByNumberAndColor(1, 'red'),
                this.getLedPathByNumberAndColor(1, 'green')
              ]);

              this.#configured = true;
              return;
            }
          }
        }
      }
    }
    this.noConfigBlink(true);
    this.#configured = false;
  }

  /**
   * Shutdown Service
   */
  public shutdown(): void {
    const logPrefix = `LedStatusService::shutdown`;
    winston.info(`${logPrefix} running.`);
    clearTimeout(this.#led1Blink);
    clearTimeout(this.#led2Blink);
    clearTimeout(this.#configWatcher);
    const paths1 = [
      this.getLedPathByNumberAndColor(1, 'red'),
      this.getLedPathByNumberAndColor(1, 'green')
    ];
    const paths2 = [
      this.getLedPathByNumberAndColor(2, 'red'),
      this.getLedPathByNumberAndColor(2, 'green')
    ];
    this.unsetLed(paths1);
    this.unsetLed(paths2);
    winston.info(`${logPrefix} successfully.`);
  }

  /**
   * Enable or disable green USER LED 1.
   * Represent the status of southbound connection.
   */
  public southboundStatus(status: boolean): void {
    const logPrefix = `LedStatusService::southboundStatus`;

    if (this.#led1Blink) {
      this.stopBlinking(1);
    }
    const path = this.getLedPathByNumberAndColor(1, 'green');
    status ? this.setLed([path]) : this.unsetLed([path]);
    winston.info(
      `${logPrefix} set USER LED 1 to ${
        status ? 'ON' : 'OFF'
      } (Southbound status: ${
        status ? 'CONFIGURATED AND CONNECTED' : 'CONFIGURATED BUT NOT CONNECTED'
      })`
    );
  }

  /**
   * Enable or disable orange blinking USER LED 1.
   * Represented one of this state:
   *  - No Configuration
   *  - No Template
   *  - Not accepted AGB
   */
  public noConfigBlink(status: boolean): void {
    const logPrefix = `LedStatusService::noConfigBlink`;

    if (status) {
      if (this.#led1Blink) return;
      this.blink(1, 500, 500, 'orange');
    } else {
      if (!this.#led1Blink) return;
      this.stopBlinking(1);
    }

    winston.info(
      `${logPrefix} set USER LED 1 to ${
        status ? 'BLINKING' : 'OFF'
      } (Config status: ${status ? 'CONFIGURATED' : 'NOT CONFIGURATED'})`
    );
  }

  /**
   * Set LED for display of runtime status.
   */
  public runTimeStatus(status: boolean): void {
    const logPrefix = `LedStatusService::runTimeStatus`;

    const path = this.getLedPathByNumberAndColor(2, 'green');
    status ? this.setLed([path]) : this.unsetLed([path]);

    winston.info(
      `${logPrefix} set USER LED 2 to ${
        status ? 'ON' : 'OFF'
      } (Runtime status: ${status ? 'RUNNING' : 'NOT RUNNING'})`
    );
  }

  private async setSysfsPrefix() {
    try {
      const board = await fs.readFile('/sys/firmware/devicetree/base/model');
      if (board.indexOf('SIMATIC IOT2050') >= 0) {
        this.#sysfsPrefix = '';
        return;
      }
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }

    this.#sysfsPrefix = 'src/modules/LedStatusService';
  }
}
