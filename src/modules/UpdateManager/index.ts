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
    const pull = `"bash -c '${envVars} docker-compose pull'"`;
    const restart = `screen -d -m /opt/update.sh`; 
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
          const res = await SshService.sendCommand(restart, [registry, webServerTag, mdcTag, mtcTag]);
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

  /**
   * Compare current running docker config with config entry.
   * @param currentConfig
   * @returns true if it does not match
   */
  private changeInTagOrRepo(currentConfig: {
    repo: string;
    web: {
      tag: string;
    };
    mdc: {
      tag: string;
    };
    mtc: {
      tag: string;
    };
  }): Promise<boolean> {
    const logPrefix = `${this.constructor.name}::changeInTagOrRepo`;

    const cmd = `docker ps`;
    winston.debug(`${logPrefix} sending: ${cmd}`);
    return SshService.sendCommand(cmd)
      .then((res) => {
        if (res.stderr.length !== 0) {
          winston.debug(
            `${logPrefix} received error from ${cmd}: ${res.stderr}`
          );
          throw res.stderr;
        }
        winston.debug(`${logPrefix} received: ${res.stdout}`);
        type ContainerMap = {
          [prob in 'web' | 'mtc' | 'mdc']: {
            [subprob in 'imageName' | 'tag' | 'repo']: string;
          };
        };
        // @ts-ignore
        let containerMap: ContainerMap = {};
        res.stdout
          .trim()
          .split('\n')
          .slice(1)
          .forEach((line) => {
            const z = line.split(/[ ]+/)[1].split(':');
            const lastSlashIndex = z[0].search(/(\b\/\b)(?!.*\1)/);
            const imageName = z[0].substring(lastSlashIndex + 1);
            const repo = z[0].substring(0, lastSlashIndex);
            const tag = z[1];
            let image;
            switch (imageName) {
              case 'mdc-web-server': {
                image = 'web';
                break;
              }
              case 'mtconnect-prod_arm64': {
                image = 'mtc';
                break;
              }
              case 'mdclight': {
                image = 'mdc';
                break;
              }
              default:
                return;
            }
            containerMap[image] = { imageName, tag, repo };
          });
        return containerMap;
      })
      .then((containerMap) => {
        for (const [key, entry] of Object.entries(containerMap)) {
          if (
            currentConfig[key]?.tag !== entry.tag ||
            currentConfig.repo !== entry.repo
          ) {
            winston.debug(
              `${logPrefix} found change in docker container ${entry.imageName} configuration. From ${currentConfig[key]?.tag} to ${entry.tag} and from ${currentConfig.repo} to ${entry.repo}`
            );
            return true;
          }
        }
        winston.debug(
          `${logPrefix} no changes in docker container configuration found.`
        );
        return false;
      });
  }
}
