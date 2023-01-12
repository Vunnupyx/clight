import { StateMachine, StateAndTransitions } from './state-machine';
import { ConfigurationAgentHttpService, HttpService } from 'app/shared';
import { sleep } from 'app/shared/utils';
import { HealthcheckResponse } from 'app/services';

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

type checkDownloadStatus = 'success' | 'fail' | 'not_connected';

interface CosApplyUpdateResponse {
  Title: string;
  Version: string;
  Success: boolean;
  Error: string;
}

interface CosAvailableUpdates {
  message: string;
  updates: Array<{
    release: string;
    BaseLayerVersion: string;
    releaseNotes: string;
    OSVersion: string;
    releaseNotesMissingReason: string;
  }>;
}

const DOWNLOAD_STATUS_POLLING_INTERVAL_MS = 5_000;
const RESTART_STATUS_POLLING_INTERVAL_MS = 5_000;
const CHECK_MODULE_UPDATE_STATUS_POLLING_INTERVAL_MS = 5_000;

export class UpdateManager {
  public retryCount = 0;

  private stateMachine: StateMachine;
  private startState = 'GET_UPDATES';
  private newVersionToInstall = '';
  private newBaseLayerVersionToInstall = '';
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
    private httpService: HttpService,
    private configAgentEndpoint: ConfigurationAgentHttpService,
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
      const response = await this.httpService.get(`/systemInfo/update`, {
        observe: 'response'
      } as any);

      const statusCode: number = response.status;
      if (statusCode === 204) {
        return 'NO_UPDATE_FOUND';
      } else if (statusCode === 503) {
        return 'UNEXPECTED_ERROR';
      } else if (statusCode === 200) {
        let responseBody: CosAvailableUpdates = response.body;
        const availableVersions = responseBody?.updates;
        if (!availableVersions) {
          return 'UNEXPECTED_ERROR';
        } else if (availableVersions.length === 0) {
          return 'NO_UPDATE_FOUND';
        }
        //TBD availableVersions[0]?
        this.newVersionToInstall = availableVersions[0].release;
        this.newBaseLayerVersionToInstall =
          availableVersions[0].BaseLayerVersion;

        if (!this.newVersionToInstall || !this.newBaseLayerVersionToInstall) {
          //TBD
        }
        return 'UPDATE_FOUND';
      }
    } catch (err) {
      console.log(logPrefix, err);
      return 'UNEXPECTED_ERROR';
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
      return 'UNEXPECTED_ERROR';
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
      return 'UNEXPECTED_ERROR';
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
      return 'UNEXPECTED_ERROR';
    }
  }

  private async validateCosDownload() {
    const logPrefix = `${UpdateManager.name}::validateCosDownload`;
    try {
      const downloadStatus: checkDownloadStatus = await this.checkContinuously(
        this.checkCosDownloadStatus.bind(this),
        DOWNLOAD_STATUS_POLLING_INTERVAL_MS
      );
      if (downloadStatus === 'success') {
        return 'COS_DOWNLOADED';
      } else if (downloadStatus === 'fail') {
        if (this.retryCount === 3) {
          return 'UNEXPECTED_ERROR';
        } else {
          this.retryCount++;
          await sleep(DOWNLOAD_STATUS_POLLING_INTERVAL_MS);
          return this.validateCosDownload();
        }
      } else if (downloadStatus === 'not_connected') {
        return 'NO_CONNECTION';
      }
    } catch (err) {
      console.log(logPrefix, err);
      return 'UNEXPECTED_ERROR';
    }
  }

  private async applyCosUpdates() {
    const logPrefix = `${UpdateManager.name}::applyCosUpdates`;
    try {
      const response: CosApplyUpdateResponse =
        await this.configAgentEndpoint.post(`/system/applyupdate`, {
          Title: '',
          Version: this.newVersionToInstall,
          Description: ''
        });

      const isCosUpdatesApplied = response?.Success;

      if (isCosUpdatesApplied) {
        return 'INSTALLING_COS';
      } else {
        return 'UNEXPECTED_ERROR';
      }
    } catch (err) {
      console.log(logPrefix, err);
      return 'UNEXPECTED_ERROR';
    }
  }

  private async waitForSystemRestart() {
    const logPrefix = `${UpdateManager.name}::waitForSystemRestart`;
    try {
      const result = await this.checkContinuously(
        this.checkSystemVersions.bind(this),
        RESTART_STATUS_POLLING_INTERVAL_MS
      );
      if (result === 'ERROR') {
        return 'UNEXPECTED_ERROR';
      } else if (result) {
        return 'SYSTEM_RESTARTED';
      }
    } catch (err) {
      console.log(logPrefix, err);
      return 'UNEXPECTED_ERROR';
    }
  }

  private async applyModuleUpdates() {
    const logPrefix = `${UpdateManager.name}::applyModuleUpdates`;

    try {
      const response = await this.httpService.post(
        `/systemInfo/update`,
        {
          release: this.newVersionToInstall,
          baseLayerVersion: this.newBaseLayerVersionToInstall
        },
        {
          observe: 'response'
        } as any
      );
      const statusCode: number = response.status;

      if (statusCode === 202) {
        //TBD version can be read from response
        return 'MODULE_UPDATE_APPLIED';
      } else {
        //TBD error can be read from response
        return 'UNEXPECTED_ERROR';
      }
    } catch (err) {
      return 'UNEXPECTED_ERROR';
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
        // Expected status of configuration agent being down due to restart, so after this a reachability will show update was successful
        return this.waitForModuleUpdates(true);
      } else if (hasBackendRestarted) {
        //With healthcheck make sure runtime is also running
        const healthCheckResponse = await this.checkContinuously(
          this.checkRuntimeHealth.bind(this),
          CHECK_MODULE_UPDATE_STATUS_POLLING_INTERVAL_MS
        );
        if (healthCheckResponse) {
          return 'SUCCESS';
        } else {
          //TBD is this Else a use case? it is already waiting through checkContinuously
        }
      } else {
        await sleep(CHECK_MODULE_UPDATE_STATUS_POLLING_INTERVAL_MS);
        return this.waitForModuleUpdates(false);
      }
    } catch (err) {
      console.log(logPrefix, err);
      return 'UNEXPECTED_ERROR';
    }
  }

  private async checkContinuously(fn, msDelayBetweenCalls: number) {
    const logPrefix = `${UpdateManager.name}::checkContinuously`;
    return new Promise(async (resolve, reject) => {
      resolve(await fn());
    })
      .then(async (result) => {
        if (result) {
          return result;
        } else {
          // TBD Will unreachability error go to here or catch? To test after mockups are removed
          await sleep(msDelayBetweenCalls);
          return this.checkContinuously(fn, msDelayBetweenCalls);
        }
      })
      .catch((err) => {
        console.log(logPrefix, err);
        return 'ERROR';
      });
  }

  private async checkCosDownloadStatus(): Promise<checkDownloadStatus> {
    const logPrefix = `${UpdateManager.name}::checkCosDownloadStatus`;
    try {
      const response: CosDownloadStatus = await this.configAgentEndpoint.get(
        `/system/update/download/status`
      );
      let status: checkDownloadStatus;
      if (response?.Connected === false) {
        status = 'not_connected';
      } else if (response?.FailedPackageCount > 0) {
        status = 'fail';
      } else if (response?.PendingPackageCount === 0) {
        status = 'success';
      }

      return status;
    } catch (err) {
      console.log(logPrefix, err);
      return 'fail';
    }
  }

  private async checkRuntimeHealth() {
    return await this.httpService.get<HealthcheckResponse>(`/healthcheck`);
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
