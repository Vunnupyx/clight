import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ConfigurationAgentHttpService, HttpService } from 'app/shared';
import { UpdateManager } from './update-manager';

const UPDATE_TIMEOUT_MS = 30 * 60_000;

export interface UpdateDialogResult {
  status: string;
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
  currentState = 'GET_UPDATES';
  endReason = '';
  updateManager: UpdateManager;

  constructor(
    private dialogRef: MatDialogRef<any, UpdateDialogResult>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private translate: TranslateService,
    private configurationAgentHttpService: ConfigurationAgentHttpService,
    private httpService: HttpService
  ) {}

  get currentStateText(): string {
    return `system-information.UpdateStatus-${
      this.currentState === 'VALIDATE_COS_DOWNLOAD' &&
      this.updateManager.retryCount > 0
        ? 'VALIDATE_COS_DOWNLOAD-RETRYING'
        : this.currentState
    }`;
  }

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
          errorText = this.translate.instant(
            `system-information.UpdateFailed-CheckNetworkConfig`
          );
        }
      } else {
        errorText = this.translate.instant(
          `system-information.UpdateStatus-${this.endReason}`
        );
      }
      console.log(errorText);
      this.dialogRef.close({
        status: 'ERROR',
        error: errorText
      });
    });
  }

  private async update(): Promise<void> {
    this.checkingForUpdates = true;
    this.checkTimeout();
    this.updateManager = new UpdateManager(
      this.httpService,
      this.configurationAgentHttpService,
      this.onStateChange.bind(this)
    );
    await this.updateManager.start();
  }

  private async checkTimeout() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.endReason = 'ERROR_TIMEOUT';
        reject();
      }, UPDATE_TIMEOUT_MS);
    });
  }

  private onStateChange(newState: string, endReason?: string) {
    this.currentState = newState;
    this.endReason = endReason;
    if (this.currentState === 'END') {
      this.checkingForUpdates = false;
      if (this.endReason === 'SUCCESS') {
        this.dialogRef.close({ status: 'SUCCESS' });
      } else if (this.endReason === 'NO_UPDATE_FOUND') {
        this.dialogRef.close({ status: 'UP_TO_DATE' });
      } else {
        this.dialogRef.close({
          status: 'ERROR',
          error: this.translate.instant(
            `system-information.UpdateStatus-${this.endReason}`
          )
        });
      }
    } else if (this.currentState === 'CHECK_INSTALLED_COS_VERSION') {
      // From this step on it can show the status as update in progress
      this.updateInProgress = true;
    }
  }
}
