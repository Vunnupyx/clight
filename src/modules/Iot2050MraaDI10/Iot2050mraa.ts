import { promises as fs } from 'fs';
import path from 'path';
import winston from 'winston';

const child = require('child_process');

interface PinStatus {
  pin: number;
  state: boolean;
}
export enum PinState {
  OFF = 0,
  ON = 1
}
interface PinData {
  raw: boolean;
  oldRaw: boolean;
  processedState: PinState;
  label: string;
}

/**
 * Implements an event based driver for the IoT2050 digital inputs using mraa-gpio
 * Contains specific pin definitions and labels for the SIEMENS SIMATIC IoT2000 Input Modul Sink/Source 10x DI,
 * Order-No: 6ES7647-0KA02-0AA2
 */
export class Iot2050Mraa {
  private ANALOG_PIN_LABELS = ['AI0', 'AI1'];
  private ANALOG_READ_ADDRESSES = [
    path.join(
      process.env.SYS_PREFIX || '',
      '/sys/bus/iio/devices/iio:device0/in_voltage0_raw'
    ),
    path.join(
      process.env.SYS_PREFIX || '',
      '/sys/bus/iio/devices/iio:device0/in_voltage2_raw'
    )
  ];
  private childProcesses: Array<number> = [];

  protected pinData: { [key: string]: PinData } = {};

  /**
   * Initializes the driver and sets up necessary mraa-gpio instances
   */
  public init(): void {
    for (const pin of Object.keys(this.pinData)) {
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
      this.childProcesses[Number(pin)] = mraaGpio;
    }
  }

  /**
   * Get current pin states (ON or OFF)
   * @returns dictionary of pin labels with current pin states as values
   */
  public async getDigitalValues(): Promise<{ [label: string]: PinState }> {
    let labeledValues: {
      [key: string]: PinState;
    } = {};
    for (const key of Object.keys(this.pinData)) {
      const label = this.pinData[key].label;
      const value = this.pinData[key].processedState;
      labeledValues[label] = value;
    }
    return labeledValues;
  }

  /**
   * Get
   * @returns dictionary of pin labels with current pin states as values
   */
  public async getAnalogValues(): Promise<{ [label: string]: number }> {
    let labeledValues: {
      [key: string]: PinState;
    } = {};
    for (let i = 0; i < this.ANALOG_PIN_LABELS.length; i++) {
      const label = this.ANALOG_PIN_LABELS[i];
      const address = this.ANALOG_READ_ADDRESSES[i];
      labeledValues[label] = await this.analogRead(address);
    }
    return labeledValues;
  }

  private async analogRead(sysfs_file: string): Promise<number> {
    const data = await fs.readFile(`${sysfs_file}`, 'utf-8');
    const parsedValue = parseInt(data, 10);
    const scaledValue = (parsedValue / 4096) * 100.0;
    return scaledValue;
  }

  /**
   *
   * @deprecated
   */
  private async sysfs_prefix() {
    try {
      const board = await fs.readFile('/sys/firmware/devicetree/base/model');
      if (board.indexOf('SIMATIC IOT2050') >= 0) return '';
    } catch (e) {
      if ((e as { code?: string }).code !== 'ENOENT') throw e;
    }
    return 'src/modules/Iot2050MraaDI10';
  }

  /**
   * General callback for mraa-gpio monitor & mraa-gpio get
   * @param data output (buffer) of mraa-gpio
   */
  private monitorCallback(data: object) {
    const logPrefix = `${Iot2050MraaDI10.name}::monitorCallback`;
    let newState: PinStatus | null = null;
    try {
      newState = this.parseOutput(data.toString());
    } catch (e) {
      winston.error(
        `${logPrefix} error parsing mraa-gpio output: ${(e as Error)?.message}`
      );
      return;
    }

    this.pinData[newState.pin].raw = newState.state;
    this.pinData[newState.pin].processedState = this.pinData[newState.pin].raw
      ? PinState.ON
      : PinState.OFF;
  }

  /**
   * Parses mraa output into pin number and current pin state
   * @param output raw output from mraa-gpio, for example: "Pin 6 = 1\n"
   * @returns PinStatus: .pin = pin number, .state = current pin state
   */
  private parseOutput(output: string): PinStatus {
    const logPrefix = `${Iot2050MraaDI10.name}::parseOutput`;
    if (
      output.includes('Could not initialize') ||
      output.includes('Failed to register')
    ) {
      winston.error(
        `${logPrefix} error accessing gpio pin via mraa-gpio, error: ${output}`
      );
      throw Error('Error accessing gpio pin via mraa-gpio');
    }
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

export class Iot2050MraaDI10 extends Iot2050Mraa {
  protected pinData: { [key: string]: PinData } = {
    4: {
      raw: false,
      oldRaw: false,
      processedState: PinState.OFF,
      label: 'DI0'
    },
    5: {
      raw: false,
      oldRaw: false,
      processedState: PinState.OFF,
      label: 'DI1'
    },
    6: {
      raw: false,
      oldRaw: false,
      processedState: PinState.OFF,
      label: 'DI2'
    },
    7: {
      raw: false,
      oldRaw: false,
      processedState: PinState.OFF,
      label: 'DI3'
    },
    8: {
      raw: false,
      oldRaw: false,
      processedState: PinState.OFF,
      label: 'DI4'
    },
    9: {
      raw: false,
      oldRaw: false,
      processedState: PinState.OFF,
      label: 'DI5'
    },
    10: {
      raw: false,
      oldRaw: false,
      processedState: PinState.OFF,
      label: 'DI6'
    },
    11: {
      raw: false,
      oldRaw: false,
      processedState: PinState.OFF,
      label: 'DI7'
    },
    12: {
      raw: false,
      oldRaw: false,
      processedState: PinState.OFF,
      label: 'DI8'
    },
    13: {
      raw: false,
      oldRaw: false,
      processedState: PinState.OFF,
      label: 'DI9'
    }
  };
}
export class Iot2050MraaDI2AI5 extends Iot2050Mraa {
  protected pinData: { [key: string]: PinData } = {
    4: {
      raw: false,
      oldRaw: false,
      processedState: PinState.OFF,
      label: 'DI4'
    },
    9: {
      raw: false,
      oldRaw: false,
      processedState: PinState.OFF,
      label: 'DI3'
    },
    10: {
      raw: false,
      oldRaw: false,
      processedState: PinState.OFF,
      label: 'DI2'
    },
    11: {
      raw: false,
      oldRaw: false,
      processedState: PinState.OFF,
      label: 'DI1'
    },
    12: {
      raw: false,
      oldRaw: false,
      processedState: PinState.OFF,
      label: 'DI0'
    }
  };
}

// const io = new Iot2050MraaDI10();
// io.init();

// setInterval(async () => {
//   console.log(await io.getDigitalValues());
//   // console.log(await io.getAnalogValues());
// }, 3000);
