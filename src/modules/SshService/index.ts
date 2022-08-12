import { promisify } from 'util';
import winston from 'winston';
import { exec } from 'child_process';
const execPromise = promisify(exec);

/**
 * Sends ssh commands to the host system
 */
export default class SshService {
  //IMPORTANT: ssh command must be registered in /etc/sudoers
  private static readonly sshCommand = `ssh dockerhost`;

  /**
   * Sends ssh command to host
   */
  static async sendCommand(
    command: string,
    needSudo = false,
    env: string[] = []
  ): Promise<{ stdout: string | Buffer; stderr: string | Buffer }> {
    const logPrefix = `SshService::sendCommand`;
    const envVariables = env?.join(' ');
    const chainedCommand = `${needSudo ? 'sudo ' : ''}${
      env.length > 0 ? `${envVariables} ` : ''
    }${command}`.replace(/"/g, `\"`);
    winston.debug(`${logPrefix} sending: "${chainedCommand}"`);

    return (
      execPromise(`${this.sshCommand} "${chainedCommand}"`)
        // Log exec return without changing error and response behavior
        .then(({ stderr, stdout }) => {
          const logMsg = `${logPrefix} received from command: "${chainedCommand}" \n
stdout: ${stdout}
stderr: ${stderr}`;
          winston.debug(logMsg);
          return Promise.resolve({ stderr, stdout });
        })
        .catch((err) => {
          const logMsg = `${logPrefix} catch error from command: "${chainedCommand}"\n
error: ${JSON.stringify(err)}
stdout: ${err.stdout}
stderr: ${err.stderr}`;
          winston.error(logMsg);
          return Promise.reject(err);
        })
    );
  }
}
