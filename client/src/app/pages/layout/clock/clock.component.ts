import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NetworkService, SystemInformationService } from 'app/services';
import { AuthService } from 'app/shared';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

const MAX_BROWSER_TIME_VS_SYSTEM_TIME_SEC = 15 * 60; // 15 minutes

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit, OnDestroy {
  time = new Date();
  intervalId;

  serverLoading = true;
  warnBrowserTimeVsSystemTimeShown = false;

  private serverOffset = 0;
  private sub!: Subscription;

  get isClockVisible() {
    return !this.serverLoading && new Date(this.time).getFullYear() > 1970;
  }

  constructor(
    private authService: AuthService,
    private networkService: NetworkService,
    private systemInfoService: SystemInformationService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.syncTime();
    this.sub = this.authService.token$.pipe(filter(Boolean)).subscribe(() => {
      this.syncTime();
    });
    this.sub.add(
      this.authService.oldPassword$.subscribe(() => {
        this.syncTime(true);
      })
    );
    this.sub.add(
      this.networkService.config.pipe(filter(Boolean)).subscribe(() => {
        this.syncTime(true);
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    clearInterval(this.intervalId);
  }

  async syncTime(force = false) {
    if (!this.authService.token) {
      return;
    }
    this.serverOffset = await this.systemInfoService.getServerTimeOffset(force);

    this.calculateTime();
    this.warnBrowserTimeVsSystemTime();

    this.intervalId = setInterval(() => {
      this.calculateTime();
    }, 1000);

    this.serverLoading = false;
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
    this.toastr.warning(
      this.translate.instant('clock.WarningSystemTimeVsBrowserTime'),
      undefined,
      { disableTimeOut: true }
    );
    this.warnBrowserTimeVsSystemTimeShown = true;
  }

  calculateTime() {
    this.time = new Date(Date.now() - this.serverOffset * 1000);
  }
}
