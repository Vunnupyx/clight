import {
  writeFileSync,
  readdirSync,
  readFileSync,
  existsSync,
  access,
  readdir,
  constants
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
  #ledPathRed = '/sys/class/leds/user-led<NUMBER>-red/brightness';
  #ledPathGreen = '/sys/class/leds/user-led<NUMBER>-green/brightness';
  #gpioExportPath = '/sys/class/gpio/export';
  #gpioChipPath =
    '/sys/devices/platform/interconnect@100000/interconnect@100000:interconnect@28380000/interconnect@100000:interconnect@28380000:interconnect@42040000/42110000.wkup_gpio0/gpio';
  #userButtonWatcher = null;
  #userButtonPath;
  #lastButtonCount: number = 0;
  readonly #watchDurationMs = 3000;
  readonly #pollingIntervalMs = 250;
  readonly #durationPollRatio = this.#watchDurationMs / this.#pollingIntervalMs;
  #blinkTimers = {
    1: [],
    2: []
  };
  #fwFlasher: FWFlasher = new FWFlasher(this);

  constructor() {
    this.setupGPIOPaths();
    this.clearAll();

    this.initUserButtonWatcher();
    this.blink(500, 'green', 1);
    this.blink(500, 'green', 2);
  }

  /**
   * Read the base id of the gpio chip. User button id is base id +25.
   * Export the button value file if necessary.
   */
  private setupGPIOPaths(): void {
    const filesAndFolders = readdirSync(this.#gpioChipPath);
    if (filesAndFolders.length > 1) {
      console.log(`Can not detect gpio chip number`);
      exit(1);
    }

    const chipNumber = filesAndFolders.join().match(/\d+/g)?.join();
    const buttonID = parseInt(chipNumber) + 25;

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
    console.log('Starting mdcflash service. Watching user button...');
    this.#userButtonWatcher = setInterval(() => {
      const value = readFileSync(this.#userButtonPath)
        .toString('utf8')
        .trim();
      if (value === '0') {
        this.#lastButtonCount++;
        if (this.#lastButtonCount >= this.#durationPollRatio) {
          this.stopBlink(1);
          clearInterval(this.#userButtonWatcher);
          this.transferData()
            .catch((err) => {
              console.log(`Error during transferring data.`);
              exit(1);
            })
            .then(() => {
              return this.fixGPT();
            })
            .catch(() => {
              console.log(`Error during fix GPT.`);
              exit(1);
            })
            .then(() => {
              return this.#fwFlasher.flash();
            })
            .catch((err) => {
              console.log(`Error during flashing new firmware.`);
              exit(1);
            });
        }
        return;
      }
      this.#lastButtonCount = 0;
    }, this.#pollingIntervalMs);
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
      // const usbStick = execSync('findmnt / -o source -n').toString('ascii').trim();
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

  private fixGPT() {
    const cmd = `sgdisk /dev/mmcblk1 -e`;
    return new Promise<void>((res, rej) => {
      exec(cmd, (err, stdout, stderr) => { 
        if(err || stderr !== '') {
          console.log(`Error fixing Boot sector`);
          rej()
        }
        console.log(`Boot sector fixed.`);
        res();
      })
    })

  }
}

class FWFlasher {
  #flashCommand = `iot2050-firmware-update /root/IOT2050*`;
  #checkCommand = `fw_printenv fw_version`;
  #installedVersion: string;
  #newVersion: string;

  constructor(private mdclFlasher: MDCLFlasher) {}

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
    this.mdclFlasher.blink(1000, 'orange', 2);
    console.log('Nach blink orange');
    const proc = exec(this.#flashCommand, (err, _stdout, stderr) => {
      console.log(
        `Flash ausgeführt ${JSON.stringify(err)} ${JSON.stringify(
          _stdout
        )} ${JSON.stringify(stderr)}`
      );
      this.mdclFlasher.stopBlink(2);
      if (err || stderr !== '') {
        this.mdclFlasher.glow(0, 'red', 2);
        console.log(`Update firmware failed due to ${err || stderr}`);
        exit(1);
      }

      console.log(
        `Firmware version successfully installed from ${
          this.#installedVersion
        } to ${this.#newVersion}. Reboot after 10 seconds.`
      );

      shutdown();
    });
    let count = 1;
    proc.stdout.on('data', (data) => {
      if (count > 0) {
        count--;
        proc.stdin.write('y');
        proc.stdin.end();
      }
    });
  }

  private async checkFWVersion(): Promise<boolean> {
    return new Promise((res, _rej) => {
      readdir('/root', (err, files) => {
        if (err) res(false);
        const filename = files.find((str) =>
          /IOT2050-[-a-zA-Z.0-9]*.tar.xz/.test(str)
        );
        const newVersion = filename
          .match(/V[\d]{2}.[\d]{2}.[\d]{2}/)
          .toString()
          .replace('V', '')
          .split('.');
        exec(this.#checkCommand, (err, stdout, stderr) => {
          if (err || stderr !== '') {
            res(false);
          }
          const [_date, version, _unknown, _buildnumber] = stdout
            .replace('fw_version=', '')
            .split('-');
          const installedVersion = version.split('.');
          for (const [index, newV] of newVersion.entries()) {
            if (newV > installedVersion[index]) {
              res(true);
            }
          }
          res(false);
        });
      });
    });
  }
}

/**
 * Start service
 */
const t = new MDCLFlasher();
