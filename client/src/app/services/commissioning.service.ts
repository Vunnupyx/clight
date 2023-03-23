import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { ConfigurationAgentHttpService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { errorHandler, ObjectMap } from 'app/shared/utils';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import {
  NetworkAdapter,
  AdapterConnection,
  CommissioningInformation,
  DataHubModule,
  MachineInformation
} from 'app/models';

export class CommissioningState {
  status!: Status;
  finished!: boolean;
  machineInformation!: MachineInformation;
  adapter!: NetworkAdapter;
  adapterConnection!: AdapterConnection;
  dataHubsModules!: ObjectMap<DataHubModule>;
  registration!: boolean;
}

@Injectable()
export class CommissioningService {
  private _store: Store<CommissioningState>;

  get finished() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.finished),
      distinctUntilChanged()
    );
  }

  get machineInformation() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.machineInformation),
      distinctUntilChanged()
    );
  }

  get adapter() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.adapter),
      distinctUntilChanged()
    );
  }

  get adapterConnection() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.adapterConnection),
      distinctUntilChanged()
    );
  }

  get dataHubsModules() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.dataHubsModules)
    );
  }

  get registration() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.registration),
      distinctUntilChanged()
    );
  }

  constructor(
    storeFactory: StoreFactory<CommissioningState>,
    private configurationAgentHttpService: ConfigurationAgentHttpService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  async apply(): Promise<boolean> {
    try {
      this._store.patchState((state) => {
        state.status = Status.Loading;
      });
      await this.configurationAgentHttpService.post(
        `/system/commissioning/finish`,
        undefined
      );
    } catch (err) {
      this.toastr.error(this.translate.instant('commissioning.UpdateError'));
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
      return false;
    }

    return true;
  }

  async getMachineInformation() {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });
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
  async getAdapter() {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });
    try {
      const response =
        await this.configurationAgentHttpService.get<NetworkAdapter>(
          `/network/adapters/enoX1`
        );

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.adapter = response;
      });
    } catch (err) {
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async getAdapterConnection() {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });
    try {
      const response =
        await this.configurationAgentHttpService.get<AdapterConnection>(
          `/network/adapters/enoX1/status`
        );

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.adapterConnection = response;
      });
    } catch (err) {
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async getDataHubModule(name: string) {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });
    try {
      const response =
        await this.configurationAgentHttpService.get<DataHubModule>(
          `/datahub/status/${name}`
        );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.dataHubsModules[name] = response;
      });
    } catch (err) {
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async getRegistration() {
    try {
      const response = await this.configurationAgentHttpService.get<{
        Registered: boolean;
      }>(`/datahub/dps`);

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.registration = response.Registered;
      });
    } catch (err) {
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async isFinished(): Promise<boolean> {
    try {
      if (!this._store.snapshot.finished) {
        const response =
          await this.configurationAgentHttpService.get<CommissioningInformation>(
            `/system/commissioning`
          );

        this._store.patchState((state) => {
          state.finished = response.Finished;
        });

        return response.Finished;
      }

      return this._store.snapshot.finished;
    } catch (err) {
      this._store.patchState((state) => {
        state.finished = true;
      });
      return true;
    }
  }

  private _emptyState() {
    return <CommissioningState>{
      status: Status.NotInitialized,
      dataHubsModules: {}
    };
  }
}
