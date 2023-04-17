import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { ConfigurationAgentHttpService, HttpService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { MachineInformation, SystemInformationSection } from 'app/models';
import { errorHandler } from 'app/shared/utils';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

export class SystemInformationState {
  status!: Status;
  machineInformation!: MachineInformation;
  sections!: SystemInformationSection[];
  serverOffset!: number;
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
    private configurationAgentHttpService: ConfigurationAgentHttpService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  get status() {
    return this._store.snapshot.status;
  }

  get machineInformation() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.machineInformation),
      distinctUntilChanged()
    );
  }

  get sections() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.sections));
  }

  async getMachineInformation() {
    this._store.patchState(() => ({
      status: Status.Loading,
      sections: []
    }));
    try {
      const response =
        await this.configurationAgentHttpService.get<MachineInformation>(
          '/machine/info'
        );

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.machineInformation = response;
      });
    } catch (err) {
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
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

  async getServerTime(): Promise<string> {
    const response = await this.configurationAgentHttpService.get<{
      Timestamp: string;
    }>(`/system/time`);

    return response.Timestamp;
  }

  async restartDevice(): Promise<boolean> {
    try {
      await this.configurationAgentHttpService.post(`/system/restart`, null);

      return true;
    } catch (e) {
      return true;
    }
  }

  async factoryReset(): Promise<boolean> {
    try {
      await this.httpService.post(`/systemInfo/factoryreset`, null);

      return true;
    } catch (e) {
      return false;
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
      status: Status.NotInitialized
    };
  }
}
