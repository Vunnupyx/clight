import { Injectable } from '@angular/core';
import { SystemInformationService } from 'app/services';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/shared';
import { take } from 'rxjs/operators';

const MAX_BROWSER_TIME_VS_SYSTEM_TIME_SEC = 15 * 60; // 15 minutes

@Injectable({
  providedIn: 'root'
})
export class TimeSyncCheckService {
  time = new Date();
  intervalId;
  warnBrowserTimeVsSystemTimeShown = false;

  private serverOffset = 0;

  constructor(
    private authService: AuthService,
    private systemInfoService: SystemInformationService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router
  ) {}

  async checkTimeDifference(force = false) {
    if (!this.authService.token) {
      return;
    }
    this.serverOffset = await this.systemInfoService.getServerTimeOffset(force);

    this.calculateTime();
    this.warnBrowserTimeVsSystemTime();

    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.checkTimeDifference();
      }, 1000);
    }
  }

  warnBrowserTimeVsSystemTime() {
    if (this.warnBrowserTimeVsSystemTimeShown) {
      return;
    }
    if (
      typeof this.serverOffset !== 'undefined' &&
      Math.abs(this.serverOffset) < MAX_BROWSER_TIME_VS_SYSTEM_TIME_SEC
    ) {
      return;
    }
    this.toastr
      .warning(
        this.translate.instant('clock.WarningSystemTimeVsBrowserTime'),
        undefined,
        { disableTimeOut: true }
      )
      .onTap.pipe(take(1))
      .subscribe(() => this.router.navigate(['/settings/network']));
    this.warnBrowserTimeVsSystemTimeShown = true;
  }

  calculateTime() {
    this.time = new Date(Date.now() - this.serverOffset * 1000);
  }
}
