import { promises as fs, readFileSync, existsSync } from 'fs';
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
    enum interfaceMapping {
      'eth0' = 'enoX1',
      'eth1' = 'enoX1'
    }
    try {
      address = await fs.readFile(
        `/sys/class/net/${interfaceMapping[networkInterface]}/address`,
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
  /**
   * Gets the hostname based on MAC address
   * @async
   * @returns {Promise<string>}
   */
  public async getHostname(): Promise<string> {
    const defaultHostname = 'dm000000000000';
    return process.env.IOTEDGE_GATEWAYHOSTNAME || defaultHostname;
  }

  /**
   * Reads mdc flex OS version. Located
   */
  public readOsVersion() {
    try {
      if (existsSync('/etc/mdcflex-os-release')) {
        const fileContent = readFileSync(
          '/etc/mdcflex-os-release',
          'utf-8'
        ).trim();
        const versionLine =
          fileContent.split('\n').find((line) => line.startsWith('VERSION=')) ||
          'unknown';
        return versionLine.replace('VERSION=', '');
      }
    } catch (e) {
      console.log('Error reading OS version!');
      console.log(e);
    }

    return 'unknown';
  }
}
