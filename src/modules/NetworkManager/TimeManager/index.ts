import winston from 'winston';
import SshService from '../../SshService';
/**
 * Manage NTP time configuration and also manual time configuration.
 */
export class TimeManager {
  static CONFIG_PATH = '/etc/systemd/timesyncd.conf';
  /**
   * Parse network address out of config file.
   */
  private static parseConfig(configContent: string) {
    const lines = configContent.split('\n');
    for (const line of lines) {
      if (line.indexOf('NTP=') >= 0) {
        const ntpLineContents = line.split('=');
        const currentServer =
          ntpLineContents[1].trim().length === 0
            ? '0.0.0.0'
            : ntpLineContents[1];
        return currentServer;
      }
    }
  }
  /**
   * Compose new ntp server to config string.
   */
  private static composeConfig(
    configContent: string,
    ntpServerIP: string
  ): string {
    let newConfig = '';
    for (const line of configContent.split('\n')) {
      if (line.indexOf('NTP=') >= 0 && line.indexOf('FallbackNTP=') < 0) {
        if (ntpServerIP === '0.0.0.0') {
          newConfig += `NTP=\n`;
        } else {
          newConfig += `NTP=${ntpServerIP}\n`;
        }
      } else {
        newConfig += `${line}\n`;
      }
    }
    return newConfig;
  }
  /**
   * Restart time service on host.
   */
  private static async restartTimesyncdService(): Promise<void> {
    const logPrefix = `TimeManager::restartTimesyncdService`;
    winston.debug(`${logPrefix} restarting...`);
    const command = `systemctl restart systemd-timesyncd`;
    const { stdout, stderr } = await SshService.sendCommand(command);
    if (stderr !== '') {
      const msg = `${logPrefix} error during restart of timesyncd service.`;
      winston.error(msg);
      return Promise.reject(new Error(msg));
    }
    winston.debug(`${logPrefix} restart successfully.`);
  }
  /**
   * Set NTP Server on remote host.
   */
  public static async setNTPServer(ntpServerIP: string): Promise<void> {
    const logPrefix = `TimeManager::setNTPServer`;
    const readCommand = `cat ${TimeManager.CONFIG_PATH}`;
    const { stdout: currentConfig, stderr } = await SshService.sendCommand(
      readCommand
    );
    if (stderr !== '') {
      const msg = `${logPrefix} error during read current configuration due to ${stderr}`;
      winston.error(msg);
      return Promise.reject(new Error(msg));
    }
    winston.info(
      `${logPrefix} read current config from host: ${currentConfig}`
    );
    const newConfig = await this.composeConfig(currentConfig, ntpServerIP);
    winston.info(`${logPrefix} generate new config: ${newConfig}`);
    const writeCommand = `echo ${newConfig} > ${this.CONFIG_PATH}`;
    await SshService.sendCommand(writeCommand);
    winston.info(
      `${logPrefix} written new NTP-Server (${ntpServerIP}) to host`
    );
    await this.restartTimesyncdService();
  }
  /**
   * Return currently configured NTP server.
   */
  public static async getNTPServer(): Promise<string> {
    const logPrefix = `TimeManager::getNTPServer`;
    winston.info(`${logPrefix} reading config from remote host.`);
    const readCommand = `cat ${this.CONFIG_PATH}`;
    const currentConfig = await SshService.sendCommand(readCommand);
    winston.info(
      `${logPrefix} read config from remote host successful. ${currentConfig}`
    );
    return this.parseConfig(currentConfig);
  }

  /**
   * Set time manually and disable NTP.
   */
  public static async setTimeManually(
    time: string,
    timezone: string
  ): Promise<void> {
    console.log('Set time manually:', time, timezone);

    const logPrefix = `TimeManager::setTimeManually`;
    const timeRegex =
      /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01]) (0[1-9]|1[0-9]|2[01234]):([0-5]{1}[0-9]{1}|60):([0-5]{1}[0-9]{1}|60)/;
    if (!timeRegex.test(time)) {
      const errMsg = `${logPrefix} invalid time format: ${time}`;
      winston.error(errMsg);
      return Promise.reject(new Error(errMsg));
    }
    // Disable NTP
    winston.info(`${logPrefix} disabling NTP.`);
    await SshService.sendCommand(`timedatectl set-ntp 0`);
    winston.info(`${logPrefix} disabling NTP successfully.`);
    winston.info(`${logPrefix} setting time to ${time}`);
    const setTimeSshCommand = `timedatectl set-time "${time}"`;
    const setTimeRes = await SshService.sendCommand(setTimeSshCommand);
    if (setTimeRes.stderr !== '') {
      const errMsg = `${logPrefix} error during set manual time due to ${setTimeRes.stderr}`;
      winston.error(errMsg);
      return Promise.reject(errMsg);
    }
    winston.info(`${logPrefix} setting time zone to ${time}`);
    const setTimezoneSshCommand = `timedatectl set-timezone "${timezone}"`;
    const setTimezoneRes = await SshService.sendCommand(setTimezoneSshCommand);
    if (setTimezoneRes.stderr !== '') {
      const errMsg = `${logPrefix} error during set manual time due to ${setTimeRes.stderr}`;
      winston.error(errMsg);
      return Promise.reject(errMsg);
    }
    winston.info(`${logPrefix} set time ${time} ${timezone} successfully.`);
  }
}