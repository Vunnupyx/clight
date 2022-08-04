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

    const selected = this.configManager.config.env.selected; // selected environment
    const registry = `DOCKER_REGISTRY=${this.configManager.runtimeConfig.registries[selected].url}`;

    const webServerTag =
      this.configManager.config.env.web.tag ||
      this.configManager.runtimeConfig.registries[selected].web.tag;
    const webServerTagString = `DOCKER_WEBSERVER_TAG=${webServerTag}`;

    const mdcTag =
      this.configManager.config.env.mdc.tag ||
      this.configManager.runtimeConfig.registries[selected].mdc.tag;
    const mdcTagString = `DOCKER_MDC_TAG=${mdcTag}`;

    const mtcTag =
      this.configManager.config.env.mtc.tag ||
      this.configManager.runtimeConfig.registries[selected].mtc.tag;
    const mtcTagString = `DOCKER_MTC_TAG=${mtcTag}`;

    const envVars = `${registry} ${webServerTagString} ${mdcTagString} ${mtcTagString}`;
    const images = `docker images -q`;
    const pull = `"bash -c '${envVars} docker-compose pull'"`;
    const restart = `screen -d -m /opt/update.sh`;
    const cleanup = `docker image prune -f`;
    const dnsFixDelaySec = 15;

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
        if (typeof response.stdout !== 'string') {
          winston.error(
            `HostnameController::getHostname expect string but received buffer.Abort`
          );
          return Promise.reject();
        }
        firstImages = response.stdout;
        winston.info(`${logPrefix} looking for available updates.`);
        winston.debug(`${logPrefix} pull command: ${pull}`);
        return SshService.sendCommand(pull);
      })
      .catch((error) => {
        winston.error(
          `${logPrefix} catch error ${JSON.stringify(
            error
          )} after pull. Start retry after delay of ${dnsFixDelaySec}s.`
        );
        return new Promise((res, rej) =>
          setTimeout(async () => {
            winston.debug(`${logPrefix} try to pull again...`);
            SshService.sendCommand(pull).then(res).catch(rej);
          }, dnsFixDelaySec * 1_000)
        );
      })
      .then(() => {
        winston.info(`${logPrefix} checking new images.`);
        return SshService.sendCommand(images);
      })
      .then(async (response) => {
        if (response.stderr.length !== 0) throw response.stderr;

        if (
          await this.changeInTagOrRepo({
            repo: this.configManager.runtimeConfig.registries[selected].url,
            mdc: { tag: mdcTag },
            mtc: { tag: mtcTag },
            web: { tag: webServerTag }
          })
        ) {
          winston.info(
            `${logPrefix} staging environment change detected. Restart required.`
          );
        } else if (firstImages === response.stdout) {
          winston.info(
            `${logPrefix} no update available. No restart required.`
          );
          return updateStatus.NOT_AVAILABLE;
        }

        setTimeout(async () => {
          winston.info(`${logPrefix} restarting container after update.`);
          const res = await SshService.sendCommand(restart, true, [
            registry,
            webServerTagString,
            mdcTagString,
            mtcTagString
          ]);
          if (res.stderr) {
            winston.error(
              `Error during container restart. Please restart device.`
            );
          }
        }, this.#restartDelay);
        return updateStatus.AVAILABLE;
      })
      .catch((err) => {
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
        if (typeof res.stdout !== 'string') {
          winston.error(
            `HostnameController::getHostname expect string but received buffer.Abort`
          );
          return Promise.reject();
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
