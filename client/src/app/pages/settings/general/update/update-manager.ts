import { StateMachine, StateAndTransitions } from './state-machine';
import { ConfigurationAgentHttpService, HttpService } from 'app/shared';
import { sleep, compareSemanticVersion } from 'app/shared/utils';
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

interface CosAvailableUpdateFormat {
  release: string;
  BaseLayerVersion: string;
  releaseNotes: string;
  OSVersion: string;
  releaseNotesMissingReason: string;
}

interface CosAvailableUpdates {
  message: string;
  updates: Array<CosAvailableUpdateFormat>;
}

const DOWNLOAD_STATUS_POLLING_INTERVAL_MS = 5_000;
const CHECK_DOWNLOADED_POLLING_INTERVAL_MS = 5_000;
const RESTART_STATUS_POLLING_INTERVAL_MS = 5_000;
const CHECK_MODULE_UPDATE_STATUS_POLLING_INTERVAL_MS = 5_000;

/**
 * CELOS Software Update Manager
 */
export class UpdateManager {
  public retryCount = 0;

  private stateMachine: StateMachine;
  private startState = 'GET_UPDATES';
  private newReleaseToInstall = '';
  private newBaseLayerVersionToInstall = '';
  private newOsVersionToInstall = '';
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

  /**
   * Starts the state machine to check CELOS updates
   */
  public async start() {
    this.stateMachine = new StateMachine(
      this.updateFlow,
      this.onStateChange,
      this.startState
    );
    await this.stateMachine.start();
  }

  /**
   * Gets new available versions and decides if there is a newer version available
   */
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

        const newestVersion =
          this.findNewestAvailableVersion(availableVersions);
        this.newReleaseToInstall = newestVersion.release;
        this.newBaseLayerVersionToInstall = newestVersion.BaseLayerVersion;
        this.newOsVersionToInstall = newestVersion.OSVersion;

