import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { ConfigurationAgentHttpService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { errorHandler } from 'app/shared/utils';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { CentralServer, NetServiceStatus } from 'app/models';

export class NetServiceState {
  status!: Status;
  netServiceStatus!: NetServiceStatus;
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

  constructor(
    storeFactory: StoreFactory<NetServiceState>,
    private configurationAgentHttpService: ConfigurationAgentHttpService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  async facilityTreeReset(): Promise<boolean> {
    try {
      await this.configurationAgentHttpService.post(`/facility/reset`, null);

      return true;
    } catch (e) {
      return false;
    }
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
      this.toastr.success(this.translate.instant('net-service.SaveSuccess'));
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
