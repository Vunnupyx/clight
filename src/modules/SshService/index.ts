import { promisify } from 'util';
const child_process = require('child_process');
const exec = promisify(child_process.exec);

/**
 * Sends ssh commands to the host system
 */
export default class SshService {
  //IMPORTANT: ssh command must be registered in /etc/suduers
  private static readonly baseCommand = `ssh dockerhost sudo`; //TODO

  /**
   * Sends ssh command to host
   */
  static async sendCommand(command: string): Promise<any> {
    return exec(`${this.baseCommand} '${command}'`);
  }
}
