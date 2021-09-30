import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { filter, map } from 'rxjs/operators';

import { HttpMockupService } from '../shared';
import { Status, Store, StoreFactory } from '../shared/state';
import { errorHandler, ObjectMap } from '../shared/utils';
import { NetworkConfig } from '../models';
import { GET_RESPONSE } from './network.mock';

export class NetworkState {
  status!: Status;
  config!: ObjectMap<NetworkConfig>;
}

@Injectable()
export class NetworkService {
  private _store: Store<NetworkState>;

  constructor(
    storeFactory: StoreFactory<NetworkState>,
    private httpService: HttpMockupService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  get status() {
    return this._store.snapshot.status;
  }

  get config() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.config));
  }

  async getNetworkConfig() {
    this._store.patchState((state) => ({
      status: Status.Loading,
      config: null
    }));

    try {
      const response = await this.httpService.get<any>(`/networkconfig`, undefined, GET_RESPONSE);
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.config = response;
      });
    } catch (err) {
      this.toastr.error(
        this.translate.instant('settings-network.LoadError')
      );
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
      await this.httpService.patch<any>(`/networkconfig`, obj);
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.config = obj;
      });
    } catch (err) {
      this.toastr.error(
        this.translate.instant('settings-network.UpdateError')
      );
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
