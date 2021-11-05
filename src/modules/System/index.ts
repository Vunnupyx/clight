import { promises as fs } from 'fs';
import { promisify } from 'util';
const child_process = require('child_process');
const exec = promisify(child_process.exec);

export class System {
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

    return address.split(':').join('').split('\n').join('').toUpperCase();
  }

  /**
   * Reads serial number
   * @async
   * @returns {Promise<string>}
   */
  public async readSerialNumber() {
    try {
      await exec('fw_printenv board_serial');
    } catch (e) {
      return '';
    }
  }
}
