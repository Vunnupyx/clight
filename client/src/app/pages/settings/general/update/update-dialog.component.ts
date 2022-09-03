import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  SystemInformationService,
  UpdateStatus
} from 'app/services/system-information.service';
import { sleep } from 'app/shared/utils';
import { Subscription } from 'rxjs';

const UPDATE_POLLING_INTERVAL_MS = 1000; //10_000;
const UPDATE_TIMEOUT_MS = 10 * 60_000;

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

  constructor(
    private dialogRef: MatDialogRef<any, UpdateDialogResult>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private systemInformationService: SystemInformationService,
    private translate: TranslateService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.checkingForUpdates = true;
      const { startUpTime } = await this.systemInformationService.healthcheck();
      const status = await this.systemInformationService.getUpdateStatus();
      this.checkingForUpdates = false;

      if (status === UpdateStatus.UpToDate) {
        this.dialogRef.close({ status });
      }

      if (status === UpdateStatus.NeedsUpdate) {
        this.updateInProgress = true;
        await this.waitForUpdateComplete(startUpTime);
        this.dialogRef.close({ status: UpdateStatus.UpdateSuccessful });
      }
    } catch (err: any) {
      console.error(err);

      let errorText = this.translate.instant(
        'system-information.UpdateFailedCheckNetworkConfig'
      );
      if (err instanceof HttpErrorResponse && err.error) {
        try {
          const { error, code } = JSON.parse(err.error);
          errorText = code
            ? this.translate.instant(`system-information.UpdateFailed-${code}`)
            : error;
        } catch (e) {
          this.dialogRef.close({
            status: UpdateStatus.UnexpectedError
          });
        }
      } else if (err?.error?.message) {
        errorText = err.error.message;
      }
      this.dialogRef.close({
        status: UpdateStatus.CheckFailed,
        error: errorText
      });
    }
  }

  private async waitForUpdateComplete(systemStartTime: string) {
    const started = Date.now();

    while (!(await this.checkVersionChanged(systemStartTime))) {
      if (Date.now() - started > UPDATE_TIMEOUT_MS) {
        throw new Error(
          this.translate.instant('system-information.UpdateInstallFailed')
        );
      }

      await sleep(UPDATE_POLLING_INTERVAL_MS);
    }
  }

  private async checkVersionChanged(systemStartTime: string) {
    try {
      const { startUpTime } = await this.systemInformationService.healthcheck();
      return startUpTime != systemStartTime;
    } catch (err) {
      return false;
    }
  }
}
