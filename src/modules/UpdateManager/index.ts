import SshService from '../SshService/';
import winston from 'winston';
import { ConfigManager } from '../ConfigManager';

export enum updateStatus {
  AVAILABLE = 'available',
  NOT_AVAILABLE = 'not available',
  NETWORK_ERROR = 'network error'
}
type updateStatusType =
  | updateStatus.AVAILABLE
  | updateStatus.NOT_AVAILABLE
  | updateStatus.NETWORK_ERROR;

/**
 * Handles container updates, and restart
 */
export default class UpdateManager {
  #restartDelay = 10 * 1000; //ms

  constructor(private configManager: ConfigManager) {}

  /**
   * Pull updates from remote repo.
   * If any image change restart container with new image.
   */
  triggerUpdate(): Promise<updateStatusType> {
    const logPrefix = `UpdateManager::triggerUpdate`;

    // registry.gitlab.com/codestryke-tech/dmg-mori/mdc-light/
    const selected = this.configManager.config.env.selected;  // selected environment
    const registry = `DOCKER_REGISTRY=${this.configManager.runtimeConfig.registries[selected].url}`;

    const webServerTag = `DOCKER_WEBSERVER_TAG=${this.configManager.config.env.web.tag || this.configManager.runtimeConfig.registries[selected].web.tag}`;
    const mdcTag = `DOCKER_MDC_TAG=${this.configManager.config.env.mdc.tag || this.configManager.runtimeConfig.registries[selected].mdc.tag}`;
    const mtcTag = `DOCKER_MTC_TAG=${this.configManager.config.env.mtc.tag || this.configManager.runtimeConfig.registries[selected].mtc.tag}`;

    const envVars = `${registry} ${webServerTag} ${mdcTag} ${mtcTag}`;
    // const hostPrefix = `HOST=""`;
    const images = `docker images -q`;
    const pull = `${envVars} docker-compose pull`;
    const restart = `screen -d -m /opt/update.sh "${envVars}"`; 
    const cleanup = `docker image prune -f`;

    let firstImages: string;
    winston.info(`${logPrefix} check installed images`);

    // Mock docker pull inside development
    if (process.env.NODE_ENV === 'development') {
      return new Promise((res) => {
        setTimeout(() => res(updateStatus.AVAILABLE), 5000);
      });
    }

    return SshService.sendCommand(cleanup)
      .then(() => {
        return SshService.sendCommand(images);
      })
      .then((response) => {
        if (response.stderr.length !== 0) throw response.stderr;
        firstImages = response.stdout;
        winston.info(`${logPrefix} looking for available updates.`);
        winston.debug(`${logPrefix} pull command: ${pull}`);
        return SshService.sendCommand(pull);
      })
      .then(() => {
        winston.info(`${logPrefix} checking new images.`);
        return SshService.sendCommand(images);
      })
      .then((response) => {
        if (response.stderr.length !== 0) throw response.stderr;
        if (firstImages === response.stdout) {
          winston.info(`${logPrefix} no update available. No restart required.`);
          return updateStatus.NOT_AVAILABLE;
        }
        // restart with delay because of response delay to frontend
        setTimeout(async () => {
          winston.info(`${logPrefix} restarting container after update.`);
          const res = await SshService.sendCommand(restart);
          if (res.stderr) {
            winston.error(
              `Error during container restart. Please restart device.`
            );
          }
        }, this.#restartDelay);
        return updateStatus.AVAILABLE;
      })
      .catch((err) => {
        console.log();
        winston.error(
          `${logPrefix} error during update. Please check your network connection. ${JSON.stringify(
            err
          )}`
        );
        return updateStatus.NETWORK_ERROR;
      });
  }
}
