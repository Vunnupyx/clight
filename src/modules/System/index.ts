import { promises as fs } from 'fs';
import { promisify } from 'util';
import winston from 'winston';
const child_process = require('child_process');
const exec = promisify(child_process.exec);

export class System {
  private static className: string = System.name;

  /**
   * Reads a mac adress
   * @async
   * @returns {Promise<string | null>} Mac Address
   */
  public async readMacAddress(
    networkInterface: 'eth0' | 'eth1'
  ): Promise<string | null> {
    let address;

    try {
      address = await fs.readFile(
        `/sys/class/net/${networkInterface}/address`,
        {
          encoding: 'utf-8'
        }
      );
    } catch (err) {
      return null;
    }

    return address.trim().toUpperCase();
  }

  /**
   * Reads serial number
   * @async
   * @returns {Promise<string>}
   */
  public async readSerialNumber() {
    const logPrefix = `${System.className}::readSerialNumber`;
    try {
      const serial = await exec('fw_printenv board_serial');
      return serial.split('')[1];
    } catch (err) {
      winston.error(
        `${logPrefix} failed to read board serial number ${JSON.stringify(err)}`
      );
      return '';
    }
  }
}
