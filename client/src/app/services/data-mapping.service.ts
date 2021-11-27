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

      await this.httpService.post(`/mappings/bulk`, this.getPayload());

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

    // this._store.patchState((state) => {
    //   state.status = Status.Creating;
    // });

    // try {
    //   const response = await this.httpService.post(`/mappings`, obj);
    //   this._store.patchState((state) => {
    //     state.status = Status.Ready;
    //     obj.id = response.id;
    //     state.dataMappings.push(obj);
    //   });
    // } catch (err) {
    //   this.toastr.error(
    //     this.translate.instant('settings-data-mapping.CreateError')
    //   );
    //   errorHandler(err);
    //   this._store.patchState((state) => {
    //     state.status = Status.Ready;
    //   });
    // }
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

    // this._store.patchState((state) => {
    //   state.status = Status.Updating;
    // });

    // try {
    //   await this.httpService.patch(`/mappings/${obj.id}`, obj);
    //   this._store.patchState((state) => {
    //     state.status = Status.Ready;
    //     state.dataMappings = state.dataMappings.map((x) =>
    //       x.id != obj.id ? x : obj
    //     );
    //   });
    // } catch (err) {
    //   this.toastr.error(
    //     this.translate.instant('settings-data-mapping.UpdateError')
    //   );
    //   errorHandler(err);
    //   this._store.patchState((state) => {
    //     state.status = Status.Ready;
    //   });
    // }
  }

  async deleteDataMapping(obj: DataMapping) {
    this.delete(obj.id);

    this._store.patchState((state) => {
      state.dataMappings = state.dataMappings.filter((x) => x.id != obj.id);
    });

    // this._store.patchState((state) => {
    //   state.status = Status.Deleting;
    // });

    // try {
    //   await this.httpService.delete(`/mappings/${obj.id}`);
    //   this._store.patchState((state) => {
    //     state.status = Status.Ready;
    //     state.dataMappings = state.dataMappings.filter((x) => x != obj);
    //   });
    // } catch (err) {
    //   this.toastr.error(
    //     this.translate.instant('settings-data-mapping.DeleteError')
    //   );
    //   errorHandler(err);
    //   this._store.patchState((state) => {
    //     state.status = Status.Ready;
    //   });
    // }
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
