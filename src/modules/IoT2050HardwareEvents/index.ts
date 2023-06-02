import winston from 'winston';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

type GpioReturn = {
  type: 'Buffer';
  data: number[];
};

/**
 * Handel event on long press USERBUTTON.
 * Triggers given callbacks if button is pressed longer then #buttonPressedTriggerTimeMs
 */
export default class IoT2050HardwareEvents {
  #buttonPressedTriggerTimeMs = 5000;
  #userButtonGpioPin = 20;
  #fistEventTS: number = 0;
  #child: ChildProcessWithoutNullStreams | null = null;
  #initData = false;
  #callbacks: Function[] = [];
  #unusedSlots: number[] = [];

  /**
   * Start watching button
   */
  public async watchUserButtonLongPress(): Promise<void> {
    const logPrefix = `${this.constructor.name}::watchUserButtonLongPress`;
    if (!(await this.is_2050())) {
      winston.error(
        `${logPrefix} no IOT2050 device detected. Registration to USER_BUTTON not available.`
      );
      return;
    }
    if (this.#child) {
      winston.info(`${logPrefix} UserButton already watched`);
      return;
    }
    const cmd = 'stdbuf';
    const options = [
      '-oL',
      'mraa-gpio',
      'monitor',
      this.#userButtonGpioPin.toString()
    ];
    try {
      this.#child = spawn(cmd, options);
      this.#child.stdout.on('data', this.dataHandler.bind(this));
      this.#child.stderr.on('error', this.errorHandler.bind(this));
      winston.info(`${logPrefix} connection to button successfully.`);
    } catch (err) {
      winston.error(`${logPrefix} error during connecting to button.`);
    }
  }

  /**
   * Register callback for event handler.
   * @returns index inside the array for removing
   */
  public registerCallback(callback: Function): number {
    const logPrefix = `${this.constructor.name}::registerCallback `;

    winston.debug(`${logPrefix} register callback to USER_BUTTON event.`);

    if (this.#unusedSlots.length === 0) {
      return this.#callbacks.push(callback) - 1;
    }
    const index = this.#unusedSlots.shift() as number;
    this.#callbacks[index] = callback;
    return index;
  }

  /**
   * Remove callback by index.
   */
  public removeCallback(index: number): void {
    if (index === this.#callbacks.length - 1) {
      this.#callbacks.pop();
      return;
    }
    delete this.#callbacks[index];
    this.#unusedSlots.push(index);
    this.#unusedSlots.sort();
  }

  /**
   * Handles received data
   */
  private dataHandler(stdout: GpioReturn) {
    const logPrefix = `${this.constructor.name}::dataHandler`;

    winston.debug(
      `${logPrefix} receive button event. Start checking if it meet the callback conditions.`
    );
    // Ignore first received data
    if (!this.#initData) {
      this.#initData = true;
      return;
    }
    if (!this.#fistEventTS) {
      this.#fistEventTS = Date.now();
      return;
    }
    if (Date.now() - this.#fistEventTS > this.#buttonPressedTriggerTimeMs) {
      winston.debug(
        `${logPrefix} conditions fulfilled. Execute all callbacks.`
      );
      this.#callbacks.forEach(async (cb, index) => {
        try {
          await cb();
        } catch (e) {
          winston.error(
            `${logPrefix} error during calling callback number ${index}`
          );
        }
      });
    }
    this.#fistEventTS = 0;
  }

  /**
   * Restart child process if crashes because of error
   */
  private async errorHandler(stderr: Error) {
    const logPrefix = `${this.constructor.name}::errorHandler`;
    winston.error(
      `${logPrefix} received error from process due to ${JSON.stringify(
        stderr
      )}`
    );
    if (this.#child && this.#child.exitCode) {
      await this.watchUserButtonLongPress();
    }
  }

  /**
   * Check for button registry.
   */
  private async is_2050(): Promise<boolean> {
    if (process.env.MOCK_USER_BUTTON) return false;
    return true;
  }
}
