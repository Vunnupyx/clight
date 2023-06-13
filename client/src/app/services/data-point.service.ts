import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';

import { DataPoint, DataSink, DataSinkProtocol } from 'app/models';
import { HttpService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { array2map, clone, errorHandler, ObjectMap } from 'app/shared/utils';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DataSinkService } from './data-sink.service';
import { v4 as uuidv4 } from 'uuid';

export class DataPointsState {
  status!: Status;
  touched!: boolean;
  originalDataPoints!: DataPoint[];
  dataPoints!: DataPoint[];
  dataPointsSinkMap!: ObjectMap<DataSinkProtocol>;
}

@Injectable()
export class DataPointService {
  private _store: Store<DataPointsState>;

  get isTouched() {
    return this._store.snapshot.touched || this.dataSinksService.touched;
  }

  constructor(
    storeFactory: StoreFactory<DataPointsState>,
    private httpService: HttpService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private dataSinksService: DataSinkService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  get status() {
    return this._store.snapshot.status;
  }

  get dataPoints() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.dataPoints));
  }

  async getDataPoints(protocol: DataSinkProtocol) {
    this._store.patchState((state) => ({
      status: Status.Loading,
      dataPoints: []
    }));

    try {
      const { dataPoints } = await this.httpService.get<{
        dataPoints: DataPoint[];
      }>(`/datasinks/${protocol}/datapoints`);
      this._store.patchState((state) => {
        state.dataPoints = dataPoints;
        state.status = Status.Ready;
        state.originalDataPoints = clone(state.dataPoints);
        state.dataPointsSinkMap = array2map(
          state.dataPoints,
          (item) => item.id!,
          () => protocol
        );
      });
    } catch (err) {
      errorHandler(err);
      // TODO: Show error message (toast notification?)
      this._store.patchState(() => ({
        status: Status.Ready
      }));
    }
  }

  async getDataPointsAll() {
    this._store.patchState((state) => ({
      status: Status.Loading,
      dataPoints: []
    }));

    try {
      const { dataSinks } = await this.httpService.get<{
        dataSinks: DataSink[];
      }>(`/datasinks`);

      let dataPoints: DataPoint[] = [];
      let wholeMap = {};

      for (const dataSink of dataSinks) {
        const map = array2map(
          dataSink.dataPoints!,
          (item) => item.id!,
          () => dataSink.protocol
        );

        wholeMap = {
          ...wholeMap,
          ...map
        };

        dataPoints = dataPoints.concat(
          ...dataSink.dataPoints.map((x) => this._parseDataPoint(x, dataSink))
        );
      }

      this._store.patchState((state) => {
        state.dataPoints = dataPoints;
        state.status = Status.Ready;
        state.dataPointsSinkMap = wholeMap;
      });
    } catch (err) {
      errorHandler(err);
      // TODO: Show error message (toast notification?)
      this._store.patchState(() => ({
        status: Status.Ready
      }));
    }
  }

  async addDataPoint(protocol: DataSinkProtocol, obj: DataPoint) {
    obj.id = uuidv4();

    this._store.patchState((state) => {
      state.status = Status.Ready;
      state.dataPoints = [...state.dataPoints, obj];
      state.dataPointsSinkMap[obj.id] = protocol;
      state.touched = true;
    });
  }

  async updateDataPoint(protocol: DataSinkProtocol, obj: DataPoint) {
    this._store.patchState((state) => {
      state.dataPoints = state.dataPoints.map((x) =>
        x.id != obj.id ? x : obj
      );
      state.touched = true;
    });
  }

  async deleteDataPoint(protocol: DataSinkProtocol, obj: DataPoint) {
    this._store.patchState((state) => {
      state.status = Status.Ready;
      state.dataPoints = state.dataPoints.filter((x) => x.id != obj.id);
      state.touched = true;
    });
  }

  revert(): Promise<boolean> {
    if (this.dataSinksService.touched) {
      this.dataSinksService.revert();
    }

    if (this._store.snapshot.touched) {
      this._store.patchState((state) => {
        state.dataPoints = clone(state.originalDataPoints);
        state.touched = false;
      });
    }

    return Promise.resolve(true);
  }

  async apply(protocol: DataSinkProtocol): Promise<boolean> {
    try {
      this._store.patchState((state) => {
        state.status = Status.Loading;
      });

      if (this.dataSinksService.touched) {
        await this.dataSinksService.apply(protocol);
      }

      if (this._store.snapshot.touched) {
        await this.httpService.patch(
          `/datasinks/${protocol}/datapoints`,
          this._store.snapshot.dataPoints
        );
      }

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.touched = false;
      });

      this.toastr.success(
        this.translate.instant('settings-data-sink.BulkSuccess')
      );
    } catch {
      this.toastr.error(this.translate.instant('settings-data-sink.BulkError'));
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }

    return true;
  }

  getPrefix(id: string) {
    if (
      !this._store ||
      !this._store.snapshot ||
      !this._store.snapshot.dataPointsSinkMap
    ) {
      return '';
    }

    const protocol = this._store.snapshot.dataPointsSinkMap[id];

    switch (protocol) {
      case DataSinkProtocol.DH:
        return '[DATAHUB]';
      case DataSinkProtocol.MTConnect:
        return '[MTC]';
      case DataSinkProtocol.OPC:
        return '[OPCUA]';
      default:
        return '';
    }
  }

  private _parseDataPoint(dataPoint: DataPoint, parentSink: DataSink) {
    if (parentSink) {
      dataPoint.enabled = Boolean(parentSink.enabled);
    }
    return dataPoint;
  }

  private _emptyState() {
    return <DataPointsState>{
      status: Status.NotInitialized,
      touched: false,
      dataPointsSinkMap: {}
    };
  }
}
