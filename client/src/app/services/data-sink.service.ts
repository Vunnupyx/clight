import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';

import { DataSink } from 'app/models';
import { HttpMockupService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { errorHandler } from 'app/shared/utils';
import { DATA_SINKS_MOCK } from './data-sink.service.mock';
import * as api from 'app/api/models';

export class DataSinksState {
  status: Status;
  dataSinks: DataSink[];
}

@Injectable()
export class DataSinkService {
  private _store: Store<DataSinksState>;

  constructor(
    storeFactory: StoreFactory<DataSinksState>,
    private httpService: HttpMockupService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  get status() {
    return this._store.snapshot.status;
  }

  get dataSinks() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.dataSinks));
  }

  async getDataSinks() {
    this._store.patchState((state) => ({
      status: Status.Loading,
      dataSinks: []
    }));

    try {
      const dataSinks = await this.httpService.get<api.DataSinkType[]>(
        `/datasinks`,
        undefined,
        DATA_SINKS_MOCK()
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.dataSinks = dataSinks.map((x) => this._parseDataSink(x));
      });
    } catch (err) {
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  async getDataSink(datasourceId: string) {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });

    try {
      const obj = await this.httpService.get(
        `/datasinks/${datasourceId}`,
        undefined,
        DATA_SINKS_MOCK()[0]
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.dataSinks = state.dataSinks.map((x) =>
          x.id != obj.id ? x : obj
        );
      });
    } catch (err) {
      errorHandler(err);
      // TODO: Show error message (toast notification?)
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async updateDataSink(obj: DataSink) {
    this._store.patchState((state) => {
      state.status = Status.Updating;
      state.dataSinks = state.dataSinks.map((x) => (x.id != obj.id ? x : obj));
    });

    try {
      await this.httpService.patch(`/datasinks/${obj.id}`, obj);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    } catch (err) {
      errorHandler(err);
      // TODO: Show error message (toast notification?)
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  private _parseDataSink(obj: api.DataSinkType) {
    return obj as any as DataSink;
  }

  private _emptyState() {
    return <DataSinksState>{
      status: Status.NotInitialized
    };
  }
}
