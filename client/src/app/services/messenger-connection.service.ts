import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'app/shared';
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
  Unknown = 'unknown',
  Error = 'error'
}
export enum RegistrationErrorReasonStatus {
  UnexpectedError  = 'unexpected_error',
  InvalidOrganization = 'invalid_organization',
  InvalidTimezone = 'invalid_timezone',
  InvalidModel = 'invalid_model',
  Duplicated = 'duplicated'
}

export interface MessengerConfiguration {
  hostname: string | null;
  username: string | null;
  password: string | null | boolean;
  model: number | null;
  name: string | null;
  organization: string | null;
  timezone: number | null;
}

export interface MessengerStatus {
  server: ServerStatus;
  registration: RegistrationStatus;
  registrationErrorReason: RegistrationErrorReasonStatus;
}

export interface MessengerMetadata {
  organizations: [{name: string, id: string}],
  timezones: [{name: string, id: number}],
  models: [{name: string, id: number}]
}

export interface MessengerStore {
  isBusy: boolean;
  status: MessengerStatus;
  configuration: MessengerConfiguration;
  metadata: MessengerMetadata;
}

@Injectable({
  providedIn: 'root'
})
export class MessengerConnectionService {
  private _store: Store<MessengerStore>;

  constructor(
    storeFactory: StoreFactory<MessengerStore>,
    private httpService: HttpService,
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

  get metadata() {
    return this._store.state.pipe(map((x) => x.metadata));
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

  async updateNetworkConfig(obj: MessengerConfiguration) {
    this._store.patchState((state) => {
      state.isBusy = true;
    });
    try {
      const response = await this.httpService.post<any>(
        `/messenger/configuration`,
        obj,
        undefined,
      );
      this._store.patchState((state) => {
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

  async getMessengerMetadata() {
    this._store.patchState((state) => {
      state.isBusy = true;
    });
    try {
      const response = await this.httpService.get<MessengerMetadata>(
        `/messenger/metadata`,
        undefined,
      );
      this._store.patchState((state) => {
        state.metadata = response;
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
        registration: RegistrationStatus.Unknown,
        registrationErrorReason: null
      },
      metadata: {
        organizations: [{name: '', id: ''}],
        models: [{name: '', id: 0}],
        timezones: [{name: '', id: 0}]
      },
      isBusy: false
    };
  }
}
