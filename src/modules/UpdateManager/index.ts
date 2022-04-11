import SshService from '../SshService/';
import winston from 'winston';

export enum updateStatus {
    AVAILABLE = 'available',
    NOT_AVAILABLE = 'not available',
    NETWORK_ERROR = 'network error'
}
type updateStatusType = updateStatus.AVAILABLE | updateStatus.NOT_AVAILABLE | updateStatus.NETWORK_ERROR;

/**
 * Handles container updates, and restart
 */
export default class UpdateManager {
    #restartDelay = 10*1000 //ms
   
    /**
     * Pull updates from remote repo.
     * If any image change restart container with new image.
     */
    triggerUpdate(): Promise<updateStatusType> {
        const logPrefix = `UpdateManager::triggerUpdate`;
  
        const hostPrefix = `HOST=""`;
        const images = `docker images -q`;
        const pull = `${hostPrefix} docker-compose pull`;
        const restart = `${hostPrefix} docker-compose up -d`;
        const cleanup = `docker images prune`;
        
        let firstImages: string;
        winston.info(`${logPrefix} check installed images`);

        return SshService.sendCommand(cleanup)
            .then(() => {
                return SshService.sendCommand(images);
            })
            .then((response) => {
                if (response.stderr.length !== 0) throw response.stderr
                firstImages = response.stdout;
                winston.info(`${logPrefix} looking for available updates`);
                return SshService.sendCommand(pull);
            })
            .then(() => {
                winston.info(`${logPrefix} checking new images`);
                return SshService.sendCommand(images);
            })
            .then((response) => {
                if (response.stderr.length !== 0) throw response.stderr
                if(firstImages === response.stdout) {
                    winston.info(`${logPrefix} no update available. No restart required`);
                    return updateStatus.NOT_AVAILABLE;
                }
                // restart with delay because of response delay to frontend
                setTimeout(() => {
                    winston.info(`${logPrefix} restarting container after update.`);
                    SshService.sendCommand(restart)
                        .finally(() =>{
                            winston.error(`Error during container restart. Please restart device.`);
                    });
                }, this.#restartDelay);
                return updateStatus.AVAILABLE;
            })
            .catch((err) => {
                winston.error(`${logPrefix} error during update. Please check your network connection.`);
                return updateStatus.NETWORK_ERROR;
            })
    }
}