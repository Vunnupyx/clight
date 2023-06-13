import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import { promisify } from 'util';
import winston from 'winston';
import { ConfigurationAgentManager } from '../ConfigurationAgentManager';
import { ICosSystemVersions } from '../ConfigurationAgentManager/interfaces';

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
      'eth1' = 'enoX2'
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
   * Reads CELOS version
   */
  public async readOsVersion() {
    try {
      const versions =
        (await ConfigurationAgentManager.getSystemVersions()) as ICosSystemVersions;
      const osVersion = versions?.find((v) => v.Name === 'COS')?.Version;
      return osVersion || 'unknown';
    } catch (error) {
      winston.error('Error reading OS version!');
      winston.error(error);
      return 'unknown';
    }
  }
}
