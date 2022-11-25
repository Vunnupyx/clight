import { StateMachine, StateAndTransitions } from './state-machine';
import {
  ConfigurationAgentHttpMockupService,
  HttpMockupService
} from 'app/shared';
import { sleep } from 'app/shared/utils';
import { UpdateStatus } from 'app/services';

interface CosInstalledVersion {
  Name: string;
  DisplayName: string;
  Version: string;
}
interface CosUpdateVersion {
  Title: string;
  Version: string;
  Description: string;
}

interface CosDownloadStatus {
  PendingPackageCount: number;
  FailedPackageCount: number;
  LastStatusUpdate: string;
  Connected: boolean;
}

interface CosApplyUpdateRespons {
  Title: string;
  Version: string;
  Success: boolean;
  Error: string;
}

const DOWNLOAD_STATUS_POLLING_INTERVAL_MS = 5_000;
const RESTART_STATUS_POLLING_INTERVAL_MS = 2_000;
const CHECK_MODULE_UPDATE_STATUS_POLLING_INTERVAL_MS = 1_000;

export class UpdateManager {
  private currentState = '';
  private endReason = '';
  private stateMachine: StateMachine;
  private startState = 'GET_UPDATES';
  private newVersionToInstall = '';
  private updateFlow: StateAndTransitions = {
    INIT: {
      transition: () => 'START_UPDATE',
      transitions: {
        START_UPDATE: 'GET_UPDATES'
      }
    },
    GET_UPDATES: {
      transition: this.getUpdates.bind(this),
      transitions: {
        UPDATE_FOUND: 'CHECK_INSTALLED_COS_VERSION',
        NO_UPDATE_FOUND: 'END'
      }
    },
    CHECK_INSTALLED_COS_VERSION: {
      transition: this.checkInstalledCosVersion.bind(this),
      transitions: {
        VERSION_OK: 'APPLY_MODULE_UPDATES',
        VERSION_NOT_OK: 'CHECK_COS_UPDATES'
      }
    },
    CHECK_COS_UPDATES: {
      transition: this.checkDownloadedCosUpdates.bind(this),
      transitions: {
        UPDATE_AVAILABLE: 'APPLY_COS_UPDATES',
        UPDATE_NOT_AVAILABLE: 'START_DOWNLOAD_COS_UPDATES'
      }
    },
    START_DOWNLOAD_COS_UPDATES: {
      transition: this.downloadCosUpdates.bind(this),
      transitions: {
        COS_DOWNLOAD_STARTED: 'VALIDATE_COS_DOWNLOAD'
      }
    },
    VALIDATE_COS_DOWNLOAD: {
      transition: this.validateCosDownload.bind(this),
      transitions: {
        COS_DOWNLOADED: 'APPLY_COS_UPDATES'
      }
    },
    APPLY_COS_UPDATES: {
      transition: this.applyCosUpdates.bind(this),
      transitions: {
        INSTALLING_COS: 'WAITING_FOR_SYSTEM_RESTART'
      }
    },
    WAITING_FOR_SYSTEM_RESTART: {
      transition: this.waitForSystemRestart.bind(this),
      transitions: {
        SYSTEM_RESTARTED: 'APPLY_MODULE_UPDATES'
      }
    },
    APPLY_MODULE_UPDATES: {
      transition: this.applyModuleUpdates.bind(this),
      transitions: {
        MODULE_UPDATE_APPLIED: 'WAIT_FOR_MODULE_UPDATE'
      }
    },
    WAIT_FOR_MODULE_UPDATE: {
      transition: this.waitForModuleUpdates.bind(this),
      transitions: {
        SUCCESS: 'END'
      }
    }
  };

  constructor(
    private apiEndpoint: HttpMockupService,
    private configAgentEndpoint: ConfigurationAgentHttpMockupService,
    private onStateChange
  ) {}

  public async start() {
    this.stateMachine = new StateMachine(
      this.updateFlow,
      this.onStateChange,
      this.startState
    );
    await this.stateMachine.start();
  }

  private async getUpdates() {
    const logPrefix = `${UpdateManager.name}::getUpdates`;
    try {
      const response = await this.apiEndpoint.get(
        `/getUpdates`,
        undefined,
        'response'
      );
      //TBD
      this.newVersionToInstall = response || '3.0.0';
      return 'UPDATE_FOUND';
      //return 'NO_UPDATE_FOUND';
    } catch (err) {
      console.log(logPrefix, err);
      return 'GET_UPDATES_FAILED';
    }
  }

  private async checkInstalledCosVersion() {
    const logPrefix = `${UpdateManager.name}::checkInstalledCosVersion`;
    try {
      const response = await this.checkSystemVersions();

      const isVersionInstalled = response?.find(
        (x) => x.Version === this.newVersionToInstall
      );

      return isVersionInstalled ? 'VERSION_OK' : 'VERSION_NOT_OK';
    } catch (err) {
      console.log(logPrefix, err);
      return 'CHECK_INSTALLED_COS_VERSION_FAILED';
    }
  }

  private async checkDownloadedCosUpdates() {
    const logPrefix = `${UpdateManager.name}::checkDownloadedCosUpdates`;
    try {
      const response: CosUpdateVersion = await this.configAgentEndpoint.get(
        `/system/update`
      );

      const isUpdateAvailable = response?.Version === this.newVersionToInstall;

      return isUpdateAvailable ? 'UPDATE_AVAILABLE' : 'UPDATE_NOT_AVAILABLE';
    } catch (err) {
      console.log(logPrefix, err);
      return 'CHECK_COS_UPDATES_FAILED'; //TBD: or "UPDATE_NOT_AVAILABLE"?
    }
  }

