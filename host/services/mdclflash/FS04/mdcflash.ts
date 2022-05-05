import {
  writeFileSync,
  access,
  readdir,
  constants
} from 'fs';
import { exec, execSync, ChildProcess, spawn } from 'child_process';
import { exit, stderr } from 'process';
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
  }

  private async startFlash(): Promise<void> {
    this.stopBlink(1);
    return this.transferData()
      .catch((err) => {
        console.log(err?.msg || 'Error during installation.');
        this.glow(0, 'red', 1);
        this.emit('error');
        return Promise.reject();
      })
      .then(() => {
        this.stopBlink(1);
        this.glow(0, 'green');
        return this.fixGPT();
      })
      .then(() => {
        exit(0);
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
    console.log('Start transferring data to /dev/mmcblk*boot1');
    return new Promise(async (res, rej) => {
      this.blink(1000, 'orange');
      readdir('/root', async (err, files) => {
        if (err) rej();
        const filename = files.find((str) =>
          /iot-connector[a-zA-Z-.\d]*\.img\.gz/.test(str)
        );
        if (!filename) rej({ msg: `No mdc lite image found. Abort!` });
        const imagePath = `/root/${filename}`;
        let target;
        try {
          await new Promise<void>((resI, _rejI) => {
            access(imagePath, constants.F_OK, (err) => {
              if (err) rej({ msg: `No mdc lite image found. Abort!` });
              resI();
            });
          });
          target = execSync(
            'ls /dev/mmcblk*boot0 2>/dev/null | sed "s/boot0//"'
          )
            .toString('ascii')
            .trim();
        } catch (err) {
          console.log(err.msg || `Error due to detect target device. Abort`);
          this.emit('error');
        }
        if (!target || target.length === 0) {
          console.log(`Error due to detect target device. Abort`);
          this.emit('error');
        }

        const command = `gunzip -c ${imagePath} | dd of=${target} bs=4M`;

        const startDate = new Date();
        exec(command, (err, _stdout, stderr) => {
          const finishDate = new Date();
          this.stopBlink();
          if (err) {
            console.error(err || stderr);
            this.blink(500, 'red');
            rej();
          }
          console.log(
            `Data successfully transferred to internal MCC. Finished after: ${
              (finishDate.getTime() - startDate.getTime()) / 1000
            }s`
          );
          res();
        });
      });
    });
  }

  private fixGPT(): Promise<void> {
    const cmd = `sgdisk /dev/mmcblk1 -e`;
    console.log(`Starting fixGPT`);
    return new Promise<void>((res, rej) => {
      exec(cmd, (err, _stdout, stderr) => {
        if (err || stderr !== '') {
          console.log(`Error during boot sector fix. Installation Failed`);
          rej()
        }
        console.log(`Boot sector fixed.`);
        res();
      });
    });
  }
}

// class FWFlasher {
//   #flashCommand = `iot2050-firmware-update /root/IOT2050*`;
//   #checkCommand = `fw_printenv fw_version`;
//   #installedVersion: string;
//   #newVersion: string;

//   constructor(private mdclFlasher: MDCLFlasher) {}

//   public async flash() {
//     console.log(`Starting firmware flashing.`);
//     const shutdown = () => {
//       setTimeout(() => {
//         console.log(`Rebooting`);
//         execSync('sudo /sbin/shutdown now');
//       }, 10_000);
//     };
//     this.mdclFlasher.stopBlink(2);
//     if (!(await this.checkFWVersion())) {
//       console.log(
//         `Installed firmware version is higher or equal to installable firmware version`
//       );
//       this.mdclFlasher.glow(0, 'green', 2);
//       shutdown();
//       exit(0);
//     }
//     this.mdclFlasher.blink(1000, 'orange', 2);
//     console.log('Nach blink orange');
//     const proc = exec(this.#flashCommand, (err, _stdout, stderr) => {
//       console.log(
//         `Flash ausgeführt ${JSON.stringify(err)} ${JSON.stringify(
//           _stdout
//         )} ${JSON.stringify(stderr)}`
//       );
//       this.mdclFlasher.stopBlink(2);
//       if (err || stderr !== '') {
//         this.mdclFlasher.glow(0, 'red', 2);
//         console.log(`Update firmware failed due to ${err || stderr}`);
//         exit(1);
//       }

//       console.log(
//         `Firmware version successfully installed from ${
//           this.#installedVersion
//         } to ${this.#newVersion}. Reboot after 10 seconds.`
//       );

//       shutdown();
//     });
//     let count = 1;
//     proc.stdout.on('data', (data) => {
//       if (count > 0) {
//         count--;
//         proc.stdin.write('y');
//         proc.stdin.end();
//       }
//     });
//   }

//   private async checkFWVersion(): Promise<boolean> {
//     return new Promise((res, _rej) => {
//       readdir('/root', (err, files) => {
//         if (err) res(false);
//         const filename = files.find((str) =>
//           /IOT2050-[-a-zA-Z.0-9]*.tar.xz/.test(str)
//         );
//         const newVersion = filename
//           .match(/V[\d]{2}.[\d]{2}.[\d]{2}/)
//           .toString()
//           .replace('V', '')
//           .split('.');
//         exec(this.#checkCommand, (err, stdout, stderr) => {
//           if (err || stderr !== '') {
//             res(false);
//           }
//           const [_date, version, _unknown, _buildnumber] = stdout
//             .replace('fw_version=', '')
//             .split('-');
//           const installedVersion = version.split('.');
//           for (const [index, newV] of newVersion.entries()) {
//             if (newV > installedVersion[index]) {
//               res(true);
//             }
//           }
//           res(false);
//         });
//       });
//     });
//   }
// }

type GpioReturn = {
  type: 'Buffer';
  data: number[];
};

/**
 * Handel event on long press USERBUTTON.
 * Triggers given callbacks if button is pressed longer then #buttonPressedTriggerTimeMs
 */
export default class IoT2050HardwareEvents {
  #buttonPressedTriggerTimeMs = 3000;
  #fistEventTS: number = null;
  #child: ChildProcess = null;
  #callback: Function;
  #flasher;

  /**
   * Start watching button
   */
  public async watchUserButtonLongPress(flasher: MDCLFlasher): Promise<void> {
    const logPrefix = `${this.constructor.name}::watchUserButtonLongPress`;
    this.#flasher = flasher;
    flasher.on('error', () => {
      this.#child?.kill('SIGINT');
      exit(1);
    })
    if (this.#child) {
      console.log(`${logPrefix} UserButton already watched`);
      return;
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
