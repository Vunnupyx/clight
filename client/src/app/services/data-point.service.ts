import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';

import { DataPoint } from 'app/models';
import { HttpMockupService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { errorHandler } from 'app/shared/utils';
import { DATA_POINTS_MOCK } from './data-point.service.mock';
import * as api from 'app/api/models';

export class DataPointsState {
  status: Status;
  dataPoints: DataPoint[];
}

@Injectable()
export class DataPointService {
  private _store: Store<DataPointsState>;

  constructor(
    storeFactory: StoreFactory<DataPointsState>,
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

  async getDataPoints(datasinkId: string) {
    this._store.patchState((state) => ({
      status: Status.Loading,
      dataPoints: []
    }));

    try {
      const dataPoints = await this.httpService.get<api.DataPointType[]>(
        `/datasinks/${datasinkId}/dataPoints`,
        undefined,
        DATA_POINTS_MOCK(datasinkId)
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

  async addDataPoint(datasinkId: string, obj: DataPoint) {
    this._store.patchState((state) => {
      state.status = Status.Creating;
    });

    try {
      await this.httpService.post(`/datasinks/${datasinkId}/dataPoints`, obj);
      this._store.patchState((state) => {
        state.status = Status.Ready;
        // TODO: Obtain new ID from JSON response
        obj.id = 'new id';
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

  async updateDataPoint(datasinkId: string, obj: DataPoint) {
    this._store.patchState((state) => {
      state.status = Status.Updating;
    });

    try {
      await this.httpService.patch(
        `/datasinks/${datasinkId}/dataPoints/${obj.id}`,
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

  async deleteDataPoint(datasinkId: string, obj: DataPoint) {
    this._store.patchState((state) => {
      state.status = Status.Deleting;
    });

    try {
      await this.httpService.delete(
        `/datasinks/${datasinkId}/dataPoints/${obj.id}`
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
