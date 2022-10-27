import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import {
  BackupService,
  SystemInformationService,
  TemplateService
} from 'app/services';
import { LocalStorageService } from 'app/shared';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LogsService } from 'app/services/logs.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  public showLoadingRestart = false;

  constructor(
    private backupService: BackupService,
    private logsService: LogsService,
    private systemInformationService: SystemInformationService,
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
    private templatesService: TemplateService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  get availableLangs() {
    return this.translate.langs;
  }

  get currentLang() {
    return this.translate.currentLang;
  }

  get currentTemplate() {
    return this.templatesService.currentTemplateName;
  }

  ngOnInit() {
    this.templatesService.getAvailableTemplates();
  }

  onLanguageChange(value: string) {
    this.translate.use(value);
    this.localStorageService.set('ui-lang', value);
  }

  async download() {
    await this.backupService.download();
  }

  async downloadLogs() {
    await this.logsService.download();
  }

  async restart() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(
        this.translate.instant('settings-general.RestartDeviceTitle'),
        this.translate.instant('settings-general.RestartDeviceText')
      )
    });

    dialogRef.afterClosed().subscribe(async (dialogResult) => {
      if (!dialogResult) {
        return;
      }

      this.showLoadingRestart = true;

      const success = await this.systemInformationService.restartDevice();

      if (!success) {
        this.toastr.error(
          this.translate.instant('settings-general.RestartDeviceError')
        );
        this.showLoadingRestart = false;
      } else {
        setTimeout(() => {
          this.toastr.success(
            this.translate.instant('settings-general.RestartDeviceSuccess')
          );

          this.showLoadingRestart = false;
        }, 2.5 * 60 * 1000); // Show loading indicator for 2.5 minutes
      }
    });
  }

  async onRestoreFileChange(event: any) {
    if (event.target.files[0]) {
      const file = event.target.files[0];

      try {
        const parsedJSON = JSON.parse(await file.text());
        await this.backupService.upload(file);
        this.toastr.success(
          this.translate.instant('settings-general.BackupHasBeenUploaded')
        );
        event.target.value = null;
      } catch (e) {
        this.toastr.error(
          this.translate.instant('settings-general.BackupFileInvalid')
        );
      }
    }
  }
}
