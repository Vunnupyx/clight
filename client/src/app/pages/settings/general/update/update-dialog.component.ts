import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SystemInformationService, UpdateStatus } from 'app/services/system-information.service';
import { sleep } from 'app/shared/utils';
import { Subscription } from 'rxjs';

const UPDATE_POLLING_INTERVAL_MS = 1000;//10_000;
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
  updateInProgress = false;

  constructor(
    private dialogRef: MatDialogRef<any, UpdateDialogResult>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private systemInformationService: SystemInformationService,
    private translate: TranslateService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    try {
      const {version} = await this.systemInformationService.healthcheck();
      const status = await this.systemInformationService.getUpdateStatus();
      
      if (status === UpdateStatus.UpToDate) {
        this.dialogRef.close({ status });
      }
      
      if (status === UpdateStatus.NeedsUpdate) {
        this.updateInProgress = true;
        await this.waitForUpdateComplete(version);
        this.dialogRef.close({ status: UpdateStatus.UpdateSuccessful });
      }
      
    } catch (error: any) {
      console.error(error);

      const errorText = error?.error?.error || error?.toString();
      this.dialogRef.close({ status: UpdateStatus.CheckFailed, error: errorText });
    }
  }
  
  private async waitForUpdateComplete(installedVersion: string) {
    const started = Date.now();

    while (!await this.checkVersionChanged(installedVersion)) {

      if (Date.now() - started > UPDATE_TIMEOUT_MS) {
        throw new Error(this.translate.instant('system-general.UpdateInstallFailed'))
      }

      await sleep(UPDATE_POLLING_INTERVAL_MS);
    }


  }

  private async checkVersionChanged(installedVersion: string) {
    try {
      const {version} = await this.systemInformationService.healthcheck();
      return version != installedVersion;
    } catch (err) {
      return false;
    }
  }

}
