import {Injectable} from '@angular/core';
import {filter, map} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {DataPoint, DataSink, DataSinkConnection, DataSinkProtocol} from 'app/models';
import {HttpService} from 'app/shared';
import {Status, Store, StoreFactory} from 'app/shared/state';
import {errorHandler, mapOrder} from 'app/shared/utils';
import * as api from 'app/api/models';
import PREDEFINED_MTCONNECT_DATA_POINTS from './constants/mtconnectDataItems';
import PREDEFINED_OPCUA_DATA_POINTS from './constants/opcuaDataItems';

const DATA_SINKS_ORDER = [
  DataSinkProtocol.MTConnect,
  DataSinkProtocol.OPC,
  DataSinkProtocol.DH,
];

export class DataSinksState {
  status!: Status;
  dataSinks!: DataSink[];
  connection?: DataSinkConnection;
}

@Injectable()
export class DataSinkService {
  private _store: Store<DataSinksState>;

  constructor(
    storeFactory: StoreFactory<DataSinksState>,
    private httpService: HttpService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  get status() {
    return this._store.snapshot.status;
  }

  get dataSinks() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.dataSinks));
  }

  get connection() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.connection));
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
        state.dataSinks = this._orderByProtocol(dataSinks
          .map((x) => this._parseDataSink(x)));
      });
    } catch (err) {
      this.toastr.error(
        this.translate.instant('settings-data-sink.LoadError')
      );
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed,
      }));
    }
  }

  async getStatus(protocol: DataSinkProtocol) {
    this._store.patchState((state) => {
      state.status = Status.Loading;
    });

    try {
      const obj = await this.httpService.get<DataSinkConnection>(`/datasinks/${protocol}/status`);
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.connection = obj;
      });
    } catch (err) {
      errorHandler(err);
      this.toastr.error(
        this.translate.instant('settings-data-sink.LoadStatusError')
      );
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
    });

    try {
      await this.httpService.patch(`/datasinks/${protocol}`, obj);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    } catch (err) {
      this.toastr.error(
        this.translate.instant('settings-data-sink.UpdateError')
      );
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  getPredefinedMtConnectDataPoints(): DataPoint[] {
    return PREDEFINED_MTCONNECT_DATA_POINTS as any as DataPoint[];
  }

  getPredefinedOPCDataPoints(): DataPoint[] {
    return PREDEFINED_OPCUA_DATA_POINTS as any as DataPoint[];
  }

  private _orderByProtocol(objs: DataSink[]) {
    return mapOrder<DataSink>(objs, DATA_SINKS_ORDER, 'protocol');
  }

  private _parseDataSink(obj: api.DataSinkType) {
    return obj as any as DataSink;
  }

  private _emptyState() {
    return <DataSinksState>{
      status: Status.NotInitialized
    };
  }
}
