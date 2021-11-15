import { Component, OnInit, OnDestroy } from '@angular/core';
import { SystemInformationService } from 'app/services';

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

  constructor(private systemInfoService: SystemInformationService) {}

  ngOnInit() {
    this.systemInfoService.getServerTime().then((timestamp) => {
      this.serverOffset = Math.round(Date.now() / 1000) - timestamp;

      this.calculateTime();

      this.intervalId = setInterval(() => {
        this.calculateTime();
      }, 1000);

      this.serverLoading = false;
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  calculateTime() {
    this.time = new Date(Date.now() - this.serverOffset * 1000);
  }
}
