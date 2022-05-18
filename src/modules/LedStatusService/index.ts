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
  #southboundConnected = false;
  #configCheckRunning = false;
  #sysfsPrefix = '';
  private locked = false;

  constructor(
    private configManager: ConfigManager,
    private datasourceManager: DataSourcesManager
  ) {
    this.configManager.once('configsLoaded', async () => {
      this.registerDataSourceEvents();
      await this.checkConfigTemplateTerms();
    });
    this.configManager.on('configChange', async () => {
      await this.checkConfigTemplateTerms();
    });
  }

  private registerDataSourceEvents(): void {
    const logPrefix = `LedStatusService::registerDataSourceEvents`;
    const sources = this.datasourceManager.getDataSources();
    if (!sources || sources.length < 1)
      {winston.error(`${logPrefix} no datasources available`);}
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
              await this.setLed([this.getLedPathByNumberAndColor(1, 'green')]);
            }
            this.#southboundConnected = true;
            winston.debug(`${logPrefix} successfully configured and connected to NC. Set USER 1 LED to green light.`);
            return;
          }
          case LifecycleEventStatus.Disconnected: {
            await this.clearLed(1);
            // Orange light
            await this.setLed([
              this.getLedPathByNumberAndColor(1, 'red'),
              this.getLedPathByNumberAndColor(1, 'green')
            ]);
            this.#southboundConnected = false;
            winston.debug(`${logPrefix} successfully configured and but not connected to NC. Set USER 1 LED to orange light.`);
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
    if (ledNumber === 2 && this.locked) {
      winston.warn(`${logPrefix} can not set LED 2 to blink mode because LED is locked by invalid license.`);
      return;
    }
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
      unset();
    }
  }

  /**
   * Stop blinking of selected LED.
   */
  private async clearLed(ledNumber: 1 | 2) {
    const logPrefix = `LedStatusService::clearLed`;
    if(this.locked && ledNumber === 2) {
      winston.warn(`${logPrefix} can not clear LED 2 because LED is locked by invalid license.`);
      return;
    }
    const paths = [
      this.getLedPathByNumberAndColor(ledNumber, 'red'),
      this.getLedPathByNumberAndColor(ledNumber, 'green')
    ];
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
    await this.unsetLed(paths);
    winston.debug(`${logPrefix} successfully cleared USER ${ledNumber} LED.`)
  }

  /**
   * Generate path of the led brightness file.
   */
  private getLedPathByNumberAndColor(
    ledNumber: 1 | 2,
    color: 'red' | 'green'
  ): PathLike | null {
    if(this.locked && ledNumber === 2) {
      winston.warn(`LedStatusService::getLedPathByNumberAndColor can not generate LED2 path because LED is locked by invalid license.`);
      return null;
    }
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
  private async checkConfigTemplateTerms(): Promise<void> {
    this.#configCheckRunning = true;
    const terms = this.configManager.config.termsAndConditions;
    const logPrefix = `LedStatusService::checkConfigTemplateTerms`;

    winston.debug(`${logPrefix} start checking.`)

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
              winston.debug(`${logPrefix} correct configuration found. Set USER 1 LED to orange`);
              // disable blinking
              await this.clearLed(1);
              // led orange
              await this.setLed([
                this.getLedPathByNumberAndColor(1, 'red'),
                this.getLedPathByNumberAndColor(1, 'green')
              ]);
              if (this.#southboundConnected) {
                winston.debug(`${logPrefix} catch connected event during check. Set USER 1 LED to green. `)
                await this.clearLed(1);
                await this.setLed([this.getLedPathByNumberAndColor(1, 'green')]);
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
   * Enable or disable orange blinking USER LED 1.
   * Represented one of this state:
   *  - No Configuration
   *  - No Template
   *  - Not accepted AGB
   */
  private noConfigBlink(): void {
    const logPrefix = `LedStatusService::noConfigBlink`;
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
    const logPrefix = `LedStatusService::runTimeStatus`;

    if(this.locked) {
      winston.warn(`${logPrefix} can not ${status ? 'set' : 'unset '} runtime status because LED is locked by invalid license.`);
      return;
    }

    const path = this.getLedPathByNumberAndColor(2, 'green');
    this.clearLed(2).then(() => {
      if(status) {
        this.setLed([path]);
        winston.info(
          `${logPrefix} set USER LED 2 to ${
            status ? 'green' : 'OFF'
          } (Runtime status: ${status ? 'RUNNING' : 'NOT RUNNING'})`
        );
      }
    })
  }

  /**
   * Set LED 2 blinking red.
   */
  public setLicenseInvalid(): void {
    const logPrefix = `LedStatusService::setLicenseInvalid`;
    if(this.locked) {
      winston.warn(`${logPrefix} already set.`);
      return;
    }
    winston.info(`${logPrefix} start.`);
    this.clearLed(2).then(() => {
      this.blink(2, 500, 500, 'red');
      this.locked = true;
      winston.info(`${logPrefix} succeeded.`);
    })
    
  }

  /**
   * Sets directory prefix to mocked sys folder for dev environments.
   * Setup mock with "yarn setup_mock_sysfs"
   * @returns
   */
  private async setSysfsPrefix() {
    if (process.env.MOCK_LEDS) {
      this.#sysfsPrefix = process.env.MOCK_LEDS;
      return; 
    }
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
