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
import { DataSourceService } from './data-source.service';
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

  get isTouched() {
    return this._changes.snapshot.touched || this.dataSourceService.touched;
  }

  constructor(
    storeFactory: StoreFactory<SourceDataPointsState>,
    changesFactory: StoreFactory<IChangesState<string, SourceDataPoint>>,
    private httpService: HttpService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private dataSourceService: DataSourceService,
    private systemInformationService: SystemInformationService
  ) {
    super(changesFactory);

    this._store = storeFactory.startFrom(this._emptyState());
  }

  async revert(): Promise<boolean> {
    if (this._changes.snapshot.touched) {
      this._store.patchState((state) => {
        state.dataPoints = clone(state.originalDataPoints);
      });
    }

    if (this.dataSourceService.touched) {
      this.dataSourceService.revert();
    }

    this.resetState();

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

      if (this._changes.snapshot.touched) {
        await this.httpService.post(
          `/datasources/${datasourceProtocol}/dataPoints/bulk`,
          this.getPayload()
        );

        this._getDataPoints(datasourceProtocol);

        this.resetState();
      }

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

  /**
   * Send a request to ping endpoint of the data source api and wait for a returned delay float value as string
   * @param protocol destination for the request
   * @returns
   */
  async ping(protocol: DataSourceProtocol | undefined): Promise<string> {
    // Info: currently only s7 supports ping!
    if (protocol === undefined) protocol = DataSourceProtocol.S7;
    const errorHandler = () => {
      this.toastr.error(
        this.translate.instant('settings-data-source-point.HostUnreachable')
      );
      return Promise.resolve(
        this.translate.instant('settings-data-source-point.HostUnreachable')
      );
    };
    if (protocol !== DataSourceProtocol.S7) {
      return errorHandler();
    }
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
      const { dataSources } = await this.httpService.get<api.DataSourceList>(
        `/datasources`
      );

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
      case DataSourceProtocol.Energy:
        return `[ENERGY]`;
      default:
        return '';
    }
  }

  private async _getDataPoints(datasourceProtocol: DataSourceProtocol) {
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
  }

  private _parseDataPoint(
    obj: api.Sourcedatapoint,
    parentSource?: api.DataSourceType
  ) {
    const dataPoint = obj as SourceDataPoint;
    if (parentSource) {
      dataPoint.enabled = Boolean(parentSource.enabled);
    }
    return dataPoint;
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
