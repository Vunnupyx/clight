import {
  writeFileSync,
  readdirSync,
  readFileSync,
  existsSync
} from 'fs';
import { exec, execSync } from 'child_process';
import { exit } from 'process';

enum LED {
  ON = '1',
  OFF = '0'
}

type TLedColors = 'red' | 'green' | 'orange';

/**
 * Class is a button watcher.
 * If button is clicked triggers flashing from USB port to internal eMMC drive.
 */
class MDCLFlasher {
  #ledPathRed = '/sys/class/leds/user-led0-red/brightness';
  #ledPathGreen = '/sys/class/leds/user-led0-green/brightness';
  #gpioExportPath = '/sys/class/gpio/export';
  #gpioChipPath =
    '/sys/devices/platform/interconnect@100000/interconnect@100000:interconnect@28380000/interconnect@100000:interconnect@28380000:interconnect@42040000/42110000.wkup_gpio0/gpio';
  #userButtonWatcher = null;
  #userButtonPath;
  #lastButtonCount: number = 0;
  readonly #watchDurationMs = 3000;
  readonly #pollingIntervalMs = 250;
  readonly #durationPollRatio = this.#watchDurationMs/this.#pollingIntervalMs;
  blinkTimers = [];

  constructor() {
    this.setupGPIOPaths();
    this.clearAll();

    process.on('SIGINT', () => {
      this.clearAll();
      exit(1);
    });

    this.initUserButtonWatcher();
    this.blink(500, 'green');
  }

  /**
   * Read the base id of the gpio chip. User button id is base id +25.
   * Export the button value file if necessary. 
   */
  private setupGPIOPaths (): void {
    const filesAndFolders = readdirSync(this.#gpioChipPath);
    if (filesAndFolders.length > 1)
      throw Error(`Can not detect gpio chip number`);
    const chipNumber = filesAndFolders.join().match(/\d+/g)?.join();

    const buttonID = parseInt(chipNumber) + 25 ;

    this.#userButtonPath = `/sys/class/gpio/gpio${buttonID}/value`;

    if (!existsSync(this.#userButtonPath)) {
      //export button
      execSync(`echo ${buttonID} > ${this.#gpioExportPath}`);
    }
  }

  /**
   * Initialize file watching for user button file.
   * Implements logic for button trigger and handle.
   */
  private initUserButtonWatcher(): void {
    this.#userButtonWatcher = setInterval(() => {
      const value = readFileSync(this.#userButtonPath)
        .toString('utf8')
        .trim();
      if (value === '0') {
        this.#lastButtonCount++;
        if (this.#lastButtonCount >= this.#durationPollRatio) {
          this.stopBlink();
          clearInterval(this.#userButtonWatcher);
          this.transferData();
        }
        return;
      }
      this.#lastButtonCount = 0;
    }, this.#pollingIntervalMs);
  }

  /**
   * Start blinking of the user led.
   */
  private blink(
    interval: number,
    color: TLedColors = 'green'
  ) {
    let paths: Array<string> = this.getLedPaths(color);

    const unset = () => {
      this.blinkTimer[1] = setTimeout(() => {
        paths.forEach((path) => {
          writeFileSync(path, LED.OFF);
        });
        set();
      }, interval / 2);
    };
    const set = () => {
      this.blinkTimer[0] = setTimeout(() => {
        paths.forEach((path) => {
          writeFileSync(path, LED.ON);
        });
        unset();
      }, interval / 2);
    };
    set();
  }

  /**
   * Stop blinking of user led.
   */
  private stopBlink() {
    this.blinkTimer.forEach(timer => clearTimeout(timer));
    this.clearAll();
  }

  /**
   * Set all colors of user led off.
   */
  private clearAll() {
    this.getLedPaths('orange').forEach((path) => {
      writeFileSync(path, LED.OFF);
    });
  }

  /**
   * Led is growing without any interrupt.
   */
  private glow(duration: number, color: TLedColors) {
    const paths = this.getLedPaths(color);
    paths.forEach((path) => {
      writeFileSync(path, LED.ON);
    });
    setTimeout(() => {
      paths.forEach((path) => {
        writeFileSync(path, LED.OFF);
      });
    }, duration);
  }

  /**
   * Get all files to be changed to mix a led color.
   */
  private getLedPaths(color: TLedColors) {
    switch (color) {
      case 'green': {
        return [this.#ledPathGreen];
      }
      case 'red': {
        return [this.#ledPathRed];
      }
      case 'orange': {
        return [this.#ledPathRed, this.#ledPathGreen];
      }
    }
  }

  /**
   * Transfer data from USB to eMMC via child process.
   * Restart device after success or exit with status code 1 on any error.
   */
  private transferData() {
    const target = '/dev/mmcblk1p1';
    const source = '/dev/sda1';
    const command = `dd if=${source} of=${target} bs=4M`;
    this.blink(1000, 'orange');
    exec(command, (err, _stdout, stderr) => {
      this.stopBlink();
      if (err) {
        console.error(err);
        console.error(stderr);
        this.blink(500, 'red');
        setTimeout(() => {
          exit(1);
        }, 10000);
      }
      this.glow(10000, 'green');
      setTimeout(() => {
        execSync('sudo /sbin/shutdown -r now');
      }, 10000);
    });
  }
}

/**
 * Start service
 */
const t = new MDCLFlasher();
