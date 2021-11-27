import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';

import { DataPoint, DataSinkProtocol } from 'app/models';
import { HttpService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import {
  array2map,
  clone,
  errorHandler,
  flatArray,
  ObjectMap
} from 'app/shared/utils';
import * as api from 'app/api/models';
import { IChangesAppliable, IChangesState } from 'app/models/core/data-changes';
import { BaseChangesService } from './base-changes.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DataSinkService } from './data-sink.service';

export class DataPointsState {
  status!: Status;
  originalDataPoints!: DataPoint[];
  dataPoints!: DataPoint[];
  dataPointsSinkMap!: ObjectMap<DataSinkProtocol>;
}

@Injectable()
export class DataPointService
  extends BaseChangesService<DataPoint>
  implements IChangesAppliable
{
  private _store: Store<DataPointsState>;

  get isTouched() {
    return this._changes.snapshot.touched || this.dataSinksService.touched;
  }

  constructor(
    storeFactory: StoreFactory<DataPointsState>,
    changesFactory: StoreFactory<IChangesState<string, DataPoint>>,
    private httpService: HttpService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private dataSinksService: DataSinkService
  ) {
    super(changesFactory);

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
      const { dataPoints } = await this.httpService.get<api.DataPointList>(
        `/datasinks/${protocol}/dataPoints`
      );
      this._store.patchState((state) => {
        state.dataPoints = dataPoints!.map((x) => this._parseDataPoint(x));
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
        dataSinks: api.DataSinkType[];
      }>(`/datasinks`);

      let dataPoints: api.DataPointType[] = [];
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
          ...(dataSink.dataPoints as api.DataPointType[])
        );
      }

      this._store.patchState((state) => {
        state.dataPoints = dataPoints.map((x) => this._parseDataPoint(x));
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
    this.create(obj);
    this._store.patchState((state) => {
      state.status = Status.Ready;
      state.dataPoints = [...state.dataPoints, obj];
      state.dataPointsSinkMap[obj.id] = protocol;
    });

    // this._store.patchState((state) => {
    //   state.status = Status.Creating;
    // });

    // try {
    //   const response = await this.httpService.post(
    //     `/datasinks/${protocol}/dataPoints`,
    //     obj
    //   );
    //   this._store.patchState((state) => {
    //     state.status = Status.Ready;
    //     obj.id = response.created.id;
    //     state.dataPoints.push(obj);
    //     state.dataPointsSinkMap[obj.id!] = protocol;
    //   });
    // } catch (err) {
    //   errorHandler(err);
    //   // TODO: Show error message (toast notification?)
    //   this._store.patchState((state) => {
    //     state.status = Status.Ready;
    //   });
    // }
  }

  async updateDataPoint(protocol: DataSinkProtocol, obj: DataPoint) {
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

  async deleteDataPoint(protocol: DataSinkProtocol, obj: DataPoint) {
    this.delete(obj.id);

    this._store.patchState((state) => {
      state.status = Status.Ready;
      state.dataPoints = state.dataPoints.filter((x) => x.id != obj.id);
    });
  }

  revert(): Promise<boolean> {
    if (this.dataSinksService.touched) {
      this.dataSinksService.revert();
    }

    if (this._changes.snapshot.touched) {
      this._store.patchState((state) => {
        state.dataPoints = clone(state.originalDataPoints);
      });

      this.resetState();
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

      if (this._changes.snapshot.touched) {
        await this.httpService.post(
          `/datasinks/${protocol}/dataPoints/bulk`,
          this.getPayload()
        );

        this.resetState();
      }

      this._store.patchState((state) => {
        state.status = Status.Ready;
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

  private _parseDataPoint(obj: api.DataPointType) {
    return obj as any as DataPoint;
  }

  private _emptyState() {
    return <DataPointsState>{
      status: Status.NotInitialized,
      dataPointsSinkMap: {}
    };
  }
}
