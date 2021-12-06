import { promises as fs } from 'fs';
import winston from 'winston';

export default class IoT2050HardwareEvents {
  private longPressCallback: () => void;
  private buttonPressStarted: number;
  private lastLongPressState: boolean;
  private buttonSetup = false;
  private oldButtonState = false;
  constructor() {
    setInterval(this.readButtonStatus.bind(this), 500);
  }

  private async readButtonStatus() {
    try {
      if (!this.buttonSetup) {
        this.buttonSetup = true;
        await fs.writeFile(
          `${await this.sysfs_prefix()}/sys/class/gpio/export`,
          '211'
        );
      }
    } catch (error) {
      winston.error(`Error setting up user button input for reading: ${error}`);
    }

    const currentTime = new Date().getTime();
    // File content is 0 if button is pressed - so if checks for pressed button

    let buttonPressed = false;
    try {
      buttonPressed =
        `${await fs.readFile(
          `${await this.sysfs_prefix()}/sys/class/gpio/gpio211/value`,
          'utf-8'
        )}`
          .replace('\n', '')
          .trim() === '0';
    } catch (error) {
      winston.error(`Error reading user button status ${error}`);
    }
    if (buttonPressed && !this.oldButtonState) {
      this.buttonPressStarted = currentTime;
    }

    const longPressActive =
      buttonPressed && currentTime - this.buttonPressStarted > 5000;
    if (longPressActive && !this.lastLongPressState) {
      this.longPressCallback();
    }
    this.lastLongPressState = longPressActive;
    this.oldButtonState = buttonPressed;
  }

  public subscribeLongPress(callback) {
    this.longPressCallback = callback;
  }

  private async sysfs_prefix() {
    try {
      const board = await fs.readFile('/sys/firmware/devicetree/base/model');
      if (board.indexOf('SIMATIC IOT2050') >= 0) return '';
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
    return 'src/modules/IoT2050HardwareEvents';
  }
}
