import { promisify } from 'util';
const child_process = require('child_process');
const exec = promisify(child_process.exec);

/**
 * Sends ssh commands to the host system
 */
export default class SshService {
  //IMPORTANT: ssh command must be registered in /etc/sudoers
  private static readonly baseCommand = `ssh dockerhost sudo`; //TODO
  private static readonly baseCommandWithoutSudo = `ssh dockerhost`;

  /**
   * Sends ssh command to host
   */
  static async sendCommand(command: string): Promise<any> {
    const commandWithoutSudo = ['cat', 'echo'];
    for (const cmd of commandWithoutSudo) {
      if(command.includes(cmd)) return exec(`${this.baseCommandWithoutSudo} '${command}'`);
    }
    return exec(`${this.baseCommand} '${command}'`);
  }
}
