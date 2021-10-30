import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { from, interval } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';

import { HttpService } from '../shared';
import { Status, Store, StoreFactory } from '../shared/state';
import { errorHandler, ObjectMap } from '../shared/utils';
import { NetworkConfig } from '../models';

export class NetworkState {
  status!: Status;
  config!: ObjectMap<NetworkConfig>;
}

@Injectable()
export class NetworkService {
  private _store: Store<NetworkState>;

  constructor(
    storeFactory: StoreFactory<NetworkState>,
    private httpService: HttpService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  get status() {
    return this._store.snapshot.status;
  }

  get config() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.config),
      distinctUntilChanged()
    );
  }

  setNetworkConfigTimer() {
    return interval(10 * 1000).pipe(
      mergeMap(() => from(this.getNetworkConfig()))
    );
  }

  async getNetworkConfig() {
    try {
      const response = await this.httpService.get<any>(`/networkconfig`);
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.config = response;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.LoadError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  async updateNetworkConfig(obj: ObjectMap<NetworkConfig>) {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });

    try {
      const response = await this.httpService.patch<any>(`/networkconfig`, obj);
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.config = response;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.UpdateError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  private _emptyState() {
    return <NetworkState>{
      status: Status.NotInitialized
    };
  }
}
