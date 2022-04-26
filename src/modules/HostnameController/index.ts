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
    const macAddress = await new System().readMacAddress('eth1');
    const formattedMacAddress = macAddress.split(':').join('').toUpperCase();

    const hostname = `DM${formattedMacAddress}`;
    winston.info(`Setting hostname to '${hostname}'`);
    await SshService.sendCommand(`hostnamectl set-hostname '${hostname}'`);
  }

  /**
   * Returns the set hostname of the docker host machine. 
   * Return 'UnknownHostname' on any error.
   */
  static async getHostname(): Promise<string> {
    return SshService.sendCommand('hostnamectl')
      .then((status) => {
        return status.substr(0, status.indexOf('\n')).replace('Static hostname: ', '');
      })
      .catch((err) => {
        winston.error(`HostnameController:getHostname error catching hostname due to ${JSON.stringify(err)}`);
        return 'UnknownHostname';
      }) 
  }
}
