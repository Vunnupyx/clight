import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpMockupService, HttpService } from 'app/shared';
import { Store, StoreFactory } from 'app/shared/state';
import { errorHandler } from 'app/shared/utils';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

export type ServerStatus =
  | 'notconfigured'
  | 'invalidhost'
  | 'invalidauth'
  | 'available';

export type RegistrationStatus = 'notregistered' | 'registered' | 'unknown';

export interface MessengerConfiguration {
  hostname: string | null;
  username: string | null;
  password: boolean;
  model: string | null;
  name: string | null;
  organization: string | null;
  timezone: number | null;
}

export interface MessengerStatus {
  server: ServerStatus;
  registration: RegistrationStatus;
}

export interface MessengerStore {
  status: MessengerStatus;
  configuration: MessengerConfiguration
}

const RESPONSE_CONFIG = {
  hostname: "My host",
  username: "Alex87",
  password: true,
  model: "Tesla X",
  name: "Alex",
  organization: "Cligth",
  timezone: 8,
}

const RESPONSE_STATUS:MessengerStatus = {
  server:'available',
  registration: 'registered'
}

@Injectable({
  providedIn: 'root'
})
export class MessengerConnectionService {
  private _store: Store<MessengerStore>;


  constructor(
    storeFactory: StoreFactory<MessengerStore>,
    private httpService:HttpMockupService,
    // private httpService: HttpService,
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
  }

  async getMessengerConfig() {
    try {
      const response = await this.httpService.get<MessengerConfiguration>(`/messenger/configuration`,undefined, RESPONSE_CONFIG);
      this._store.patchState((state) => {
        state.configuration = response;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.LoadError'));
      errorHandler(err);
    }
  }

  async getMessengerStatus() {
    try {
      const response = await this.httpService.get<MessengerStatus>(`/messenger/status`,undefined, RESPONSE_STATUS);
      this._store.patchState((state) => {
        state.status = response;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.LoadError'));
      errorHandler(err);
    }
  }

  async updateNetworkConfig(obj: any) {
    try {
      const response = await this.httpService.post<any>(
        `/messenger/configuration`,
        obj,
        undefined,
        RESPONSE_CONFIG
      );
      this._store.patchState((state) => {
        state.status.registration = 'registered'
        state.configuration = response;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-network.UpdateError'));
      errorHandler(err);
    }
  }

  private _emptyState() {
    return <MessengerStore>{
      configuration: {
        hostname: null,
        username: null,
        password: false,
        model: null,
        name: null,
        organization: null,
        timezone: null,
      },
      status: {
        server: 'notconfigured',
        registration: 'unknown'
      }
    }
  }
}



