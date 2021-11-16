import { Injectable } from '@angular/core';
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import {
  DataPointLiveData,
  DataSourceProtocol,
  SourceDataPoint,
  SourceDataPointType
} from 'app/models';
import { HttpService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { array2map, clone, errorHandler, ObjectMap } from 'app/shared/utils';
import * as api from 'app/api/models';
import { from, interval, Observable } from 'rxjs';
import { IChangesAppliable, IChangesState } from 'app/models/core/data-changes';
import { BaseChangesService } from './base-changes.service';
import { SystemInformationService } from './system-information.service';
import { filterLiveData } from 'app/shared/utils/filter-livedata';

export class SourceDataPointsState {
  status!: Status;
  originalDataPoints!: SourceDataPoint[];
  dataPoints!: SourceDataPoint[];
  dataPointsLivedata!: ObjectMap<DataPointLiveData>;
  dataPointsSourceMap!: ObjectMap<DataSourceProtocol>;
}

@Injectable()
export class SourceDataPointService
  extends BaseChangesService<SourceDataPoint>
  implements IChangesAppliable
{
  private _store: Store<SourceDataPointsState>;

  get dataPointsLivedata() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.dataPointsLivedata));
  }

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

  constructor(
    storeFactory: StoreFactory<SourceDataPointsState>,
    changesFactory: StoreFactory<IChangesState<string, SourceDataPoint>>,
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

  async apply(datasourceProtocol: DataSourceProtocol): Promise<boolean> {
    try {
      this._store.patchState((state) => {
        state.status = Status.Loading;
      });

      await this.httpService.post(
        `/datasources/${datasourceProtocol}/dataPoints/bulk`,
        this.getPayload()
      );

      this.resetState();

      this._store.patchState((state) => {
        state.status = Status.Ready;
      });

      this.toastr.success(
        this.translate.instant('settings-data-source-point.BulkSuccess')
      );
    } catch {
      this.toastr.error(
        this.translate.instant('settings-data-source-point.BulkError')
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }

    return true;
  }

  async getDataPoints(datasourceProtocol: DataSourceProtocol) {
    this._store.patchState((state) => ({
      status: Status.Loading,
      dataPoints: []
    }));

    try {
      const { dataPoints } = await this.httpService.get<{
        dataPoints: api.Sourcedatapoint[];
      }>(`/datasources/${datasourceProtocol}/datapoints`);

      this._store.patchState((state) => {
        state.dataPoints = dataPoints.map((x) => this._parseDataPoint(x));
        state.originalDataPoints = clone(state.dataPoints);
        state.dataPointsSourceMap = array2map(
          state.dataPoints,
          (item) => item.id,
          () => datasourceProtocol
        );
        state.status = Status.Ready;
      });
    } catch (err) {
      this.toastr.error(
        this.translate.instant('settings-data-source-point.LoadError')
      );
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Ready
      }));
    }
  }

  async getSourceDataPointsAll() {
    this._store.patchState((state) => ({
      status: Status.Loading,
      sourceDataPoints: []
    }));

    try {
      const { dataSources } = await this.httpService.get<api.DataSourceList>(
        `/datasources`
      );

      let dataPoints: api.Sourcedatapoint[] = [];
      let wholeMap = {};

      for (const dataSource of dataSources!) {
        const map = array2map(
          dataSource.dataPoints!,
          (item) => item.id!,
          () => dataSource.protocol
        );

        wholeMap = {
          ...wholeMap,
          ...map
        };

        dataPoints = dataPoints.concat(
          ...(dataSource.dataPoints as api.Sourcedatapoint[])
        );
      }

      this._store.patchState((state) => {
        state.dataPoints = dataPoints.map((x) => this._parseDataPoint(x));
        state.dataPointsSourceMap = wholeMap;
        state.status = Status.Ready;
      });
    } catch (err) {
      this.toastr.error(
        this.translate.instant('settings-data-source-point.LoadError')
      );
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Ready
      }));
    }
  }

  /**
   * Triggers every 1 second /livedata/datasource/:protocol endpoint
   * @returns Observable
   */
  setLivedataTimer(
    protocol: DataSourceProtocol,
    timeseries = 'false'
  ): Observable<void> {
    return interval(1000).pipe(
      mergeMap(() => from(this.getLiveDataForDataPoints(protocol, timeseries)))
    );
  }

  async getLiveDataForDataPoints(
    protocol: DataSourceProtocol,
    timeseries = 'false'
  ) {
    try {
      const liveData = await this.httpService.get<DataPointLiveData[]>(
        `/livedata/datasource/${protocol}?timeseries=${timeseries}`
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

  async addDataPoint(
    datasourceProtocol: DataSourceProtocol,
    obj: SourceDataPoint
  ) {
    this.create(obj);
    this._store.patchState((state) => {
      state.status = Status.Ready;
      state.dataPoints = [...state.dataPoints, obj];
      state.dataPointsSourceMap[obj.id] = datasourceProtocol;
    });
  }

  async updateDataPoint(
    datasourceProtocol: DataSourceProtocol,
    obj: SourceDataPoint
  ) {
    const oldDp = this._store.snapshot.dataPoints.find(
      (dp) => dp.id === obj.id
    );

    this.update(obj.id, { ...oldDp, ...obj });

    this._store.patchState((state) => {
      state.dataPoints = state.dataPoints.map((x) =>
        x.id != obj.id ? x : obj
      );
    });
  }

  async deleteDataPoint(
    datasourceProtocol: DataSourceProtocol,
    obj: SourceDataPoint
  ) {
    this.delete(obj.id);

    this._store.patchState((state) => {
      state.dataPoints = state.dataPoints.filter((x) => x.id != obj.id);
    });
  }

  getProtocol(id: string) {
    return this._store?.snapshot?.dataPointsSourceMap[id];
  }

  getPrefix(id: string) {
    if (!this._store?.snapshot?.dataPointsSourceMap) {
      return '';
    }

    const protocol = this._store?.snapshot?.dataPointsSourceMap[id];

    switch (protocol) {
      case DataSourceProtocol.S7:
        const dp = this._store.snapshot.dataPoints.find((x) => x.id === id);
        if (dp!.type === SourceDataPointType.NCK) {
          return '[NC]';
        }
        return '[PLC]';
      case DataSourceProtocol.IOShield:
        const ioDp = this._store.snapshot.dataPoints.find((x) => x.id === id);

        if (ioDp?.address && ioDp.address.startsWith('AI')) {
          return '[AI]';
        }

        return `[DI]`;
      default:
        return '';
    }
  }

  private _parseDataPoint(obj: api.Sourcedatapoint) {
    return obj as SourceDataPoint;
  }

  private _emptyState() {
    return <SourceDataPointsState>{
      status: Status.NotInitialized,
      dataPoints: [] as SourceDataPoint[],
      originalDataPoints: [] as SourceDataPoint[],
      dataPointsSourceMap: {},
      dataPointsLivedata: {}
    };
  }
}
