import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { SystemInformationService } from '../../services';
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
      let title, type, content;
      switch (result.status) {
        case 'UP_TO_DATE':
          type = 'success';
          title = this.translate.instant(
            'system-information.YourSystemUpToDate'
          );
          break;
        case 'SUCCESS':
          type = 'success';
          title = this.translate.instant(
            'system-information.YourSystemUpdateSuccess'
          );
          content = this.translate.instant(
            result.error || 'system-information.YourSystemUpdateSuccessDescr'
          );
          break;
        case 'ERROR':
          type = 'error';
          title = this.translate.instant('system-information.UpdateFailed');
          content = result.error;

          break;
        default:
          break;
      }

      const alertRef = this.dialog.open(AlertDialogComponent, {
        disableClose: true,
        width: '650px',
        data: {
          type,
          title,
          content,
          confirmText: this.translate.instant('common.OK'),
          hideCancelButton: true
        } as AlertDialogModel
      });
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

      this.systemInformationService.factoryReset(); // without await, as connection will be lost and it will keep waiting for a response

      setTimeout(() => {
        this.toastr.success(
          this.translate.instant('system-information.FactoryResetSuccess')
        );

        this.showLoadingFactoryReset = false;
      }, 5 * 60 * 1000); //Show loading indicator for 5 minute
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
