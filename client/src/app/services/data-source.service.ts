import { Injectable } from '@angular/core';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { from, interval, Observable } from 'rxjs';

import {
  DataSource,
  DataSourceConnection,
  DataSourceProtocol,
  EnergyTypes,
  IOShieldTypes,
  MTConnectTypes,
  S7Types
} from 'app/models';
import { HttpService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { clone, errorHandler, mapOrder } from 'app/shared/utils';
import NCK_ADDRESSES from 'app/services/constants/nckAddresses';
import ENERGY_ADDRESSES from 'app/services/constants/energyAddresses';

export class DataSourcesState {
  status!: Status;
  touched!: boolean;
  dataSources!: DataSource[];
  originalDataSources!: DataSource[];
  connection?: DataSourceConnection;
}

const DATA_SOURCES_ORDER = [
  DataSourceProtocol.S7,
  DataSourceProtocol.MTConnect,
  DataSourceProtocol.IOShield,
  DataSourceProtocol.Energy,
  DataSourceProtocol.OPC
];

@Injectable()
export class DataSourceService {
  private _store: Store<DataSourcesState>;

  constructor(
    storeFactory: StoreFactory<DataSourcesState>,
    private httpService: HttpService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  get status() {
    return this._store.snapshot.status;
  }

  get touched() {
    return this._store.snapshot.touched;
  }

  get dataSources() {
    return this._store.state.pipe(
      filter((x) => x.status != Status.NotInitialized),
      map((x) => x.dataSources)
    );
  }

  get connection() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.connection));
  }

  async getDataSources() {
    this._store.patchState((state) => ({
      status: Status.Loading,
      dataSources: []
    }));

    try {
      const { dataSources } = await this.httpService.get<{
        dataSources: DataSource[];
      }>(`/datasources`);
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.dataSources = this._orderByProtocol(dataSources);
        state.originalDataSources = clone(state.dataSources);
      });
    } catch (err) {
      this.toastr.error(
        this.translate.instant('settings-data-source.LoadError')
      );
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Failed
      }));
    }
  }

  setStatusTimer(protocol: DataSourceProtocol): Observable<void> {
    // made first call
    this.getStatus(protocol);

    return interval(2000).pipe(mergeMap(() => from(this.getStatus(protocol))));
  }

  async getStatus(datasourceProtocol: string) {
    try {
      const obj = await this.httpService.get<DataSourceConnection>(
        `/datasources/${datasourceProtocol}/status`
      );

      this._store.patchState((state) => {
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

  revert() {
    this._store.patchState((state) => {
      state.status = Status.Ready;
      state.dataSources = clone(state.originalDataSources);
      state.touched = false;
    });
  }

  async apply(protocol: DataSourceProtocol) {
    const ds = this._store.snapshot.dataSources.find(
      (x) => x.protocol === protocol
    )!;

    const payload: any = {};

    payload.enabled = ds.enabled;

    if (ds.connection) {
      payload.connection = ds.connection;
    }

    if (ds.softwareVersion) {
      payload.softwareVersion = ds.softwareVersion;
    }

    if (ds.type) {
      payload.type = ds.type;
    }

    if (ds.auth) {
      payload.auth = ds.auth;
    }

    if (protocol === DataSourceProtocol.MTConnect) {
      //Always send this with MTConnect so that empty string for removing machine name is also sent
      payload.machineName = ds.machineName;
    }

    await this.httpService.patch(`/datasources/${protocol}`, payload);

    this._store.patchState((state) => {
      state.status = Status.Ready;
      state.originalDataSources = clone(state.dataSources);
      state.touched = false;
    });
  }

  async updateDataSource(protocol: string, obj: Partial<DataSource>) {
    this._store.patchState((state) => {
      state.status = Status.Updating;
      state.dataSources = state.dataSources.map((x) =>
        x.protocol != protocol ? x : { ...x, ...obj }
      );
      state.touched = true;
    });
  }

  getNckAddresses() {
    return NCK_ADDRESSES;
  }

  getEnergyAddresses() {
    return ENERGY_ADDRESSES;
  }

  async getDataSourceType(
    protocol: DataSourceProtocol
  ): Promise<S7Types | MTConnectTypes | IOShieldTypes | EnergyTypes | null> {
    try {
      const ds = await this.httpService.get<DataSource>(
        `/datasources/${protocol}`
      );

      return ds.type;
    } catch {
      return null;
    }
  }

  private _orderByProtocol(objs: DataSource[]): DataSource[] {
    return mapOrder<DataSource>(objs, DATA_SOURCES_ORDER, 'protocol');
  }

  private _emptyState() {
    return <DataSourcesState>{
      status: Status.NotInitialized,
      touched: false
    };
  }
}
