import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';

import { DataPoint, DataSinkProtocol } from 'app/models';
import { HttpMockupService, HttpService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { errorHandler, flatArray } from 'app/shared/utils';
import * as api from 'app/api/models';
import { CreateEntityResponse } from 'app/models/responses/create-entity.response';

export class DataPointsState {
  status!: Status;
  dataPoints!: DataPoint[];
}

@Injectable()
export class DataPointService {
  private _store: Store<DataPointsState>;

  constructor(
    storeFactory: StoreFactory<DataPointsState>,
    private httpService: HttpService
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
      const { dataPoints } = await this.httpService.get<api.DataPointList>(
        `/datasinks/${protocol}/dataPoints`
      );
      this._store.patchState((state) => {
        state.dataPoints = dataPoints!.map((x) => this._parseDataPoint(x));
        state.status = Status.Ready;
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

      const dataPoints = flatArray(
        dataSinks?.map((x) => x.dataPoints) as api.DataPointType[][]
      );

      this._store.patchState((state) => {
        state.dataPoints = dataPoints.map((x) => this._parseDataPoint(x));
        state.status = Status.Ready;
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
    this._store.patchState((state) => {
      state.status = Status.Creating;
    });

    try {
      const response = await this.httpService.post(
        `/datasinks/${protocol}/dataPoints`,
        obj
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        obj.id = response.created.id;
        state.dataPoints.push(obj);
      });
    } catch (err) {
      errorHandler(err);
      // TODO: Show error message (toast notification?)
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async updateDataPoint(protocol: DataSinkProtocol, obj: DataPoint) {
    this._store.patchState((state) => {
      state.status = Status.Updating;
    });

    try {
      await this.httpService.patch(
        `/datasinks/${protocol}/dataPoints/${obj.id}`,
        obj
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.dataPoints = state.dataPoints.map((x) =>
          x.id != obj.id ? x : obj
        );
      });
    } catch (err) {
      errorHandler(err);
      // TODO: Show error message (toast notification?)
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async deleteDataPoint(protocol: DataSinkProtocol, obj: DataPoint) {
    this._store.patchState((state) => {
      state.status = Status.Deleting;
    });

    try {
      await this.httpService.delete(
        `/datasinks/${protocol}/dataPoints/${obj.id}`
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.dataPoints = state.dataPoints.filter((x) => x != obj);
      });
    } catch (err) {
      errorHandler(err);
      // TODO: Show error message (toast notification?)
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  private _parseDataPoint(obj: api.DataPointType) {
    return obj as any as DataPoint;
  }

  private _emptyState() {
    return <DataPointsState>{
      status: Status.NotInitialized
    };
  }
}
