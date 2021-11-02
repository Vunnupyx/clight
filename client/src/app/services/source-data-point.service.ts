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
import { array2map, errorHandler, ObjectMap } from 'app/shared/utils';
import * as api from 'app/api/models';
import { CreateEntityResponse } from 'app/models/responses/create-entity.response';
import { from, interval, Observable } from 'rxjs';

export class SourceDataPointsState {
  status!: Status;
  dataPoints!: SourceDataPoint[];
  dataPointsLivedata!: ObjectMap<DataPointLiveData>;
  dataPointsSourceMap!: ObjectMap<DataSourceProtocol>;
}

@Injectable()
export class SourceDataPointService {
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
    private httpService: HttpService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
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

  setLivedataTimer(protocol: DataSourceProtocol): Observable<void> {
    return interval(1000).pipe(
      mergeMap(() => from(this.getLiveDataForDataPoints(protocol)))
    );
  }

  async getLiveDataForDataPoints(protocol: DataSourceProtocol) {
    this._store.patchState((state) => {
      state.dataPointsLivedata = {};
    });

    try {
      const liveData = await this.httpService.get<DataPointLiveData[]>(
        `/livedata/datasource/${protocol}?timeseries=true`
      );
      this._store.patchState((state) => {
        state.dataPointsLivedata = array2map(
          liveData,
          (item) => item.dataPointId
        );
      });
    } catch (err) {
      errorHandler(err);
    }
  }

  async addDataPoint(
    datasourceProtocol: DataSourceProtocol,
    obj: SourceDataPoint
  ) {
    this._store.patchState((state) => {
      state.status = Status.Creating;
    });

    try {
      const response = await this.httpService.post<
        CreateEntityResponse<SourceDataPoint>
      >(`/datasources/${datasourceProtocol}/datapoints`, obj);
      this._store.patchState((state) => {
        state.status = Status.Ready;
        obj.id = response.created.id;
        state.dataPoints = [...state.dataPoints, obj];
        state.dataPointsSourceMap[obj.id] = datasourceProtocol;
      });
    } catch (err) {
      this.toastr.error(
        this.translate.instant('settings-data-source-point.CreateError')
      );
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async updateDataPoint(
    datasourceProtocol: DataSourceProtocol,
    obj: SourceDataPoint
  ) {
    this._store.patchState((state) => {
      state.status = Status.Updating;
    });

    try {
      await this.httpService.patch(
        `/datasources/${datasourceProtocol}/datapoints/${obj.id}`,
        obj
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.dataPoints = state.dataPoints.map((x) =>
          x.id != obj.id ? x : obj
        );
      });
    } catch (err) {
      this.toastr.error(
        this.translate.instant('settings-data-source-point.UpdateError')
      );
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async deleteDataPoint(
    datasourceProtocol: DataSourceProtocol,
    obj: SourceDataPoint
  ) {
    this._store.patchState((state) => {
      state.status = Status.Deleting;
    });

    try {
      await this.httpService.delete(
        `/datasources/${datasourceProtocol}/datapoints/${obj.id}`
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.dataPoints = state.dataPoints.filter((x) => x != obj);
      });
    } catch (err) {
      this.toastr.error(
        this.translate.instant('settings-data-source-point.DeleteError')
      );
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
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
      dataPointsSourceMap: {},
      dataPointsLivedata: {}
    };
  }
}
