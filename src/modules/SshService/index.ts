import { promisify } from 'util';
import winston from 'winston';
const child_process = require('child_process');
const exec = promisify(child_process.exec);

/**
 * Sends ssh commands to the host system
 */
export default class SshService {
  //IMPORTANT: ssh command must be registered in /etc/sudoers
  private static readonly sshCommand = `ssh dockerhost`;

  /**
   * Sends ssh command to host
   */
  static async sendCommand(command: string, needSudo = false, env?: string[]): Promise<any> {
    const logPrefix = `SshService::sendCommand`;
    const envVariables = env?.join(' ');
    winston.debug(`${logPrefix} received command ${needSudo ? 'with sudo' : ''}: ${command} ${env ? `with env: ${envVariables}` : ''}`);

    return exec(`${this.sshCommand}${needSudo ? ' sudo ' : ' '}${envVariables || ' '} ${command}`);
  }
}
