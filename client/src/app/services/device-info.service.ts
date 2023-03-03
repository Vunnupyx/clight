import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { HttpService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { errorHandler } from 'app/shared/utils';
import { DeviceInfo } from 'app/models/device-info';

export class DeviceInfoState {
  status!: Status;
  deviceInfo!: DeviceInfo;
}

@Injectable()
export class DeviceInfoService {
  private _store: Store<DeviceInfoState>;

  constructor(
    storeFactory: StoreFactory<DeviceInfoState>,
    private httpService: HttpService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  get status() {
    return this._store.snapshot.status;
  }

  get deviceInfo() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.deviceInfo));
  }

  async getDeviceInfo() {
    this._store.patchState((state) => ({
      status: Status.Loading,
      deviceInfo: null
    }));

    try {
      const deviceInfo = await this.httpService.get<any>(`/deviceInfos`);
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.deviceInfo = deviceInfo;
      });
    } catch (err) {
      this.toastr.error(
        this.translate.instant('settings-device-info.LoadError')
      );
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  async updateDeviceInfo(obj: DeviceInfo) {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });

    try {
      await this.httpService.patch<any>(`/deviceInfos`, obj);
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.deviceInfo = obj;
      });
      this.toastr.success(
        this.translate.instant('settings-device-info.SaveSuccess')
      );
    } catch (err) {
      this.toastr.error(
        this.translate.instant('settings-device-info.UpdateError')
      );
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  private _emptyState() {
    return <DeviceInfoState>{
      status: Status.NotInitialized
    };
  }
}
