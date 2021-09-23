import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { DataSource, DataSourceProtocol } from 'app/models';
import { HttpMockupService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { errorHandler, mapOrder } from 'app/shared/utils';
import * as api from 'app/api/models';

export class DataSourcesState {
  status!: Status;
  dataSources!: DataSource[];
}

const DATA_SOURCES_ORDER = [DataSourceProtocol.S7, DataSourceProtocol.IOShield];

@Injectable()
export class DataSourceService {
  private _store: Store<DataSourcesState>;

  constructor(
    storeFactory: StoreFactory<DataSourcesState>,
    private httpService: HttpMockupService,
    private translate: TranslateService,
    private toastr: ToastrService,
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
        `/datasources`
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.dataSources = this._orderByProtocol(
          dataSources.map((x) => this._parseDataSource(x))
        );
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-data-source.LoadError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  async getDataSource(datasourceProtocol: string) {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });

    try {
      const obj = await this.httpService.get(
        `/datasources/${datasourceProtocol}`
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.dataSources = state.dataSources.map((x) =>
          x.id != obj.id ? x : obj
        );
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-data-source.LoadError'));
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async updateDataSource(protocol: string, obj: Partial<DataSource>) {
    this._store.patchState((state) => {
      state.status = Status.Updating;
      state.dataSources = state.dataSources.map((x) =>
        x.protocol != obj.protocol ? x : obj
      );
    });

    try {
      await this.httpService.patch(`/datasources/${protocol}`, obj);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-data-source.UpdateError'));
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  private _orderByProtocol(objs: DataSource[]): DataSource[] {
    return mapOrder<DataSource>(objs, DATA_SOURCES_ORDER, 'protocol');
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