  private async downloadCosUpdates() {
    const logPrefix = `${UpdateManager.name}::downloadCosUpdates`;
    try {
      const response: { Version: string } = await this.configAgentEndpoint.post(
        `/system/update/${this.newVersionToInstall}/download`,
        this.newVersionToInstall
      );

      const isDownloadStarted =
        true || response?.Version === this.newVersionToInstall;

      if (isDownloadStarted) {
        return 'COS_DOWNLOAD_STARTED';
      }
    } catch (err) {
      console.log(logPrefix, err);
      return 'START_DOWNLOAD_COS_UPDATES_FAILED';
    }
  }

  private async validateCosDownload() {
    const logPrefix = `${UpdateManager.name}::validateCosDownload`;
    try {
      const isCosDownloaded = await this.checkContinuously(
        this.checkCosDownloadStatus.bind(this),
        DOWNLOAD_STATUS_POLLING_INTERVAL_MS
      );
      if (isCosDownloaded) {
        return 'COS_DOWNLOADED';
      } //TBD else
    } catch (err) {
      console.log(logPrefix, err);
      return 'VALIDATE_COS_DOWNLOAD_FAILED';
    }
  }

  private async applyCosUpdates() {
    const logPrefix = `${UpdateManager.name}::applyCosUpdates`;
    try {
      const response: CosApplyUpdateRespons =
        await this.configAgentEndpoint.post(`/system/applyupdate`, {
          Title: '',
          Version: this.newVersionToInstall,
          Description: ''
        });

      const isCosUpdatesApplied = response?.Success;

      if (isCosUpdatesApplied) {
        return 'INSTALLING_COS';
      }
      //TBD: error/not successful cases
    } catch (err) {
      console.log(logPrefix, err);
      return 'APPLY_COS_UPDATES_FAILED';
    }
  }

  private async waitForSystemRestart() {
    const logPrefix = `${UpdateManager.name}::waitForSystemRestart`;
    try {
      const result = await this.checkContinuously(
        this.checkSystemVersions.bind(this),
        RESTART_STATUS_POLLING_INTERVAL_MS
      );
      if (result) {
        return 'SYSTEM_RESTARTED';
      }
    } catch (err) {
      console.log(logPrefix, err);
      return 'VALIDATE_COS_DOWNLOAD_FAILED';
    }
  }

  private async applyModuleUpdates() {
    const logPrefix = `${UpdateManager.name}::applyModuleUpdates`;

    try {
      const response = await this.apiEndpoint.get(
        `/applyModuleUpdates`,
        undefined,
        'response'
      );
      //TBD

      return 'MODULE_UPDATE_APPLIED';
    } catch (err) {
      return 'APPLY_MODULE_UPDATES_FAILED';
    }
  }

  private async waitForModuleUpdates(hasBackendRestarted = false) {
    const logPrefix = `${UpdateManager.name}::waitForModuleUpdates`;

    try {
      const result = await this.checkContinuously(
        this.checkSystemVersions.bind(this),
        CHECK_MODULE_UPDATE_STATUS_POLLING_INTERVAL_MS
      );

      if (result === 'ERROR') {
        // Expected status of backend being down due to restart, so after this a reachability of backend will show update was successful
        return this.waitForModuleUpdates(true);
      } else if (hasBackendRestarted) {
        return 'SUCCESS';
      } else {
        await sleep(CHECK_MODULE_UPDATE_STATUS_POLLING_INTERVAL_MS);
        return this.waitForModuleUpdates(false);
      }
    } catch (err) {
      console.log(logPrefix, err);
      return 'WAIT_FOR_MODULE_UPDATES_FAILED';
    }
  }

  private async checkContinuously(fn, msDelayBetweenCalls: number) {
    const logPrefix = `${UpdateManager.name}::checkContinuously`;
    console.log(logPrefix);
    return new Promise(async (resolve, reject) => {
      resolve(await fn());
    })
      .then(async (result) => {
        if (result) {
          return result;
        } else {
          // TBD Will unreachability error go to here or catch? To test after mockups are removed
          console.log('else');
          await sleep(msDelayBetweenCalls);
          return this.checkContinuously(fn, msDelayBetweenCalls);
        }
      })
      .catch((err) => {
        console.log('expected error');
        console.log(logPrefix, err);
        return 'ERROR';
      });
  }

  private async checkCosDownloadStatus() {
    try {
      const response: CosDownloadStatus = await this.configAgentEndpoint.get(
        `/system/update/download/status`
      );
      const isCosDownloaded = response?.PendingPackageCount === 0;

      return isCosDownloaded;
      //TBD: not connected case
      //TBD: what to do when failed packages exist?
    } catch (err) {
      //TBD will error be returned as failure or wait further? How long wait?
      console.log(err);
      return 'START_DOWNLOAD_COS_UPDATES_FAILED';
    }
  }

  private async checkSystemVersions(): Promise<Array<CosInstalledVersion>> {
    try {
      const response: Array<CosInstalledVersion> =
        await this.configAgentEndpoint.get(`/system/versions`);
      return response;
    } catch (e) {
      throw e;
    }
  }
}
