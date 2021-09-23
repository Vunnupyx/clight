import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';

import { SourceDataPoint } from 'app/models';
import { HttpMockupService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { errorHandler } from 'app/shared/utils';
import * as api from 'app/api/models';
import { CreateEntityResponse } from '../models/responses/create-entity.response';

export class SourceDataPointsState {
  status!: Status;
  dataPoints!: SourceDataPoint[];
}

@Injectable()
export class SourceDataPointService {
  private _store: Store<SourceDataPointsState>;

  constructor(
    storeFactory: StoreFactory<SourceDataPointsState>,
    private httpService: HttpMockupService
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

  async getDataPoints(datasourceProtocol: string) {
    this._store.patchState((state) => ({
      status: Status.Loading,
      dataPoints: []
    }));

    try {
      const { dataPoints } = await this.httpService.get<api.DataPointList>(
        `/datasources/${datasourceProtocol}/datapoints`
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

  async addDataPoint(datasourceProtocol: string, obj: SourceDataPoint) {
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

  async updateDataPoint(datasourceProtocol: string, obj: SourceDataPoint) {
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
      errorHandler(err);
      // TODO: Show error message (toast notification?)
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async deleteDataPoint(datasourceProtocol: string, obj: SourceDataPoint) {
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
      errorHandler(err);
      // TODO: Show error message (toast notification?)
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  private _parseDataPoint(obj: api.DataPointType) {
    return obj as SourceDataPoint;
  }

  private _emptyState() {
    return <SourceDataPointsState>{
      status: Status.NotInitialized
    };
  }
}
