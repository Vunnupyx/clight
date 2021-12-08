import { PathLike } from 'fs';
import { writeFile } from 'fs/promises';
import winston from 'winston';

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
        paths = [this.getLedPathByNumberAndColor(ledNumber, 'green'),this.getLedPathByNumberAndColor(ledNumber, 'red')];
        break;
      }
      default: {
        const errMSg = `${logPrefix} error setting blink due to wrong color.`;
        winston.error(errMSg);
        throw new Error(errMSg);
      }
    }
    
    if(ledNumber === 1) {
        const set = () => {
            this.#led1Blink = setTimeout(() => {
                this.setLed(paths);
                unset();
            }, OffDurationMs);
        }

        const unset = () => {
            this.#led1Blink = setTimeout(() => {
                this.unsetLed(paths);
                set();
            }, OnDurationMs);
        }
        unset()
    } else {
        const set = () => {
            this.#led2Blink = setTimeout(() => {
                this.setLed(paths);
                unset();
            }, OffDurationMs);
        }

        const unset = () => {
            this.#led2Blink = setTimeout(() => {
                this.unsetLed(paths);
                set();
            }, OnDurationMs);
        }
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
    return `/sys/class/leds/user-led${ledNumber.toString(10)}-${color}/brightness`;
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
   * Enable or disable green USER LED 1.
   * Represent the status of southbound connection.
   */
  public southboundStatus(status: boolean): void {
    if (this.#led1Blink) {
      this.stopBlinking(1);
    }
    const path = this.getLedPathByNumberAndColor(1, 'green');
    status ? this.setLed([path]) : this.unsetLed([path]);
  }

  /**
   * Enable or disable orange blinking USER LED 1. 
   * Represented one of this state:
   *  - No Configuration
   *  - No Template
   *  - Not accepted AGB
   */
  public noConfigBlink(status: boolean): void {
    if (status) {
      if (this.#led1Blink) return;
      this.blink(1, 500, 500, 'orange');
    } else {
      if (!this.#led1Blink) return;
      this.stopBlinking(1);
    }
  }

  /**
   * Set LED for display of runtime status.
   */
  public runTimeStatus(status: boolean): void {
    const path = this.getLedPathByNumberAndColor(2, 'green');
    status ? this.setLed([path]) : this.unsetLed([path]);
  }
}
