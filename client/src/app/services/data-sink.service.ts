import { Injectable } from '@angular/core';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { from, interval, Observable } from 'rxjs';

import {
  DataSink,
  DataSinkConnection,
  DataSinkProtocol,
  PreDefinedDataPoint
} from 'app/models';
import { HttpService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { clone, errorHandler, mapOrder } from 'app/shared/utils';
import * as api from 'app/api/models';
import PREDEFINED_MTCONNECT_DATA_POINTS from './constants/mtconnectDataItems';
import PREDEFINED_OPCUA_DATA_POINTS from './constants/opcuaDataItems';

const DATA_SINKS_ORDER = [
  DataSinkProtocol.MTConnect,
  DataSinkProtocol.OPC,
  DataSinkProtocol.DH
];

export class DataSinksState {
  status!: Status;
  touched!: boolean;
  dataSinks!: DataSink[];
  originalDataSinks!: DataSink[];
  connection?: DataSinkConnection;
}

@Injectable()
export class DataSinkService {
  private _store: Store<DataSinksState>;

  constructor(
    storeFactory: StoreFactory<DataSinksState>,
    private httpService: HttpService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  get status() {
    return this._store.snapshot.status;
  }

  get touched() {
    return this._store.snapshot.touched;
  }

  get dataSinks() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.dataSinks));
  }

  get opcDataSink() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(
        map((x) =>
          x.dataSinks.find(
            (dataSink) => dataSink.protocol === DataSinkProtocol.OPC
          )
        )
      );
  }

  get connection() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.connection));
  }

  setStatusTimer(protocol: DataSinkProtocol): Observable<void> {
    // made first call
    this.getStatus(protocol);

    return interval(2000).pipe(mergeMap(() => from(this.getStatus(protocol))));
  }

  revert() {
    this._store.patchState((state) => {
      state.status = Status.Ready;
      state.dataSinks = clone(state.originalDataSinks);
      state.touched = false;
    });
  }

  async apply(protocol: DataSinkProtocol) {
    const ds = this._store.snapshot.dataSinks.find(
      (x) => x.protocol === protocol
    )!;

    const payload: Partial<DataSink> = {};

    if (protocol === DataSinkProtocol.MTConnect) {
      payload.enabled = ds.enabled;
    }

    if (protocol === DataSinkProtocol.OPC) {
      payload.enabled = ds.enabled;

      if (ds.auth) {
        payload.auth = ds.auth;
      }
      if (ds.customDataPoints) {
        payload.customDataPoints = ds.customDataPoints;
      }
    }

    await this.httpService.patch(`/datasinks/${protocol}`, payload);

    this._store.patchState((state) => {
      state.status = Status.Ready;
      state.originalDataSinks = clone(state.dataSinks);
      state.touched = false;
    });
  }

  async getDataSinks() {
    this._store.patchState((state) => ({
      status: Status.Loading,
      dataSinks: []
    }));

    try {
      const { dataSinks } = await this.httpService.get<{
        dataSinks: api.DataSinkType[];
      }>(`/datasinks`);
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.dataSinks = this._orderByProtocol(
          dataSinks.map((x) => this._parseDataSink(x))
        );
        state.originalDataSinks = clone(state.dataSinks);
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('settings-data-sink.LoadError'));
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  async getStatus(protocol: DataSinkProtocol) {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });

    try {
      const obj = await this.httpService.get<DataSinkConnection>(
        `/datasinks/${protocol}/status`
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.connection = obj;
      });
    } catch (err) {
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.connection = undefined;
      });
    }
  }

  async updateDataSink(protocol: DataSinkProtocol, obj: Partial<DataSink>) {
    this._store.patchState((state) => {
      state.dataSinks = state.dataSinks.map((x) =>
        x.protocol != protocol ? x : { ...x, ...obj }
      );
      state.touched = true;
    });
  }

  addCustomDatapoint(protocol: DataSinkProtocol, obj: PreDefinedDataPoint) {
    this._store.patchState((state) => {
      state.dataSinks = state.dataSinks.map((dataSink) => {
        if (dataSink.protocol != protocol) {
          return dataSink;
        }
        const customDataPoints = dataSink.customDataPoints || [];
        return {
          ...dataSink,
          customDataPoints: [...customDataPoints, obj]
        };
      });
      state.touched = true;
    });
  }

  updateCustomDatapoint(protocol: DataSinkProtocol, obj: PreDefinedDataPoint) {
    this._store.patchState((state) => {
      state.dataSinks = state.dataSinks.map((dataSink) => {
        if (dataSink.protocol != protocol) {
          return dataSink;
        }
        const customDataPoints = dataSink.customDataPoints || [];
        return {
          ...dataSink,
          customDataPoints: customDataPoints.map((dp) =>
            dp.address === obj.address ? obj : dp
          )
        };
      });
      state.touched = true;
    });
  }

  deleteCustomDatapoint(protocol: DataSinkProtocol, obj: PreDefinedDataPoint) {
    this._store.patchState((state) => {
      state.dataSinks = state.dataSinks.map((dataSink) => {
        if (dataSink.protocol != protocol) {
          return dataSink;
        }
        const customDataPoints = dataSink.customDataPoints || [];
        return {
          ...dataSink,
          customDataPoints: customDataPoints.filter(
            (dp) => dp.address !== obj.address
          )
        };
      });
      state.touched = true;
    });
  }

  getPredefinedMtConnectDataPoints() {
    return PREDEFINED_MTCONNECT_DATA_POINTS;
  }

  getPredefinedOPCDataPoints() {
    return PREDEFINED_OPCUA_DATA_POINTS;
  }

  private _orderByProtocol(objs: DataSink[]) {
    return mapOrder<DataSink>(objs, DATA_SINKS_ORDER, 'protocol');
  }

  private _parseDataSink(obj: api.DataSinkType) {
    return obj as any as DataSink;
  }

  private _emptyState() {
    return <DataSinksState>{
      status: Status.NotInitialized,
      touched: false
    };
  }
}
