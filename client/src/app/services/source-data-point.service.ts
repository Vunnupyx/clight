import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';

import { SourceDataPoint } from 'app/models';
import { HttpMockupService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { errorHandler } from 'app/shared/utils';
import { SOURCE_DATA_POINTS_MOCK } from './source-data-point.service.mock';
import * as api from 'app/api/models';

export class SourceDataPointsState {
  status: Status;
  sourceDataPoints: SourceDataPoint[];
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

  get sourceDataPoints() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.sourceDataPoints));
  }

  async getSourceDataPoints(datasourceId: string) {
    this._store.patchState((state) => ({
      status: Status.Loading,
      sourceDataPoints: []
    }));

    try {
      const sourceDataPoints = await this.httpService.get<
        api.Sourcedatapoint[]
      >(
        `/datasources/${datasourceId}/dataPoints`,
        undefined,
        SOURCE_DATA_POINTS_MOCK(datasourceId)
      );
      this._store.patchState((state) => {
        state.sourceDataPoints = sourceDataPoints.map((x) =>
          this._parseDataPoint(x)
        );
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

  async addDataPoint(datasourceId: string, obj: SourceDataPoint) {
    this._store.patchState((state) => {
      state.status = Status.Creating;
    });

    try {
      await this.httpService.post(
        `/datasources/${datasourceId}/dataPoints`,
        obj
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        // TODO: Obtain new ID from JSON response
        obj.id = 'new id';
        state.sourceDataPoints.push(obj);
      });
    } catch (err) {
      errorHandler(err);
      // TODO: Show error message (toast notification?)
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async updateDataPoint(datasourceId: string, obj: SourceDataPoint) {
    this._store.patchState((state) => {
      state.status = Status.Updating;
    });

    try {
      await this.httpService.patch(
        `/datasources/${datasourceId}/dataPoints/${obj.id}`,
        obj
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.sourceDataPoints = state.sourceDataPoints.map((x) =>
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

  async deleteDataPoint(datasourceId: string, obj: SourceDataPoint) {
    this._store.patchState((state) => {
      state.status = Status.Deleting;
    });

    try {
      await this.httpService.delete(
        `/datasources/${datasourceId}/dataPoints/${obj.id}`
      );
      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.sourceDataPoints = state.sourceDataPoints.filter((x) => x != obj);
      });
    } catch (err) {
      errorHandler(err);
      // TODO: Show error message (toast notification?)
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  private _parseDataPoint(obj: api.Sourcedatapoint) {
    return obj as SourceDataPoint;
  }

  private _emptyState() {
    return <SourceDataPointsState>{
      status: Status.NotInitialized
    };
  }
}
