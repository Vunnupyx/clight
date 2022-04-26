import winston from 'winston';
import SshService from '../SshService';
import { System } from '../System';

/**
 * Set hostname for MDCL host.
 */
export default class HostnameController {
  /**
   * Set hostname
   */
  static async setHostname(hostname: string): Promise<void> {
    winston.info(`Setting hostname to '${hostname}'`);
    await SshService.sendCommand(`hostnamectl set-hostname '${hostname}'`);
  }

  /**
   * Set default hostname
   */
  static async setDefaultHostname(): Promise<void> {
    const macAddress = await new System().readMacAddress('eth0');
    const formattedMacAddress = macAddress.split(':').join('').toUpperCase();

    const hostname = `DM${formattedMacAddress}`;
    winston.info(`Setting hostname to '${hostname}'`);
    await SshService.sendCommand(`hostnamectl set-hostname '${hostname}'`);
  }
}
