import { Injectable, Optional } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpMockupService, HttpService } from 'app/shared';
import { Store, StoreFactory } from 'app/shared/state';
import { errorHandler } from 'app/shared/utils';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

export enum ServerStatus {
  Invalidhost = 'invalid_host',
  NotConfigured = 'not_configured',
  Invalidauth = 'invalid_auth',
  Available = 'available'
}

export enum RegistrationStatus {
  Notregistered = 'not_registered',
  Registered = 'registered',
  Unknown = 'unknown'
}

export interface MessengerConfiguration {
  hostname: string | null;
  username: string | null;
  password: boolean | string;
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
  isBusy: boolean;
  status: MessengerStatus;
  configuration: MessengerConfiguration;
}

// TODO: Connect to API
let RESPONSE_CONFIG: MessengerConfiguration = {
  // hostname: 'Test',
  // username: 'Teest',
  // password: true,
  // model: 'Test',
  // name: 'Test',
  // organization: 'Test',
  // timezone: 8
} as any;

// TODO: Connect to API
const RESPONSE_STATUS: MessengerStatus = {
  // server: ServerStatus.Available,
  // registration: RegistrationStatus.Registered
} as any;

@Injectable({
  providedIn: 'root'
})
export class MessengerConnectionService {
  private _store: Store<MessengerStore>;

  constructor(
    storeFactory: StoreFactory<MessengerStore>,
    private httpService: HttpMockupService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  get config() {
    return this._store.state.pipe(map((x) => x.configuration));
  }

  get status() {
    return this._store.state.pipe(map((x) => x.status));
  }

  get isBusy() {
    return this._store.snapshot.isBusy;
  }

  async getMessengerConfig() {
    this._store.patchState((state) => {
      state.isBusy = true;
    });
    try {
      const response = await this.httpService.get<MessengerConfiguration>(
        `/messenger/configuration`,
        undefined,
        RESPONSE_CONFIG
      );
      this._store.patchState((state) => {
        state.configuration = response;
        state.isBusy = false;
      });
    } catch (err) {
      this._store.patchState((state) => {
        state.isBusy = false;
      });
      this.toastr.error(this.translate.instant('settings-data-sink.LoadError'));
      errorHandler(err);
    }
  }

  async getMessengerStatus() {
    this._store.patchState((state) => {
      state.isBusy = true;
    });
    try {
      const response = await this.httpService.get<MessengerStatus>(
        `/messenger/status`,
        undefined,
        RESPONSE_STATUS
      );
      this._store.patchState((state) => {
        state.status = response;
        state.isBusy = false;
      });
    } catch (err) {
      this._store.patchState((state) => {
        state.isBusy = false;
      });
      this.toastr.error(this.translate.instant('settings-data-sink.LoadError'));
      errorHandler(err);
    }
  }

  async updateNetworkConfig(obj: Partial<MessengerConfiguration>) {
    this._store.patchState((state) => {
      state.isBusy = true;
    });
    try {
      this.setMockData(obj);
      const response = await this.httpService.post<any>(
        `/messenger/configuration`,
        obj,
        undefined,
        RESPONSE_CONFIG
      );
      this._store.patchState((state) => {
        state.configuration = response;
        state.isBusy = false;
      });
      this.toastr.success(
        this.translate.instant('settings-data-sink.BulkSuccess')
      );
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-data-sink.BulkError'));
      errorHandler(err);
      this._store.patchState((state) => {
        state.isBusy = false;
      });
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
        timezone: null
      },
      status: {
        server: ServerStatus.NotConfigured,
        registration: RegistrationStatus.Unknown
      },
      isBusy: false
    };
  }

  setMockData(obj: Partial<MessengerConfiguration>) {
    RESPONSE_CONFIG = { ...RESPONSE_CONFIG, ...obj };
  }
}