        if (!this.newReleaseToInstall || !this.newBaseLayerVersionToInstall) {
          console.log(
            `${logPrefix} could not find release or BaseLayerVersion`
          );
          //TBD
        }
        return 'UPDATE_FOUND';
      }
    } catch (err) {
      console.log(logPrefix, err);
      return 'UNEXPECTED_ERROR';
    }
  }

  /**
   * Checks installed CELOS Version
   */
  private async checkInstalledCosVersion() {
    const logPrefix = `${UpdateManager.name}::checkInstalledCosVersion`;
    try {
      const response = await this.checkSystemVersions();

      const installedOsVersion = response?.find(
        (x) => x.Name === 'COS'
      )?.Version;
      const resultOfVersionComparison = compareSemanticVersion(
        installedOsVersion,
        this.newOsVersionToInstall
      );

      const isCorrectVersionInstalled =
        typeof resultOfVersionComparison === 'number' &&
        resultOfVersionComparison < 1;

      return isCorrectVersionInstalled ? 'VERSION_OK' : 'VERSION_NOT_OK';
    } catch (err) {
      console.log(logPrefix, err);
      return 'UNEXPECTED_ERROR';
    }
  }

  /**
   * Checks if desired CELOS update version already downloaded
   */
  private async checkDownloadedCosUpdates() {
    const logPrefix = `${UpdateManager.name}::checkDownloadedCosUpdates`;
    try {
      const response: CosUpdateVersion = await this.configAgentEndpoint.get(
        `/system/update`
      );

      const isUpdateAvailable =
        response?.Version === this.newOsVersionToInstall;

      return isUpdateAvailable ? 'UPDATE_AVAILABLE' : 'UPDATE_NOT_AVAILABLE';
    } catch (err) {
      console.log(logPrefix, err);
      return 'UNEXPECTED_ERROR';
    }
  }

  /**
   * Triggers download of new CELOS version
   */
  private async downloadCosUpdates() {
    const logPrefix = `${UpdateManager.name}::downloadCosUpdates`;
    try {
      const response: { Version: string } = await this.configAgentEndpoint.post(
        `/system/update/${this.newOsVersionToInstall}/download`,
        null,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const isDownloadStarted =
        true || response?.Version === this.newOsVersionToInstall;

      if (isDownloadStarted) {
        return 'COS_DOWNLOAD_STARTED';
      }
    } catch (err) {
      console.log(logPrefix, err);
      return 'UNEXPECTED_ERROR';
    }
  }

  /**
   * Validates downloaded CELOS Version
   */
  private async checkCosDownloaded() {
    const response: { Version: string } | null =
      await this.configAgentEndpoint.get(`/system/update`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

    if (response && response.Version === this.newOsVersionToInstall) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Validates downloaded CELOS Version
   */
  private async validateCosDownload() {
    const logPrefix = `${UpdateManager.name}::validateCosDownload`;
    try {
      const downloadStatus: checkDownloadStatus = await this.checkContinuously(
        this.checkCosDownloadStatus.bind(this),
        DOWNLOAD_STATUS_POLLING_INTERVAL_MS
      );

      if (downloadStatus === 'success') {
        //! GET https://<ip>/configuration-agent/v1/system/update is required! If not executed, applying the update does not work!
        const cosDownloaded: checkDownloadStatus = await this.checkContinuously(
          this.checkCosDownloaded.bind(this),
          CHECK_DOWNLOADED_POLLING_INTERVAL_MS,
          24
        );

        if (cosDownloaded) {
          return 'COS_DOWNLOADED';
        } else {
          return 'UNEXPECTED_ERROR';
        }
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

  /**
   * Applies downloadaed CELOS update
   */
  private async applyCosUpdates() {
    const logPrefix = `${UpdateManager.name}::applyCosUpdates`;
    try {
      const response: CosApplyUpdateResponse =
        await this.configAgentEndpoint.post(`/system/applyupdate`, {
          Title: '',
          Version: this.newOsVersionToInstall,
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

  /**
   * Checks if the system has been shut down
   */
  private async checkSystemShutdown() {
    try {
      await this.configAgentEndpoint.get(`/system/versions`);
      return false;
    } catch (e) {
      return true;
    }
  }

  /**
   * Checks if the system has been restarted
   */
  private async checkSystemRestart() {
    try {
      await this.configAgentEndpoint.get(`/system/versions`);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Waits for system restart to detect that CELOS update successfully applied
   */
  private async waitForSystemRestart() {
    const logPrefix = `${UpdateManager.name}::waitForSystemRestart`;
    try {
      await this.checkContinuously(
        this.checkSystemShutdown.bind(this),
        RESTART_STATUS_POLLING_INTERVAL_MS
      );

      await this.checkContinuously(
        this.checkSystemRestart.bind(this),
        RESTART_STATUS_POLLING_INTERVAL_MS
      );

      return 'SYSTEM_RESTARTED';
    } catch (err) {
      console.log(logPrefix, err);
      return 'UNEXPECTED_ERROR';
    }
  }

  /**
   * Triggers applying module software updates
   */
  private async applyModuleUpdates() {
    const logPrefix = `${UpdateManager.name}::applyModuleUpdates`;

    try {
      const response = await this.httpService.post(
        `/systemInfo/update`,
        {
          release: this.newReleaseToInstall,
          baseLayerVersion: this.newBaseLayerVersionToInstall
        },
        {
          observe: 'response'
        } as any
      );
      const statusCode: number = response.status;

      if (statusCode === 202) {
        const versionInstalling = response.body?.version;
        const message = response.body?.message;

        return 'MODULE_UPDATE_APPLIED';
      } else {
        console.log(response.body);
        return 'UNEXPECTED_ERROR';
      }
    } catch (err) {
      return 'UNEXPECTED_ERROR';
    }
  }

  /**
   * Waits for module updates by waiting for backend to restart in between
   * @param hasBackendRestarted
   * @returns
   */
  private async waitForModuleUpdates(hasBackendRestarted = false) {
    const logPrefix = `${UpdateManager.name}::waitForModuleUpdates`;

    try {
      const result = await this.checkContinuously(
        this.checkSystemVersions.bind(this),
        CHECK_MODULE_UPDATE_STATUS_POLLING_INTERVAL_MS
      );
      if (result === 'ERROR') {
        // Expected status of configuration agent being down due to restart, so after this a reachability will show update was successful
        await sleep(DOWNLOAD_STATUS_POLLING_INTERVAL_MS);
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

  /**
   * Periodically checks given Promise with given delay until it resolves
   *
   * @param fn function that returns a Promise to check periodically
   * @param msDelayBetweenCalls delay between checks
   * @param maxRetryCount max retries until the function returns the last result
   * @returns
   */
  private async checkContinuously(
    fn: () => Promise<any>,
    msDelayBetweenCalls: number,
    maxRetryCount: number = null
  ) {
    const logPrefix = `${UpdateManager.name}::checkContinuously`;
    return fn()
      .then(async (result) => {
        if (result || (maxRetryCount !== null && maxRetryCount <= 0)) {
          return result;
        } else {
          await sleep(msDelayBetweenCalls);
          return this.checkContinuously(
            fn,
            msDelayBetweenCalls,
            maxRetryCount !== null ? maxRetryCount - 1 : null
          );
        }
      })
      .catch((err) => {
        // When server is down response is 502, so it will come here as expected
        return 'ERROR';
      });
  }

  /**
   * Checks download status of CELOS update
   */
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

  /**
   * Returns system time from backend. Used as checking availability of backend
   */
  private async checkRuntimeHealth(): Promise<HealthcheckResponse> {
    return await this.httpService.get<HealthcheckResponse>(`/healthcheck`);
  }

  /**
   * Gets installed CELOS version from configuration agent
   */
  private async checkSystemVersions(): Promise<Array<CosInstalledVersion>> {
    try {
      const response: Array<CosInstalledVersion> =
        await this.configAgentEndpoint.get(`/system/versions`);
      return response;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Finds newest semantic version among given available versions
   * @param availableVersions
   */
  private findNewestAvailableVersion(
    availableVersions: CosAvailableUpdates['updates']
  ): CosAvailableUpdateFormat {
    const sortedVersions = availableVersions.sort((first, second) =>
      compareSemanticVersion(first.release, second.release)
    );

    return sortedVersions[0];
  }
}
