import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';
import { from, interval, Observable } from 'rxjs';

import { Status, Store, StoreFactory } from '../shared/state';
import { DataPointLiveData, VirtualDataPoint } from '../models';
import { HttpService } from '../shared';
import * as api from '../api/models';
import { array2map, clone, errorHandler, ObjectMap } from '../shared/utils';
import { CreateEntityResponse } from '../models/responses/create-entity.response';
import { UpdateEntityResponse } from '../models/responses/update-entity.response';
import { BaseChangesService } from './base-changes.service';
import { IChangesAppliable, IChangesState } from 'app/models/core/data-changes';

export class VirtualDataPointsState {
  status!: Status;
  dataPoints!: VirtualDataPoint[];
  originalDataPoints!: VirtualDataPoint[];
  dataPointsLivedata!: ObjectMap<DataPointLiveData>;
}

@Injectable()
export class VirtualDataPointService
  extends BaseChangesService<VirtualDataPoint>
  implements IChangesAppliable
{
  private _store: Store<VirtualDataPointsState>;

  get status() {
    return this._store.snapshot.status;
  }

  get dataPoints() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.dataPoints),
      distinctUntilChanged()
    );
  }

  get dataPointsLivedata() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.dataPointsLivedata));
  }

  constructor(
    storeFactory: StoreFactory<VirtualDataPointsState>,
    changesFactory: StoreFactory<IChangesState<string, VirtualDataPoint>>,
    private httpService: HttpService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    super(changesFactory);

    this._store = storeFactory.startFrom(this._emptyState());
  }

  async revert(): Promise<boolean> {
    this._store.patchState((state) => {
      state.dataPoints = clone(state.originalDataPoints);
    });

    this.resetState();

    return Promise.resolve(true);
  }

  async apply(): Promise<boolean> {
    try {
      this._store.patchState((state) => {
        state.status = Status.Loading;
      });

      await this.httpService.post(`/vdps/bulk`, this.getPayload());

      this.resetState();

      this._store.patchState((state) => {
        state.status = Status.Ready;
      });

      this.toastr.success(
        this.translate.instant('settings-virtual-data-point.BulkSuccess')
      );
    } catch {
      this.toastr.error(
        this.translate.instant('settings-virtual-data-point.BulkError')
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }

    return true;
  }

  async getDataPoints() {
    this._store.patchState((state) => ({
      status: Status.Loading,
      dataPoints: []
    }));

    try {
      const { vdps } = await this.httpService.get<{
        vdps: api.VirtualDataPointType[];
      }>('/vdps');

      this._store.patchState((state) => {
        state.dataPoints = vdps.map((x) => this._parseDataPoint(x));
        state.originalDataPoints = clone(state.dataPoints);
        state.status = Status.Ready;
      });
    } catch (err) {
      this.toastr.error(
        this.translate.instant('settings-virtual-data-point.LoadError')
      );
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Ready
      }));
    }
  }

  /**
   * Triggers every 1 second /livedata/vdps endpoint
   * @returns Observable
   */
  setLivedataTimer(): Observable<void> {
    return interval(1000).pipe(
      mergeMap(() => from(this.getLiveDataForDataPoints()))
    );
  }

  async getLiveDataForDataPoints() {
    try {
      const liveData = await this.httpService.get<DataPointLiveData[]>(
        '/livedata/vdps'
      );

      this._store.patchState((state) => {
        state.dataPointsLivedata = array2map(
          liveData,
          (item) => item.dataPointId
        );
      });
    } catch (err) {
      this.toastr.error(
        this.translate.instant('settings-virtual-data-point.LoadError')
      );
      errorHandler(err);
    }
  }

  async addDataPoint(obj: VirtualDataPoint) {
    this.create(obj);
    this._store.patchState((state) => {
      state.status = Status.Ready;
      state.dataPoints = [...state.dataPoints, obj];
    });

    // this._store.patchState((state) => {
    //   state.status = Status.Creating;
    // });

    // try {
    //   const vdp = await this.httpService.post<
    //     CreateEntityResponse<api.VirtualDataPointType>
    //   >(`/vdps`, obj);

    //   this._store.patchState((state) => {
    //     const dataPoint = this._parseDataPoint(vdp.created);

    //     obj.id = dataPoint.id;
    //     state.dataPoints = [...state.dataPoints, obj];
    //     state.status = Status.Ready;
    //   });
    // } catch (err) {
    //   this.toastr.error(
    //     this.translate.instant('settings-virtual-data-point.CreateError')
    //   );
    //   errorHandler(err);
    //   this._store.patchState(() => ({
    //     status: Status.Ready
    //   }));
    // }
  }

  async updateDataPoint(id: string, obj: Partial<VirtualDataPoint>) {
    const oldDp = this._store.snapshot.dataPoints.find((dp) => dp.id === id);

    const newDp = { ...oldDp, ...obj } as VirtualDataPoint;

    this.update(id, newDp);

    this._store.patchState((state) => {
      state.dataPoints = state.dataPoints.map((x) => (x.id != id ? x : newDp));
    });

    // this._store.patchState((state) => {
    //   state.status = Status.Updating;
    // });

    // try {
    //   const vdp = await this.httpService.patch<
    //     UpdateEntityResponse<api.VirtualDataPointType>
    //   >(`/vdps/${id}`, obj);

    //   this._store.patchState((state) => {
    //     state.dataPoints = state.dataPoints.map((x) =>
    //       x.id != id ? x : { ...x, ...this._parseDataPoint(vdp.changed) }
    //     );
    //     state.status = Status.Ready;
    //   });
    // } catch (err) {
    //   this.toastr.error(
    //     this.translate.instant('settings-virtual-data-point.UpdateError')
    //   );
    //   errorHandler(err);
    //   this._store.patchState(() => ({
    //     status: Status.Ready
    //   }));
    // }
  }

  async deleteDataPoint(id: string) {
    this.delete(id);

    this._store.patchState((state) => {
      state.dataPoints = state.dataPoints.filter((x) => x.id != id);
    });

    // this._store.patchState((state) => {
    //   state.status = Status.Deleting;
    // });

    // try {
    //   await this.httpService.delete(`/vdps/${id}`);

    //   this._store.patchState((state) => {
    //     state.dataPoints = state.dataPoints.filter((x) => x.id != id);
    //     state.status = Status.Ready;
    //   });
    // } catch (err) {
    //   this.toastr.error(
    //     this.translate.instant('settings-virtual-data-point.DeleteError')
    //   );
    //   errorHandler(err);
    //   this._store.patchState(() => ({
    //     status: Status.Ready
    //   }));
    // }
  }

  public getPrefix() {
    return '[VDP]';
  }

  private _parseDataPoint(obj: api.VirtualDataPointType) {
    return obj as VirtualDataPoint;
  }

  private _emptyState() {
    return <VirtualDataPointsState>{
      status: Status.NotInitialized
    };
  }
}
