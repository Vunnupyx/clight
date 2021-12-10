import { Component, OnInit, OnDestroy } from '@angular/core';
import { SystemInformationService } from 'app/services';
import { AuthService } from 'app/shared';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit, OnDestroy {
  time = new Date();
  intervalId;

  serverLoading = true;

  private serverOffset = 0;
  private sub!: Subscription;

  get isClockVisible() {
    return !this.serverLoading && new Date(this.time).getFullYear() > 1970;
  }

  constructor(
    private authService: AuthService,
    private systemInfoService: SystemInformationService,
  ) {}

  ngOnInit() {
    this.syncTime();
    this.sub = this.authService.token$.pipe(filter(Boolean)).subscribe(() => {
      this.syncTime();
    });
    this.sub.add(this.authService.oldPassword$.subscribe(() => {
      this.syncTime(true);
    }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    clearInterval(this.intervalId);
  }

  syncTime(force = false) {
    if (!this.authService.token) {
      return;
    }
    this.systemInfoService.getServerTimeOffset(force).then((offset) => {
      this.serverOffset = offset;

      this.calculateTime();

      this.intervalId = setInterval(() => {
        this.calculateTime();
      }, 1000);

      this.serverLoading = false;
    });
  }

  calculateTime() {
    this.time = new Date(Date.now() - this.serverOffset * 1000);
  }
}
