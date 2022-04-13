import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SystemInformationService } from 'app/services/system-information.service';
import { Subscription } from 'rxjs';

export interface UpdateDialogResult {
  status: UpdateDialogResultStatus;
  error?: string;
}

export enum UpdateDialogResultStatus {
  UpToDate,
  NeedsUpdate,
  Failed,
  Dismissed,
}

@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.scss']
})
export class UpdateDialogComponent implements OnInit {

  isBusy = false;
  sub = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<any, UpdateDialogResult>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private systemInformationService: SystemInformationService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.isBusy = true;
      const result = await this.systemInformationService.getUpdateStatus();
      this.dialogRef.close({ status: UpdateDialogResultStatus.NeedsUpdate });
    } catch (error: any) {
      const errorText = error.error.error;
      this.dialogRef.close({ status: UpdateDialogResultStatus.Failed, error: errorText });
    } finally { 
      this.isBusy = false;
    }
  }
}
