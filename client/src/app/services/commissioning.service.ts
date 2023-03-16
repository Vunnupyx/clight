import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { ConfigurationAgentHttpService, HttpService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { errorHandler } from 'app/shared/utils';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

export class CommissioningState {
  status!: Status;
  finished!: boolean;
  registration!: boolean;
}

@Injectable()
export class CommissioningService {
  private _store: Store<CommissioningState>;

  get registration() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.registration),
      distinctUntilChanged()
    );
  }

  constructor(
    storeFactory: StoreFactory<CommissioningState>,
    private httpService: HttpService,
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

  async getRegistrationStatus() {
    try {
      const response = await this.configurationAgentHttpService.get<{
        Registered: boolean;
      }>(`/datahub/dps`);

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.registration = response.Registered;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('commissioning.LoadError'));
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async isFinished() {
    this._store.patchState((state) => {
      state.finished = false;
    });
    try {
      if (this._store.snapshot.finished === undefined) {
        const response = await this.configurationAgentHttpService.get<{
          Timestamp: string;
          Finished: boolean;
        }>(`/system/commissioning`);

        this._store.patchState((state) => {
          state.finished = response.Finished;
        });

        return response.Finished;
      }

      return this._store.snapshot.finished;
    } catch (err) {
      return false;
    }
  }

  private _emptyState() {
    return <CommissioningState>{
      status: Status.NotInitialized
    };
  }
}
