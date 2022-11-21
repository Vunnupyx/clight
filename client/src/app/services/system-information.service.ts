import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import {
  ConfigurationAgentHttpMockupService,
  HttpService,
  RequestOptionsArgs
} from '../shared';
import { Status, Store, StoreFactory } from '../shared/state';
import { SystemInformationSection } from '../models';
import { errorHandler } from '../shared/utils';
import { filter, map } from 'rxjs/operators';

export class SystemInformationState {
  status!: Status;
  sections!: SystemInformationSection[];
  serverOffset!: number;
}

export enum UpdateStatus {
  UP_TO_DATE,
  GET_UPDATES,
  CHECK_INSTALLED_COS_VERSION,
  CHECK_COS_UPDATES,
  START_DOWNLOAD_COS_UPDATES,
  VALIDATE_COS_DOWNLOAD,
  APPLY_COS_UPDATES,
  WAITING_FOR_SYSTEM_RESTART,
  APPLY_MODULE_UPDATES,
  WAIT_FOR_MODULE_UPDATE,
  SUCCESS,
  ERROR
}

export interface HealthcheckResponse {
  startUpTime: string;
}

@Injectable()
export class SystemInformationService {
  private _store: Store<SystemInformationState>;

  constructor(
    storeFactory: StoreFactory<SystemInformationState>,
    private httpService: HttpService,
    private configurationAgentHttpMockupService: ConfigurationAgentHttpMockupService,
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

  async healthcheck(): Promise<HealthcheckResponse> {
    //TBD
    return await this.httpService.get<HealthcheckResponse>(`/healthcheck`);
  }

  async getServerTime(): Promise<string> {
    const response = await this.configurationAgentHttpMockupService.get<{
      Timestamp: string;
    }>(`/system/time`);

    return response.Timestamp;
  }

  async restartDevice(): Promise<boolean> {
    try {
      await this.configurationAgentHttpMockupService.post(
        `/system/restart`,
        null
      );

      return true;
    } catch (e) {
      return true;
    }
  }

  async getServerTimeOffset(force = false): Promise<number> {
    if (force || this._store.snapshot.serverOffset === undefined) {
      const time = new Date(await this.getServerTime());
      const offset = Math.round(Date.now() - time.getTime()) / 1000;

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
