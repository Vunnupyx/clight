import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';

import { DataSource } from 'app/models';
import { HttpMockupService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { errorHandler } from 'app/shared/utils';
import { DATA_SOURCES_MOCK } from './data-source.service.mock';
import * as api from 'app/api/models';

export class DataSourcesState {
  status: Status;
  dataSources: DataSource[];
}

@Injectable()
export class DataSourceService {
  private _store: Store<DataSourcesState>;

  constructor(
    storeFactory: StoreFactory<DataSourcesState>,
    private httpService: HttpMockupService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  get status() {
    return this._store.snapshot.status;
  }

  get dataSources() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.dataSources));
  }

  async getDataSources() {
    this._store.patchState((state) => ({
      status: Status.Loading,
      dataSources: []
    }));

    try {
      const { dataSources } = await this.httpService.get<api.DataSourceList>(
        `/datasources`,
        undefined,
        DATA_SOURCES_MOCK()
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.dataSources = dataSources.map((x) => this._parseDataSource(x));
      });
    } catch (err) {
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  async getDataSource(datasourceId: string) {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });

    try {
      const obj = await this.httpService.get(
        `/datasources/${datasourceId}`,
        undefined,
        DATA_SOURCES_MOCK()[0]
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.dataSources = state.dataSources.map((x) =>
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

  async updateDataSource(obj: DataSource) {
    this._store.patchState((state) => {
      state.status = Status.Updating;
      state.dataSources = state.dataSources.map((x) =>
        x.id != obj.id ? x : obj
      );
    });

    try {
      await this.httpService.patch(`/datasources/${obj.id}`, obj);
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

  private _parseDataSource(obj: api.DataSourceType) {
    return obj as DataSource;
  }

  private _emptyState() {
    return <DataSourcesState>{
      status: Status.NotInitialized
    };
  }
}
