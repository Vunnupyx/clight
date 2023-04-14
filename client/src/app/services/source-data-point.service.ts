import { Injectable } from '@angular/core';
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import {
  DataPointLiveData,
  DataSource,
  DataSourceProtocol,
  SourceDataPoint,
  SourceDataPointType
} from 'app/models';
import { HttpService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { array2map, clone, errorHandler, ObjectMap } from 'app/shared/utils';
import { from, interval, Observable } from 'rxjs';
import { DataSourceService } from './data-source.service';
import { SystemInformationService } from './system-information.service';
import { filterLiveData } from 'app/shared/utils/filter-livedata';
import { v4 as uuidv4 } from 'uuid';

export class SourceDataPointsState {
  status!: Status;
  touched!: boolean;
  originalDataPoints!: SourceDataPoint[];
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

  get isTouched() {
    return this._store.snapshot.touched || this.dataSourceService.touched;
  }

  constructor(
    storeFactory: StoreFactory<SourceDataPointsState>,
    private httpService: HttpService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private dataSourceService: DataSourceService,
    private systemInformationService: SystemInformationService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  async revert(): Promise<boolean> {
    if (this._store.snapshot.touched) {
      this._store.patchState((state) => {
        state.dataPoints = clone(state.originalDataPoints);
        state.touched = false;
      });
    }

    if (this.dataSourceService.touched) {
      this.dataSourceService.revert();
    }

    return Promise.resolve(true);
  }

  async apply(datasourceProtocol: DataSourceProtocol): Promise<boolean> {
    try {
      this._store.patchState((state) => {
        state.status = Status.Loading;
      });

      if (this.dataSourceService.touched) {
        await this.dataSourceService.apply(datasourceProtocol);
      }

      if (this._store.snapshot.touched) {
        await this.httpService.patch(
          `/datasources/${datasourceProtocol}/dataPoints`,
          this._store.snapshot.dataPoints
        );

        this._getDataPoints(datasourceProtocol);
      }

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.touched = false;
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

  /**
   * Send a request to ping endpoint of the data source api and wait for a returned delay float value as string
   * @param protocol destination for the request
   * @returns
   */
  async ping(protocol: DataSourceProtocol | undefined): Promise<string> {
    if (protocol === undefined) protocol = DataSourceProtocol.S7;
    const errorHandler = () => {
      this.toastr.error(
        this.translate.instant('settings-data-source-point.HostUnreachable')
      );
      return Promise.resolve(
        this.translate.instant('settings-data-source-point.HostUnreachable')
      );
    };

    return this.httpService
      .get(`/datasources/${protocol}/ping`)
      .then((res) => {
        this.toastr.success(
          this.translate.instant(
            `settings-data-source-point.ConnectionAvailableWithDelay`
          ) +
            res.delay +
            ' ms'
        );
        return res.delay;
      })
      .catch(() => {
        return errorHandler();
      });
  }

  async getDataPoints(datasourceProtocol: DataSourceProtocol) {
    this._store.patchState((state) => ({
      status: Status.Loading,
      dataPoints: []
    }));

    try {
      await this._getDataPoints(datasourceProtocol);
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
      const { dataSources } = await this.httpService.get<{
        dataSources: DataSource[];
      }>(`/datasources`);

      let dataPoints: SourceDataPoint[] = [];
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
          ...dataSource.dataPoints.map((x) =>
            this._parseDataPoint(x, dataSource)
          )
        );
      }

      this._store.patchState((state) => {
        state.dataPoints = dataPoints;
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
      const offset = await this.systemInformationService.getServerTimeOffset();
      this._store.patchState((state) => {
        state.dataPointsLivedata = array2map(
          Object.values(liveData).filter(filterLiveData(offset)),
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
    obj.id = uuidv4();

    this._store.patchState((state) => {
      state.status = Status.Ready;
      state.dataPoints = [obj, ...state.dataPoints];
      state.dataPointsSourceMap[obj.id] = datasourceProtocol;
      state.touched = true;
    });
  }

  async updateDataPoint(
    datasourceProtocol: DataSourceProtocol,
    obj: SourceDataPoint
  ) {
    this._store.patchState((state) => {
      state.dataPoints = state.dataPoints.map((x) =>
        x.id != obj.id ? x : obj
      );
      state.touched = true;
    });
  }

  async deleteDataPoint(
    datasourceProtocol: DataSourceProtocol,
    obj: SourceDataPoint
  ) {
    this._store.patchState((state) => {
      state.dataPoints = state.dataPoints.filter((x) => x.id != obj.id);
      state.touched = true;
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
      case DataSourceProtocol.Energy:
        return `[Energy]`;
      case DataSourceProtocol.MTConnect:
        return `[MTC]`;
      default:
        return '';
    }
  }

  private async _getDataPoints(datasourceProtocol: DataSourceProtocol) {
    const { dataPoints } = await this.httpService.get<{
      dataPoints: SourceDataPoint[];
    }>(`/datasources/${datasourceProtocol}/datapoints`);

    this._store.patchState((state) => {
      state.dataPoints = dataPoints;
      state.originalDataPoints = clone(state.dataPoints);
      state.dataPointsSourceMap = array2map(
        state.dataPoints,
        (item) => item.id,
        () => datasourceProtocol
      );
      state.status = Status.Ready;
    });
  }

  private _parseDataPoint(
    dataPoint: SourceDataPoint,
    parentSource: DataSource
  ) {
    if (parentSource) {
      dataPoint.enabled = Boolean(parentSource.enabled);
    }
    return dataPoint;
  }

  private _emptyState() {
    return <SourceDataPointsState>{
      status: Status.NotInitialized,
      touched: false,
      dataPoints: [] as SourceDataPoint[],
      originalDataPoints: [] as SourceDataPoint[],
      dataPointsSourceMap: {},
      dataPointsLivedata: {}
    };
  }
}
