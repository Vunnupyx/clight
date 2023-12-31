import { Component, OnInit } from '@angular/core';

import { DeviceInfoService } from 'app/services';
import { Subscription } from 'rxjs';
import { Status } from '../../../../shared/state';
import { DeviceInfo } from '../../../../models/device-info';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.scss']
})
export class DeviceInfoComponent implements OnInit {
  sub = new Subscription();

  deviceInfo: DeviceInfo = {
    model: '',
    manufacturer: '',
    control: '',
    serialNumber: ''
  };

  get isBusy() {
    return this.deviceInfoService.status != Status.Ready;
  }

  constructor(
    private translate: TranslateService,
    private deviceInfoService: DeviceInfoService
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.deviceInfoService.deviceInfo
        .pipe(distinctUntilChanged())
        .subscribe((x) => this.onDeviceInfo(x))
    );

    this.deviceInfoService.getDeviceInfo();
  }

  onSave(form: NgForm) {
    this.deviceInfoService
      .updateDeviceInfo(this.deviceInfo)
      .then(() => form.resetForm(this.deviceInfo));
  }

  private onDeviceInfo(x: DeviceInfo) {
    this.deviceInfo = { ...x };
  }
}
