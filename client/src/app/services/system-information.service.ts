import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { HttpService } from '../shared';
import { Status, Store, StoreFactory } from '../shared/state';
import { SystemInformationSection } from '../models';
import { errorHandler } from '../shared/utils';
import { filter, map } from 'rxjs/operators';

export class SystemInformationState {
  status!: Status;
  sections!: SystemInformationSection[];
  serverOffset!: number;
}

@Injectable()
export class SystemInformationService {
  private _store: Store<SystemInformationState>;

  constructor(
    storeFactory: StoreFactory<SystemInformationState>,
    private httpService: HttpService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  get status() {
    return this._store.snapshot.status;
  }

  get sections() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.sections));
  }

  async getInfo() {
    this._store.patchState(() => ({
      status: Status.Loading,
      sections: []
    }));

    try {
      const sections = await this.httpService.get<SystemInformationSection[]>(
        `/systemInfo`
      );

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.sections = sections;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('system-information.LoadError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Ready
      }));
    }
  }

  async getServerTime(): Promise<number> {
    try {
      const response = await this.httpService.get<{ timestamp: number }>(
        `/systemInfo/time`
      );

      return response.timestamp;
    } catch {
      return 0;
    }
  }

  async restartDevice(): Promise<boolean> {
    try {
      await this.httpService.post(`/systemInfo/restart`, null);

      return true;
    } catch (e) {
      return true;
    }
  }

  async getServerTimeOffset(): Promise<number> {
    if (this._store.snapshot.serverOffset === undefined) {
      const time = await this.getServerTime();

      const offset = Math.round(Date.now() / 1000) - time;

      this._store.patchState((state) => {
        state.serverOffset = offset;
      });

      return offset;
    }

    return this._store.snapshot.serverOffset;
  }

  private _emptyState() {
    return <SystemInformationState>{
      status: Status.NotInitialized,
      serverOffset: 0 // TODO: remove it when backend is ready
    };
  }
}
