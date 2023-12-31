import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { from, interval, Observable } from 'rxjs';

import { ConfigurationAgentHttpService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { errorHandler } from 'app/shared/utils';
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';
import { CentralServer, NetServiceStatus } from 'app/models';
import { HttpClient } from '@angular/common/http';

export class NetServiceState {
  status!: Status;
  netServiceStatus!: NetServiceStatus;
  statusIcon!: string;
}

@Injectable()
export class NetServiceService {
  private _store: Store<NetServiceState>;

  get netServiceStatus() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.netServiceStatus),
      distinctUntilChanged()
    );
  }

  get statusIcon() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.statusIcon),
      distinctUntilChanged()
    );
  }

  constructor(
    storeFactory: StoreFactory<NetServiceState>,
    private configurationAgentHttpService: ConfigurationAgentHttpService,
    protected http: HttpClient,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  revert() {
    this._store.patchState((state) => {
      state.status = Status.Ready;
      state.statusIcon = null;
      state.netServiceStatus = null;
    });
  }

  async facilityTreeReset(): Promise<boolean> {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });

    try {
      await this.configurationAgentHttpService.post(
        `/netservice/facility/reset`,
        null
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
      this.toastr.success(
        this.translate.instant('net-service.FacilityTreeResetSuccess')
      );
      return true;
    } catch (err) {
      this.toastr.error(this.translate.instant('net-service.UpdateError'));
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
      return false;
    }
  }

  /**
   * Triggers every 2 seconds /netservice/status
   * @returns Observable
   */
  setPeriodicStatusCheckTimer(): Observable<void> {
    return interval(2000).pipe(
      mergeMap(() => from(this.getNetServiceStatus()))
    );
  }

  async getNetServiceStatus() {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });
    try {
      const response =
        await this.configurationAgentHttpService.get<NetServiceStatus>(
          '/netservice/status'
        );

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.netServiceStatus = response;
      });

      await this.getStatusIcon(response.StatusIcon);
    } catch (err) {
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async getStatusIcon(filename: string) {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });
    try {
      const response = await this.configurationAgentHttpService.get<{
        Data: string;
      }>(`/system/icons/${filename}`);

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.statusIcon = response.Data;
      });
    } catch (err) {
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async updateCentralServer(obj: CentralServer) {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });

    try {
      await this.configurationAgentHttpService.put<CentralServer>(
        `/netservice/centralserver`,
        obj
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
      this.toastr.success(
        this.translate.instant('net-service.CentralServerSaveSuccess')
      );
    } catch (err) {
      this.toastr.error(this.translate.instant('net-service.UpdateError'));
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  private _emptyState() {
    return <NetServiceState>{
      status: Status.NotInitialized
    };
  }
}
