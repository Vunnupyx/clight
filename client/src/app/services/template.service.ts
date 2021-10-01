import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { filter, map } from 'rxjs/operators';

import { Status, Store, StoreFactory } from '../shared/state';
import { AvailableDataSink, AvailableDataSource } from '../models/template';
import {HttpMockupService, HttpService} from '../shared';
import { errorHandler } from '../shared/utils';


export class TemplatesState {
  status!: Status;
  availableDataSources!: AvailableDataSource[];
  availableDataSinks!: AvailableDataSink[];
}

@Injectable()
export class TemplateService {
  private _store: Store<TemplatesState>;

  get dataSources() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.availableDataSources));
  }

  get dataSinks() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.availableDataSinks));
  }

  constructor(
    storeFactory: StoreFactory<TemplatesState>,
    private httpService: HttpMockupService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  async getAvailableTemplates() {
    this._store.patchState(() => ({
      status: Status.Loading,
    }));

    try {
      const response = await this.httpService.get<any>(
        `/templates`,
        undefined,
        {
          availableDataSources: [
            {
              "id": "1",
              "name": "Data Source 1",
              "description": "Data Source 1 Description"
            },
            {
              "id": "2",
              "name": "Data Source 2",
              "description": "Data Source 2 Description"
            },
          ],
          availableDataSinks: [
            {
              "id": "1",
              "name": "Data Sink 1",
              "description": "Data Sink 1 Description"
            },
            {
              "id": "2",
              "name": "Data Sink 2",
              "description": "Data Sink 2 Description"
            },
            {
              "id": "3",
              "name": "Data Sink 3",
              "description": "Data Sink 3 Description"
            },
          ],
        }
      );

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.availableDataSources = response.availableDataSources;
        state.availableDataSinks = response.availableDataSinks;
      });
    } catch (err) {
      this.toastr.error(
        this.translate.instant('quick-start.LoadError')
      );
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Ready
      }));
    }
  }

  async apply(data) {
    this._store.patchState(() => ({
      status: Status.Loading,
    }));

    try {
      await this.httpService.post<any>(`/templates/apply`, data);

      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    } catch (err) {
      this.toastr.error(
        this.translate.instant('quick-start.LoadError')
      );
      errorHandler(err);
      this._store.patchState(() => ({
        status: Status.Ready
      }));
    }
  }

  private _emptyState() {
    return <TemplatesState>{
      status: Status.NotInitialized,
    };
  }
}
