import {
  writeFileSync,
  access,
  readdir,
  constants
} from 'fs';
import { exec, execSync, ChildProcess, spawn } from 'child_process';
import { exit } from 'process';
import EventEmitter from 'events';

enum LED {
  ON = '1',
  OFF = '0'
}

type TLedColors = 'red' | 'green' | 'orange';

/**
 * Class is a button watcher.
 * If button is clicked triggers flashing from USB port to internal eMMC drive.
 */
class MDCLFlasher extends EventEmitter {
  #ledPathRed = '/sys/class/leds/user-led<NUMBER>-red/brightness';
  #ledPathGreen = '/sys/class/leds/user-led<NUMBER>-green/brightness';
  #blinkTimers = {
    1: [],
    2: []
  };
  #buttonWatcher: IoT2050HardwareEvents;

  constructor() {
    super();
    this.#buttonWatcher = new IoT2050HardwareEvents();
    this.#buttonWatcher.watchUserButtonLongPress(this);
    this.#buttonWatcher.registerCB(this.startFlash.bind(this));
    this.clearAll();

    this.blink(500, 'green', 1);
    this.blink(500, 'green', 2);
  }

  private async startFlash(): Promise<void> {
    this.stopBlink(1);
    return this.transferData()
      .catch((err) => {
        console.log(err?.msg || 'Error during installation.');
        this.glow(0, 'red', 1);
        this.emit('error');
      })
      .then(() => {
        this.glow(0, 'green');
        return this.fixGPT();
      })
      .catch((err) => {
        console.log(`Error during GPT fix due to ${JSON.stringify(err)}`);
        this.glow(0, 'red');
        this.emit('err');
      });
  }

  /**
   * Start blinking of the user led.
   */
  public blink(
    interval: number,
    color: TLedColors = 'green',
    number: 1 | 2 = 1
  ) {
    let paths: Array<string> = this.getLedPaths(color, number);

    const unset = () => {
      this.#blinkTimers[number][1] = setTimeout(() => {
        paths.forEach((path) => {
          writeFileSync(path, LED.OFF);
        });
        set();
      }, interval / 2);
    };
    const set = () => {
      this.#blinkTimers[number][0] = setTimeout(() => {
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
  public stopBlink(number: 1 | 2 = 2) {
    this.#blinkTimers[number].forEach((timer) => clearTimeout(timer));
    this.clearAll();
  }

  /**
   * Set all colors of user led off.
   */
  private clearAll() {
    [
      ...this.getLedPaths('orange', 1),
      ...this.getLedPaths('orange', 2)
    ].forEach((path) => {
      writeFileSync(path, LED.OFF);
    });
  }

  /**
   * Led is growing without any interrupt.
   * If duration = 0 LED is on permanently.
   */
  public glow(duration: number, color: TLedColors, number: 1 | 2 = 1) {
    const paths = this.getLedPaths(color, number);
    paths.forEach((path) => {
      writeFileSync(path, LED.ON);
    });
    if (duration > 0) {
      setTimeout(() => {
        paths.forEach((path) => {
          writeFileSync(path, LED.OFF);
        });
      }, duration);
    }
  }

  /**
   * Get all files to be changed to mix a led color.
   */
  private getLedPaths(color: TLedColors, number: 1 | 2 = 1) {
    switch (color) {
      case 'green': {
        return [this.#ledPathGreen.replace('<NUMBER>', number.toString())];
      }
      case 'red': {
        return [this.#ledPathRed.replace('<NUMBER>', number.toString())];
      }
      case 'orange': {
        return [
          this.#ledPathRed.replace('<NUMBER>', number.toString()),
          this.#ledPathGreen.replace('<NUMBER>', number.toString())
        ];
      }
    }
  }

  /**
   * Transfer data from USB to eMMC via child process.
   * Restart device after success or exit with status code 1 on any error.
   */
  private async transferData(): Promise<void> {
    return new Promise(async (res, rej) => {
      this.blink(1000, 'orange');
      readdir('/root', async (err, files) => {
        if (err) {
          console.log(`Error during reading files of /root`);
          return rej();
        }
        const filename = files.find((str) =>
          /iot-connector[a-zA-Z-.\d]*\.img\.gz/.test(str)
        );
        if (!filename) {
          console.log(`No mdc lite image found. Abort!`);
          return rej();
        }
        const imagePath = `/root/${filename}`;
        let target;

        try {
          await new Promise<void>((res, rej) => {
            access(imagePath, constants.F_OK, (err) => {
              if (err) {
                console.log(`No mdc lite image found. Abort!`);
                return rej();
              }
              return res();
            });
          });

          target = execSync(
            'ls /dev/mmcblk*boot0 2>/dev/null | sed "s/boot0//"'
          )
            .toString('ascii')
            .trim();
        } catch (err) {
          console.log(err.msg || `Error due to detect target device. Abort`);
          return rej();
        }
        if (!target || target.length === 0) {
          console.log(`Error due to detect target device. Abort`);
          return rej();
        }

        const command = `gunzip -c ${imagePath} | dd of=${target} bs=4M`;

        try {
          if (!(await this.checkMD5(filename, '/root'))) {
            this.clearAll();
            this.glow(0, 'red', 1);
            this.glow(0, 'red', 2);
            return rej();
          }
        } catch (err) {
          this.clearAll();
          this.glow(0, 'red', 1);
          this.glow(0, 'red', 2);
          return rej();
        }

        const startDate = new Date();
        console.log('Transferring data to /dev/mmcblk*boot1');
        exec(command, (err, stdout, stderr) => {
          const finishDate = new Date();
          this.stopBlink();
          if (err) {
            console.log(`Failed to transfer data`);
            console.log(`ERROR: ${JSON.stringify(err)}`);
            console.log(`STDERR: ${stderr}`);
            this.blink(500, 'red');
            return rej();
          }
          console.log(
            `Data successfully transferred to internal MCC. Finished after: ${
              (finishDate.getTime() - startDate.getTime()) / 1000
            }s`
          );
          console.log(stdout);
          this.glow(0, 'green');
          return res();
        });
      });
    });
  }

  private fixGPT(): Promise<void> {
    console.log(`Starting fixing of GPT.`);
    const cmd = `sgdisk /dev/mmcblk1 -e`;
    return new Promise<void>((res, rej) => {
      exec(cmd, (err, _stdout, stderr) => {
        if (err || stderr !== '') {
          console.log(`Error fixing Boot sector`);
          console.log(stderr);
          console.log(err);
          return rej();
        }
        console.log(`GPT boot sector fixed.`);
        return res();
      });
    });
  }

  private async checkMD5(filename: string, path: string): Promise<boolean> {
    const cmd = `md5sum ${path}/${filename}`;
    let checksum: string = '';
    return new Promise((res, rej) => {
      console.log(`Validating checksum of ${filename}.`);
      try {
        checksum = this.extractChecksumFromString(
          readFileSync(`${path}/${filename}.md5`).toString('utf-8')
        );
      } catch (err) {
        console.log(`No checksum file found for ${filename}. Abort.`);
        return rej();
      }
      exec(cmd, (err, stdout, stderr) => {
        if (err || stderr.length !== 0) {
          console.log(
            `Calculation of md5 checksum for file ${filename} failed due to ${
              err ? JSON.stringify(err) : stderr
            }`
          );
          return rej(false);
        }
        const calcedChecksum = this.extractChecksumFromString(stdout);
        const result = calcedChecksum === checksum;
        if(result) {
          console.log(`Checksum for ${filename} valid.`)
        } else {
          console.log(`Checksum for ${filename} invalid.`);
        }
        return res(result);
      });
      
    });
  }

  private extractChecksumFromString(str: string): string {
    return str.trim().split(' ')[0];
  }

  private fixGPT(): Promise<void> {
    const cmd = `sgdisk /dev/mmcblk1 -e`;
    return new Promise<void>((res, rej) => {
      exec(cmd, (err, _stdout, stderr) => {
        if (err || stderr !== '') {
          console.log(`Error fixing Boot sector`);
          rej();
        }
        console.log(`Boot sector fixed.`);
        res();
      });
      res();
    });
  }
}

// class FWFlasher {
//   #flashCommand = `iot2050-firmware-update /root/IOT2050*`;
//   #checkCommand = `fw_printenv fw_version`;
//   #installedVersion: string;
//   #newVersion: string;

//   constructor(private mdclFlasher: MDCLFlasher) {}

  public async flash() {
    console.log(`Starting firmware flashing.`);
    const shutdown = () => {
      setTimeout(() => {
        console.log(`Rebooting`);
        execSync('sudo /sbin/shutdown now');
      }, 10_000);
    };
    this.mdclFlasher.stopBlink(2);
    if (!(await this.checkFWVersion())) {
      console.log(
        `Installed firmware version is higher or equal to installable firmware version`
      );
      this.mdclFlasher.glow(0, 'green', 2);
      //shutdown();
      exit(0);
    }
    const cmd = 'stdbuf';
    const options = [
      '-oL',
      'gpiomon',
      'gpiochip3',
      '25'
    ];
    try {
      this.#child = spawn(cmd, options);
      this.#child.stdout.on('data', this.dataHandler.bind(this));
      this.#child.stderr.on('error', this.errorHandler.bind(this));
      console.log(`${logPrefix} connection to button successfully.`);
    } catch (err) {
      console.log(`${logPrefix} error during connecting to button.`);
    }
  }

  public registerCB(cb: Function): void {
    this.#callback = cb;
  }

  /**
   * Handles received data
   */
  private async dataHandler(stdout: GpioReturn) {
    const logPrefix = `${this.constructor.name}::dataHandler`;

    console.log(
      `${logPrefix} receive button event. Start checking if it meet the callback conditions.`
    );
    if (!this.#fistEventTS) {
      this.#fistEventTS = Date.now();
      return;
    }
    if ((Date.now() - this.#fistEventTS) > this.#buttonPressedTriggerTimeMs) {
      console.log(
        `${logPrefix} conditions fulfilled. Execute all callbacks.`
      );
        try {
          await this.#callback();
          this.#child.kill('SIGINT');
        } catch (e) {
          console.log(
            `${logPrefix} error during calling installer.`
          );
        }
    }
    this.#fistEventTS = null;
  }

  /**
   * Restart child process if crashes because of error
   */
  private async errorHandler(stderr) {
    const logPrefix = `${this.constructor.name}::errorHandler`;
    console.log(
      `${logPrefix} received error from process due to ${JSON.stringify(
        stderr
      )}`
    );
    if (this.#child.exitCode) {
      await this.watchUserButtonLongPress(this.#flasher);
    }
  }
}


/**
 * Start service
 */
const t = new MDCLFlasher();
