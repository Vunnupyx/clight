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
import { BaseChangesService } from './base-changes.service';
import { IChangesAppliable, IChangesState } from 'app/models/core/data-changes';
import { filterLiveData } from 'app/shared/utils/filter-livedata';
import { SystemInformationService } from './system-information.service';

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
    private toastr: ToastrService,
    private systemInformationService: SystemInformationService
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

  async resetCounter(vdp: VirtualDataPoint): Promise<boolean> {
    const payload = {
        ...vdp,
        reset: true
    }
    return this.httpService.patch(`/vdps/${vdp.id}`, payload)
      .then((response) => {
        this.toastr.success(
          this.translate.instant('settings-virtual-data-point.CounterResetSuccess', {NAME: response?.changed?.name})
        );
        return true;
      }).catch((error) => {
        this.toastr.error(
          this.translate.instant('settings-virtual-data-point.CounterResetError')
        );
        return false;
      }
    );
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
      errorHandler(err);
      const offset = await this.systemInformationService.getServerTimeOffset();
      this._store.patchState((state) => {
        state.dataPointsLivedata = {
          ...array2map(
            Object.values(state.dataPointsLivedata).filter(
              filterLiveData(offset)
            ),
            (item) => item.dataPointId
          )
        };
      });
    }
  }

  async addDataPoint(obj: VirtualDataPoint) {
    this.create(obj);
    this._store.patchState((state) => {
      state.status = Status.Ready;
      state.dataPoints = [...state.dataPoints, obj];
    });
  }

  async updateDataPoint(id: string, obj: Partial<VirtualDataPoint>) {
    const oldDp = this._store.snapshot.dataPoints.find((dp) => dp.id === id);

    const newDp = { ...oldDp, ...obj } as VirtualDataPoint;

    this.update(id, newDp);

    this._store.patchState((state) => {
      state.dataPoints = state.dataPoints.map((x) => (x.id != id ? x : newDp));
    });
  }

  async deleteDataPoint(id: string) {
    this.delete(id);

    this._store.patchState((state) => {
      state.dataPoints = state.dataPoints.filter((x) => x.id != id);
    });
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
