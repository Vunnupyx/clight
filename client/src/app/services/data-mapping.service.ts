import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { DataMapping } from 'app/models';
import { HttpService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { clone, errorHandler } from 'app/shared/utils';
import { BaseChangesService } from './base-changes.service';
import { IChangesAppliable, IChangesState } from 'app/models/core/data-changes';

export class DataMappingsState {
  status!: Status;
  dataMappings!: DataMapping[];
  originalDataMappings!: DataMapping[];
}

@Injectable()
export class DataMappingService
  extends BaseChangesService<DataMapping>
  implements IChangesAppliable
{
  private _store: Store<DataMappingsState>;

  constructor(
    storeFactory: StoreFactory<DataMappingsState>,
    changesFactory: StoreFactory<IChangesState<string, DataMapping>>,
    private httpService: HttpService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    super(changesFactory);
    this._store = storeFactory.startFrom(this._emptyState());
  }

  get status() {
    return this._store.snapshot.status;
  }

  get dataMappings() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.dataMappings));
  }

  async revert(): Promise<boolean> {
    this._store.patchState((state) => {
      state.dataMappings = clone(state.originalDataMappings);
    });

    this.resetState();

    return Promise.resolve(true);
  }

  async apply(): Promise<boolean> {
    try {
      this._store.patchState((state) => {
        state.status = Status.Loading;
      });

      if (Object.keys(this.payload.created).length) {
        for (let dm of Object.values(this.payload.created)) {
          await this.httpService.post(`/mappings`, dm);
        }
      }

      if (Object.keys(this.payload.updated).length) {
        for (let [dmId, dm] of Object.entries(this.payload.updated)) {
          await this.httpService.patch(`/mappings/${dmId}`, dm);
        }
      }

      if (this.payload.deleted.length) {
        for (let dmId of this.payload.deleted) {
          await this.httpService.delete(`/mappings/${dmId}`);
        }
      }

      if (this.payload.replace.length) {
        await this.httpService.patch(`/mappings`, this.payload.replace);
      }

      this.resetState();

      this._store.patchState((state) => {
        state.status = Status.Ready;
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
    this.create(obj);
    this._store.patchState((state) => {
      state.status = Status.Ready;
      state.dataMappings = [...state.dataMappings, obj];
    });
  }

  async updateDataMapping(obj: DataMapping) {
    const oldDm = this._store.snapshot.dataMappings.find(
      (dm) => dm.id === obj.id
    );

    this.update(obj.id, { ...oldDm, ...obj });

    this._store.patchState((state) => {
      state.dataMappings = state.dataMappings.map((x) =>
        x.id != obj.id ? x : obj
      );
    });
  }

  async deleteDataMapping(obj: DataMapping) {
    this.delete(obj.id);

    this._store.patchState((state) => {
      state.dataMappings = state.dataMappings.filter((x) => x.id != obj.id);
    });
  }

  private _parseDataMapping(obj: any) {
    return obj as DataMapping;
  }

  private _emptyState() {
    return <DataMappingsState>{
      status: Status.NotInitialized
    };
  }
}
