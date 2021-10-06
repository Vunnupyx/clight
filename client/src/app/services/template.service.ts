import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { filter, map } from 'rxjs/operators';

import { Status, Store, StoreFactory } from '../shared/state';
import { AvailableDataSink, AvailableDataSource, TemplatesStatus } from '../models/template';
import { HttpService } from '../shared';
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
    private httpService: HttpService,
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
      const response = await this.httpService.get<any>(`/templates`);

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
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
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
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async isCompleted() {
    try {
      const response = await this.httpService.get<TemplatesStatus>(`/templates/status`);

      return response.completed;
    } catch (err) {
      return false;
    }
  }

  private _emptyState() {
    return <TemplatesState>{
      status: Status.NotInitialized,
    };
  }
}
