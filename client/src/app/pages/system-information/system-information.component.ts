import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

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

@Component({
  selector: 'app-system-information',
  templateUrl: './system-information.component.html',
  styleUrls: ['./system-information.component.scss']
})
export class SystemInformationComponent implements OnInit, OnDestroy {
  readonly MaterialThemeVersion = MaterialThemeVersion;

  data: SystemInformationSection[] = [];

  private sub: Subscription = new Subscription();

  constructor(
    private systemInformationService: SystemInformationService,
    private translate: TranslateService,
    private dialog: MatDialog
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
        case UpdateStatus.UP_TO_DATE:
          type = 'success';
          title = this.translate.instant(
            'system-information.YourSystemUpToDate'
          );
          break;
        case UpdateStatus.SUCCESS:
          type = 'success';
          title = this.translate.instant(
            'system-information.YourSystemUpdateSuccess'
          );
          content = this.translate.instant(
            result.error || 'system-information.YourSystemUpdateSuccessDescr'
          );
          break;
        case UpdateStatus.ERROR:
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
