
import { promisify } from 'util';
import winston from 'winston';
import { ChildProcess, exec } from 'child_process';
const execPromis = promisify(exec);

/**
 * Sends ssh commands to the host system
 */
export default class SshService {
  //IMPORTANT: ssh command must be registered in /etc/sudoers
  private static readonly sshCommand = `ssh dockerhost`;

  /**
   * Sends ssh command to host
   */
  static async sendCommand(command: string, needSudo = false, env: string[] = []): Promise<{ stdout: string | Buffer; stderr: string | Buffer; }> {
    const logPrefix = `SshService::sendCommand`;
    const envVariables = env?.join(' ');
    const chainedCommand = `${needSudo ? 'sudo ' : ''}${env.length > 0 ? `${envVariables} ` : ''}${command}`;
    winston.debug(`${logPrefix} sending: ${chainedCommand}`);

    return execPromis(`${this.sshCommand} ${chainedCommand}`)
      // Log exec return without changing error and response behavior
      .then(({stderr, stdout}) => {
        const logMsg = `Received from command :${chainedCommand}
        stdout: ${stdout}
        stderr: ${stderr}
        `;
        winston.debug(logMsg);
        return {stderr, stdout};
    }).catch((err) => {
      const logMsg = `Catch error from command :${chainedCommand}
        error: ${JSON.stringify(err)}
        stdout: ${err.stdout}
        stderr: ${err.stderr}
        `;
      return Promise.reject(err);
    });
  }
}
