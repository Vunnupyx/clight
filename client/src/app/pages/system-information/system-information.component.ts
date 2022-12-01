import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { SystemInformationService, UpdateStatus } from '../../services';
import { SystemInformationSection } from '../../models';
import { environment } from '../../../environments/environment';
import { MaterialThemeVersion } from 'app/app.component';

import {
  UpdateDialogComponent,
  UpdateDialogResult
} from '../settings/general/update/update-dialog.component';
import {
  AlertDialogComponent,
  AlertDialogModel
} from 'app/shared/components/alert-dialog/alert-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from 'app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-system-information',
  templateUrl: './system-information.component.html',
  styleUrls: ['./system-information.component.scss']
})
export class SystemInformationComponent implements OnInit, OnDestroy {
  readonly MaterialThemeVersion = MaterialThemeVersion;
  public showLoadingFactoryReset = false;

  data: SystemInformationSection[] = [];

  private sub: Subscription = new Subscription();

  constructor(
    private systemInformationService: SystemInformationService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.systemInformationService.sections.subscribe((x) => this.onData(x))
    );

    this.systemInformationService.getInfo();
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }

  async update() {
    const dialogRef = this.dialog.open(UpdateDialogComponent, {
      disableClose: true,
      width: '650px'
    });

    dialogRef.afterClosed().subscribe(async (result: UpdateDialogResult) => {
      if (result.status === UpdateStatus.Dismissed) {
        return;
      }
      if (result.status === UpdateStatus.UpToDate) {
        const alertRef = this.dialog.open(AlertDialogComponent, {
          disableClose: true,
          width: '650px',
          data: {
            type: 'success',
            title: this.translate.instant(
              'system-information.YourSystemUpToDate'
            ),
            confirmText: this.translate.instant('common.OK'),
            hideCancelButton: true
          } as AlertDialogModel
        });
      }
      if (result.status === UpdateStatus.UpdateSuccessful) {
        const alertRef = this.dialog.open(AlertDialogComponent, {
          disableClose: true,
          width: '650px',
          data: {
            type: 'success',
            title: this.translate.instant(
              'system-information.YourSystemUpdateSuccess'
            ),
            content: this.translate.instant(
              result.error || 'system-information.YourSystemUpdateSuccessDescr'
            ),
            confirmText: this.translate.instant('common.OK'),
            hideCancelButton: true
          } as AlertDialogModel
        });
      }
      if (result.status === UpdateStatus.CheckFailed) {
        const alertRef = this.dialog.open(AlertDialogComponent, {
          disableClose: true,
          width: '650px',
          data: {
            type: 'error',
            title: this.translate.instant('system-information.UpdateFailed'),
            content: this.translate.instant(
              result.error || 'settings-general.UpdateFailedCheckNetworkConfig'
            ),
            confirmText: this.translate.instant('common.OK'),
            hideCancelButton: true
          } as AlertDialogModel
        });
      }
      if (result.status === UpdateStatus.UnexpectedError) {
        const alertRef = this.dialog.open(AlertDialogComponent, {
          disableClose: true,
          width: '650px',
          data: {
            type: 'error',
            title: this.translate.instant('system-information.UpdateFailed'),
            content: this.translate.instant(
              result.error || 'settings-general.UnknownError'
            ),
            confirmText: this.translate.instant('common.OK'),
            hideCancelButton: true
          } as AlertDialogModel
        });
      }
    });
  }

  async factoryReset() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(
        this.translate.instant('system-information.FactoryResetDeviceTitle'),
        this.translate.instant('system-information.FactoryResetDeviceText')
      )
    });

    dialogRef.afterClosed().subscribe(async (dialogResult) => {
      if (!dialogResult) {
        return;
      }

      this.showLoadingFactoryReset = true;

      const success = await this.systemInformationService.factoryReset();

      if (!success) {
        this.toastr.error(
          this.translate.instant('system-information.FactoryResetError')
        );
        this.showLoadingFactoryReset = false;
      } else {
        setTimeout(() => {
          this.toastr.success(
            this.translate.instant('system-information.FactoryResetSuccess')
          );

          this.showLoadingFactoryReset = false;
        }, 1 * 60 * 1000); // TBD Show loading indicator for 1 minute
      }
    });
  }

  private onData(x: SystemInformationSection[]) {
    // replace web ui version
    const modifiedData = JSON.parse(
      JSON.stringify(x).replace(
        '$ui_version$',
        environment.version || 'unknown'
      )
    );

    // Inject CELOS X material theme version
    if (modifiedData && modifiedData[1]) {
      modifiedData[1]?.items.push({
        key: 'CELOS X material theme version',
        keyDescription: this.translate.instant(
          'system-information.SoftwareComponent'
        ),
        value: MaterialThemeVersion,
        valueDescription: ''
      });
    }

    this.data = modifiedData;
  }
}
