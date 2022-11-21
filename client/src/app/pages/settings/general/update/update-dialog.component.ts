import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UpdateStatus } from 'app/services/system-information.service';
import { Subscription } from 'rxjs';
import { StateMachine } from './state-machine';
import { StateAndTransitions } from './state-machine/interfaces';

const UPDATE_POLLING_INTERVAL_MS = 1000; //10_000;
const UPDATE_TIMEOUT_MS = 10 * 60_000;
const UPDATE_FLOW: StateAndTransitions = {
  INIT: {
    transition: () =>
      new Promise((resolve) => setTimeout(() => resolve('START_UPDATE'), 500)),
    transitions: {
      START_UPDATE: 'GET_UPDATES'
    }
  },
  GET_UPDATES: {
    transition: () =>
      new Promise((resolve) => setTimeout(() => resolve('UPDATE_FOUND'), 500)),
    transitions: {
      UPDATE_FOUND: 'CHECK_INSTALLED_COS_VERSION',
      NO_UPDATE_FOUND: 'END'
    }
  },
  CHECK_INSTALLED_COS_VERSION: {
    transition: () =>
      new Promise((resolve) =>
        setTimeout(() => resolve('VERSION_NOT_OK'), 1500)
      ),
    transitions: {
      VERSION_OK: 'APPLY_MODULE_UPDATES',
      VERSION_NOT_OK: 'CHECK_COS_UPDATES'
    }
  },
  CHECK_COS_UPDATES: {
    transition: () =>
      new Promise((resolve) =>
        setTimeout(() => resolve('FAILED_TO_CHECK'), 1000)
      ),
    transitions: {
      UPDATE_AVAILABLE: 'APPLY_COS_UPDATES',
      UPDATE_NOT_AVAILABLE: 'START_DOWNLOAD_COS_UPDATES'
    }
  },
  START_DOWNLOAD_COS_UPDATES: {
    transition: () =>
      new Promise((resolve) =>
        setTimeout(() => resolve('COS_DOWNLOAD_STARTED'), 1000)
      ),
    transitions: {
      COS_DOWNLOAD_STARTED: 'VALIDATE_COS_DOWNLOAD'
    }
  },
  VALIDATE_COS_DOWNLOAD: {
    transition: () =>
      new Promise((resolve) =>
        setTimeout(() => resolve('COS_DOWNLOADED'), 1000)
      ),
    transitions: {
      COS_DOWNLOADED: 'APPLY_COS_UPDATES'
    }
  },
  APPLY_COS_UPDATES: {
    transition: () =>
      new Promise((resolve) =>
        setTimeout(() => resolve('INSTALLING_COS'), 1000)
      ),
    transitions: {
      INSTALLING_COS: 'WAITING_FOR_SYSTEM_RESTART'
    }
  },
  WAITING_FOR_SYSTEM_RESTART: {
    transition: () =>
      new Promise((resolve) =>
        setTimeout(() => resolve('SYSTEM_RESTARTED'), 1000)
      ),
    transitions: {
      SYSTEM_RESTARTED: 'APPLY_MODULE_UPDATES'
    }
  },
  APPLY_MODULE_UPDATES: {
    transition: () =>
      new Promise((resolve) =>
        setTimeout(() => resolve('MODULE_UPDATE_APPLIED'), 1000)
      ),
    transitions: {
      MODULE_UPDATE_APPLIED: 'WAIT_FOR_MODULE_UPDATE'
    }
  },
  WAIT_FOR_MODULE_UPDATE: {
    transition: () =>
      new Promise((resolve) => setTimeout(() => resolve('SUCCESS'), 1000)),
    transitions: {
      SUCCESS: 'END'
    }
  }
};

export interface UpdateDialogResult {
  status: UpdateStatus;
  error?: string;
}

@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.scss']
})
export class UpdateDialogComponent implements OnInit {
  sub = new Subscription();
  checkingForUpdates = false;
  updateInProgress = false;
  currentState = '';
  endReason = '';
  stateMachine: StateMachine;

  constructor(
    private dialogRef: MatDialogRef<any, UpdateDialogResult>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private translate: TranslateService
  ) {}

  async ngOnInit(): Promise<any> {
    Promise.race([this.checkTimeout(), this.update()]).catch((err) => {
      console.error(err);

      let errorText = '';
      if (err instanceof HttpErrorResponse && err.error) {
        try {
          const { error, code } = JSON.parse(err.error);
          errorText = code
            ? this.translate.instant(`system-information.UpdateFailed-${code}`)
            : error;
        } catch (e) {
          this.dialogRef.close({
            status: UpdateStatus.ERROR
          });
        }
      } else {
        errorText = this.endReason;
      }
      this.dialogRef.close({
        status: UpdateStatus.ERROR,
        error: this.endReason
      });
    });
  }

  private async update(): Promise<void> {
    this.checkingForUpdates = true;
    this.checkTimeout();

    const onStateChange = (newState: string, endReason?: string) => {
      this.currentState = newState;
      this.endReason = endReason;
      if (this.currentState === 'END') {
        this.checkingForUpdates = false;
        if (this.endReason === 'SUCCESS') {
          this.dialogRef.close({ status: UpdateStatus.SUCCESS });
        } else if (this.endReason === 'NO_UPDATE_FOUND') {
          this.dialogRef.close({ status: UpdateStatus.UP_TO_DATE });
        } else {
          this.dialogRef.close({
            status: UpdateStatus.ERROR,
            error: this.endReason //TBD different error cases
          });
        }
      } else if (this.currentState === 'CHECK_INSTALLED_COS_VERSION') {
        this.updateInProgress = true;
      }
    };
    this.stateMachine = new StateMachine(UPDATE_FLOW, onStateChange);

    await this.stateMachine.start();
  }

  private async checkTimeout() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.endReason = 'ERROR_TIMEOUT';
        reject();
      }, UPDATE_TIMEOUT_MS);
    });
  }
}
