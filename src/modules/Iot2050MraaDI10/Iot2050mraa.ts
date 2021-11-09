import { promises as fs } from 'fs';
import winston from 'winston';
const child = require('child_process');

interface PinStatus {
  pin: number;
  state: boolean;
}

export enum PinState {
  OFF = 0,
  ON = 1,
  BLINKING = 2
}

/**
 * Implements an event based driver for the IoT2050 digital inputs using mraa-gpio
 * Contains specific pin definitions and labels for the SIEMENS SIMATIC IoT2000 Input Modul Sink/Source 10x DI,
 * Order-No: 6ES7647-0KA02-0AA2
 */
export class Iot2050MraaDI10 {
  private DIGITAL_PIN_LABELS = [
    'DI0',
    'DI1',
    'DI2',
    'DI3',
    'DI4',
    'DI5',
    'DI6',
    'DI7',
    'DI8',
    'DI9'
  ];
  private ANALOG_PIN_LABELS = ['AI0', 'AI1'];
  private MONITOR_PINS = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  private ANALOG_READ_ADDRESSES = [
    '/sys/bus/iio/devices/iio:device0/in_voltage1_raw',
    '/sys/bus/iio/devices/iio:device0/in_voltage2_raw'
  ];
  // Maximum time (ms) between the last three edges for detecting the state as blinking
  private BLINKING_MAX_TIME_BETWEEN_EDGES = 2250; // 0,5Hz + tolerance
  private childProcesses: Array<number> = [];
  private currentState: Array<PinState> = [];
  private timesBetweenEdges: Array<Array<number>> = [];
  private lastEdge: Array<number> = [];

  /**
   * Initializes the driver and sets up necessary mraa-gpio instances
   */
  public init(): void {
    for (const pin of this.MONITOR_PINS) {
      // stdbuf is used because mraa does not flush stdout after reported pin state change
      const initialValues = child.spawn(
        'stdbuf',
        ['-oL', 'mraa-gpio', 'get', pin.toString()],
        { shell: true, detached: true }
      );
      initialValues.stdout.on('data', this.monitorCallback.bind(this));

      const mraaGpio = child.spawn(
        'stdbuf',
        ['-oL', 'mraa-gpio', 'monitor', pin.toString()],
        { shell: true, detached: true }
      );
      mraaGpio.stdout.on('data', this.monitorCallback.bind(this));
      this.childProcesses[pin] = mraaGpio;
    }
  }

  /**
   * Get current pin states (ON, OFF or BLINKING)
   * @returns dictionary of pin labels with current pin states as values
   */
  public async getDigitalValues(): Promise<{ [label: string]: PinState }> {
    let labeledValues = {};
    for (let i = 0; i < this.DIGITAL_PIN_LABELS.length; i++) {
      const label = this.DIGITAL_PIN_LABELS[i];
      const value = this.currentState[this.MONITOR_PINS[i]];
      labeledValues[label] = value;
    }
    return labeledValues;
  }

  /**
   * Get
   * @returns dictionary of pin labels with current pin states as values
   */
  public async getAnalogValues(): Promise<{ [label: string]: number }> {
    let labeledValues = {};
    for (let i = 0; i < this.ANALOG_PIN_LABELS.length; i++) {
      const label = this.ANALOG_PIN_LABELS[i];
      const address = this.ANALOG_READ_ADDRESSES[i];
      labeledValues[label] = await this.analogRead(address);
    }
    return labeledValues;
  }

  private async analogRead(sysfs_file: string): Promise<number> {
    const data = await fs.readFile(
      `${await this.sysfs_prefix()}${sysfs_file}`,
      'utf-8'
    );
    const parsedValue = parseInt(data, 10);
    const scaledValue = (parsedValue / 4096) * 100.0;
    return scaledValue;
  }

  private async sysfs_prefix() {
    try {
      const board = await fs.readFile('/sys/firmware/devicetree/base/model');
      if (board.indexOf('SIMATIC IOT2050') >= 0) return '';
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
    return 'src/modules/Iot2050MraaDI10';
  }

  /**
   * General callback for mraa-gpio monitor & mraa-gpio get
   * @param data output (buffer) of mraa-gpio
   */
  private monitorCallback(data: object) {
    let newState = null;
    try {
      newState = this.parseOutput(data.toString());
    } catch (e) {
      return;
    }

    if (!Array.isArray(this.timesBetweenEdges[newState.pin]))
      this.timesBetweenEdges[newState.pin] = [];
    if (this.lastEdge[newState.pin] === undefined)
      this.lastEdge[newState.pin] = 0;
    this.timesBetweenEdges[newState.pin].push(
      Date.now() - this.lastEdge[newState.pin]
    );

    // Keep only the three latest values
    this.timesBetweenEdges[newState.pin] = this.timesBetweenEdges[
      newState.pin
    ].slice(Math.max(this.timesBetweenEdges[newState.pin].length - 3, 0));

    this.currentState[newState.pin] = newState.state
      ? PinState.ON
      : PinState.OFF;

    const lastThreeBlinking =
      Math.max(...this.timesBetweenEdges[newState.pin]) <=
      this.BLINKING_MAX_TIME_BETWEEN_EDGES;
    const lastEdgeBlinking = Date.now() - this.lastEdge[newState.pin];

    if (lastThreeBlinking && lastEdgeBlinking) {
      this.currentState[newState.pin] = PinState.BLINKING;
    }

    this.lastEdge[newState.pin] = Date.now();
  }

  /**
   * Parses mraa output into pin number and current pin state
   * @param output raw output from mraa-gpio, for example: "Pin 6 = 1\n"
   * @returns PinStatus: .pin = pin number, .state = current pin state
   */
  private parseOutput(output: string): PinStatus {
    const noLineBreaks = output.replace(/\n/g, '');
    const noSpaces = noLineBreaks.replace(/ /g, '');
    const noText = noSpaces.replace(/Pin/g, '');
    const data = noText.split('='); // Example input string: 6=1
    const pinNumber = parseInt(data[0], 10);
    if (isNaN(pinNumber)) {
      throw Error('Could not parse pin value');
    }
    return {
      pin: pinNumber,
      state: data[1] === '1'
    };
  }
}

// const io = new Iot2050MraaDI10();
// io.init();

// setInterval(async () => {
//   console.log(io.getDigitalValues());
//   console.log(await io.getAnalogValues());
// }, 3000);
