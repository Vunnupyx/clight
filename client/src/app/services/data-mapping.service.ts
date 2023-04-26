import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { DataMapping } from 'app/models';
import { HttpService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { clone, errorHandler } from 'app/shared/utils';
import { v4 as uuidv4 } from 'uuid';

export class DataMappingsState {
  status!: Status;
  touched!: boolean;
  dataMappings!: DataMapping[];
  originalDataMappings!: DataMapping[];
}

@Injectable()
export class DataMappingService {
  private _store: Store<DataMappingsState>;

  constructor(
    storeFactory: StoreFactory<DataMappingsState>,
    private httpService: HttpService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  get status() {
    return this._store.snapshot.status;
  }

  get isTouched() {
    return this._store.snapshot.touched;
  }

  get dataMappings() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.dataMappings));
  }

  async revert(): Promise<boolean> {
    this._store.patchState((state) => {
      state.dataMappings = clone(state.originalDataMappings);
      state.touched = false;
    });

    return Promise.resolve(true);
  }

  async apply(): Promise<boolean> {
    try {
      this._store.patchState((state) => {
        state.status = Status.Loading;
      });

      await this.httpService.patch(
        `/mappings`,
        this._store.snapshot.dataMappings
      );

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.touched = false;
      });

      this.toastr.success(
        this.translate.instant('settings-data-mapping.BulkSuccess')
      );
    } catch {
      this.toastr.error(
        this.translate.instant('settings-data-mapping.BulkError')
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }

    return true;
  }

  async getDataMappingsAll() {
    this._store.patchState((state) => ({
      status: Status.Loading,
      dataMappings: []
    }));

    try {
      const { mapping } = await this.httpService.get<any>(`/mappings`);

      this._store.patchState((state) => {
        state.dataMappings = mapping.map((x) => this._parseDataMapping(x));
        state.originalDataMappings = clone(state.dataMappings);
        state.status = Status.Ready;
      });
    } catch (err) {
      this.toastr.error(
        this.translate.instant('settings-data-mapping.LoadError')
      );
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Ready
      }));
    }
  }

  async addDataMapping(obj: DataMapping) {
    this._store.patchState((state) => {
      state.status = Status.Ready;
      state.dataMappings = [...state.dataMappings, { ...obj, id: uuidv4() }];
      state.touched = true;
    });
  }

  async updateDataMapping(obj: DataMapping) {
    this._store.patchState((state) => {
      state.dataMappings = state.dataMappings.map((x) =>
        x.id != obj.id ? x : obj
      );
      state.touched = true;
    });
  }

  async deleteDataMapping(obj: DataMapping) {
    this._store.patchState((state) => {
      state.dataMappings = state.dataMappings.filter((x) => x.id != obj.id);
      state.touched = true;
    });
  }

  private _parseDataMapping(obj: any) {
    return obj as DataMapping;
  }

  private _emptyState() {
    return <DataMappingsState>{
      status: Status.NotInitialized,
      touched: false
    };
  }
}
