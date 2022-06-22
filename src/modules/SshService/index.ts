import { promisify } from 'util';
import winston from 'winston';
const child_process = require('child_process');
const exec = promisify(child_process.exec);

/**
 * Sends ssh commands to the host system
 */
export default class SshService {
  //IMPORTANT: ssh command must be registered in /etc/sudoers
  private static readonly baseCommand = `ssh dockerhost`;
  private static readonly baseCommandWithSudo = `${this.baseCommand} sudo`;

  /**
   * Sends ssh command to host
   */
  static async sendCommand(command: string, env?: string[]): Promise<any> {
    const logPrefix = `SshService::sendCommand`;
    const commandsWithoutSudo = ['cat', 'echo', 'pull', 'docker'];
    let newCmd: string;
    const envVariables = env?.join(' ');
    winston.debug(`${logPrefix} received command: ${command} with env variables: ${env?.join(' ')}`);
    for (const cmd of commandsWithoutSudo) {
      if(command.includes(cmd)) {
        newCmd = `${this.baseCommand} ${envVariables || ''} ${command}`;
      }
    }
    winston.debug(`${logPrefix} sending: ${newCmd || `${this.baseCommandWithSudo} ${envVariables || ''} ${command}`}`)
    return exec(newCmd || `${this.baseCommandWithSudo} ${envVariables || ''} ${command}`);
  }
}
