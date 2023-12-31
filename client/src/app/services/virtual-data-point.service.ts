import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';
import { from, interval, Observable } from 'rxjs';

import { Status, Store, StoreFactory } from '../shared/state';
import {
  DataPointLiveData,
  VirtualDataPoint,
  VirtualDataPointErrorReason,
  VirtualDataPointErrorType
} from '../models';
import { HttpService } from '../shared';
import { array2map, clone, errorHandler, ObjectMap } from '../shared/utils';
import { filterLiveData } from 'app/shared/utils/filter-livedata';
import { SystemInformationService } from './system-information.service';
import { v4 as uuidv4 } from 'uuid';

export class VirtualDataPointsState {
  status!: Status;
  touched!: boolean;
  dataPoints!: VirtualDataPoint[];
  originalDataPoints!: VirtualDataPoint[];
  dataPointsLivedata!: ObjectMap<DataPointLiveData>;
}

@Injectable()
export class VirtualDataPointService {
  private _store: Store<VirtualDataPointsState>;

  get status() {
    return this._store.snapshot.status;
  }

  get isTouched() {
    return this._store.snapshot.touched;
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
    private httpService: HttpService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private systemInformationService: SystemInformationService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  async revert(): Promise<boolean> {
    this._store.patchState((state) => {
      state.dataPoints = clone(state.originalDataPoints);
      state.touched = false;
    });

    return Promise.resolve(true);
  }

  async apply(): Promise<boolean> {
    try {
      this._store.patchState((state) => {
        state.status = Status.Loading;
      });

      await this.httpService.patch(`/vdps`, this._store.snapshot.dataPoints);

      this._getDataPoints();

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.touched = false;
      });

      this.toastr.success(
        this.translate.instant('settings-virtual-data-point.BulkSuccess')
      );
    } catch (err: any) {
      const { error, vdpIdWithError, notYetDefinedSourceVdpId } =
        (err.error as VirtualDataPointErrorReason) || {};

      if (
        [
          VirtualDataPointErrorType.UnexpectedError,
          VirtualDataPointErrorType.WrongFormat
        ].includes(error)
      ) {
        this.toastr.warning(
          this.translate.instant(`settings-virtual-data-point.UnexpectedError`)
        );
      } else if (error === VirtualDataPointErrorType.WrongVdpsOrder) {
        this.toastr.warning(
          this.translate.instant(`settings-virtual-data-point.WrongVdpsOrder`, {
            SourceId: notYetDefinedSourceVdpId,
            ErrorId: vdpIdWithError
          })
        );
      } else {
        this.toastr.error(
          this.translate.instant('settings-virtual-data-point.BulkError')
        );
      }

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
    };
    return this.httpService
      .patch(`/vdps/${vdp.id}`, payload)
      .then((response) => {
        this.toastr.success(
          this.translate.instant(
            'settings-virtual-data-point.CounterResetSuccess',
            { NAME: response?.changed?.name }
          )
        );
        return true;
      })
      .catch((error) => {
        this.toastr.error(
          this.translate.instant(
            'settings-virtual-data-point.CounterResetError',
            { NAME: payload?.name }
          )
        );
        return false;
      });
  }

  async getDataPoints() {
    this._store.patchState((state) => ({
      status: Status.Loading,
      dataPoints: []
    }));

    try {
      await this._getDataPoints();
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
    this._store.patchState((state) => {
      state.status = Status.Ready;
      state.dataPoints = [...state.dataPoints, { ...obj, id: uuidv4() }];
      state.touched = true;
    });
  }

  async updateDataPoint(id: string, obj: Partial<VirtualDataPoint>) {
    const oldDp = this._store.snapshot.dataPoints.find((dp) => dp.id === id);

    const newDp = { ...oldDp, ...obj } as VirtualDataPoint;

    this._store.patchState((state) => {
      state.dataPoints = state.dataPoints.map((x) => (x.id != id ? x : newDp));
      state.touched = true;
    });
  }

  async updateOrderDataPoints(obj: VirtualDataPoint[]) {
    this._store.patchState((state) => {
      state.dataPoints = [...obj];
      state.touched = !this._isEqualsOriginalDataPoints(state.dataPoints);
    });
  }

  async deleteDataPoint(id: string) {
    this._store.patchState((state) => {
      state.dataPoints = state.dataPoints.filter((x) => x.id != id);
      state.touched = true;
    });
  }

  public getPrefix() {
    return '[VDP]';
  }

  private async _getDataPoints() {
    const { vdps, error, vdpIdWithError, notYetDefinedSourceVdpId } =
      await this.httpService.get<
        { vdps: VirtualDataPoint[] } & VirtualDataPointErrorReason
      >('/vdps');

    this._store.patchState((state) => {
      state.dataPoints = vdps;
      state.originalDataPoints = clone(state.dataPoints);
      state.status = Status.Ready;
    });

    if (error) {
      // These warnings work AFTER applying or on page load, if the VDP order is somehow saved to config wrongly.
      // When user changes the order in the UI, the warning is handled by virtual-data-point.component.ts
      if (
        [
          VirtualDataPointErrorType.UnexpectedError,
          VirtualDataPointErrorType.WrongFormat
        ].includes(error)
      ) {
        this.toastr.warning(
          this.translate.instant(`settings-virtual-data-point.UnexpectedError`)
        );
      } else if (error === VirtualDataPointErrorType.WrongVdpsOrder) {
        this.toastr.warning(
          this.translate.instant(`settings-virtual-data-point.WrongVdpsOrder`, {
            SourceId: this._store.snapshot.dataPoints?.find(
              (x) => x.id === notYetDefinedSourceVdpId
            )?.name,
            ErrorId: this._store.snapshot.dataPoints?.find(
              (x) => x.id === vdpIdWithError
            )?.name
          }),
          undefined,
          { timeOut: 20000, extendedTimeOut: 10000 }
        );
      }
    }
  }

  private _isEqualsOriginalDataPoints(array: VirtualDataPoint[]): boolean {
    const oldDp = this._store.snapshot.originalDataPoints;
    return (
      Array.isArray(array) &&
      Array.isArray(oldDp) &&
      array.length === oldDp.length &&
      array.every((element, index) => element.id === oldDp[index].id)
    );
  }

  private _emptyState() {
    return <VirtualDataPointsState>{
      status: Status.NotInitialized,
      touched: false
    };
  }
}
