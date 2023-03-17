import { Component, OnInit } from '@angular/core';
import { CommissioningService, DeviceInfoService } from 'app/services';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DeviceInfo } from 'app/models/device-info';
import { Router } from '@angular/router';

@Component({
  selector: 'app-commissioning',
  templateUrl: './commissioning.component.html',
  styleUrls: ['./commissioning.component.scss']
})
export class CommissioningComponent implements OnInit {
  sub = new Subscription();
  deviceInfo: DeviceInfo;
  registration: boolean;

  constructor(
    private deviceInfoService: DeviceInfoService,
    private commissioningService: CommissioningService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.deviceInfoService.deviceInfo
        .pipe(distinctUntilChanged())
        .subscribe((x) => this.onDeviceInfo(x))
    );
    this.sub.add(
      this.commissioningService.registration
        .pipe(distinctUntilChanged())
        .subscribe((x) => (this.registration = x))
    );

    this.deviceInfoService.getDeviceInfo();
    this.commissioningService.getRegistrationStatus();
  }

  async onApply() {
    await this.commissioningService
      .apply()
      .then(() => this.router.navigate(['/settings/data-mapping']));
  }

  isEmpty(obj: Record<string, any>): boolean {
    if (!obj || Object.keys(obj).length === 0) return false;

    return Object.values(obj).some((x) => x !== null && x !== '');
  }

  private onDeviceInfo(x: DeviceInfo) {
    this.deviceInfo = { ...x };
  }
}
