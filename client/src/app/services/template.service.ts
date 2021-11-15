import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { filter, map } from 'rxjs/operators';

import { Status, Store, StoreFactory } from '../shared/state';
import { ITemplate, TemplatesStatus } from '../models/template';
import { HttpService } from '../shared';
import { errorHandler } from '../shared/utils';

export class TemplatesState {
  status!: Status;
  templates!: ITemplate[];
  completed!: boolean;
  currentTemplate!: string;
}

@Injectable()
export class TemplateService {
  private _store: Store<TemplatesState>;

  get templates() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.templates));
  }

  get currentTemplate() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.currentTemplate));
  }

  constructor(
    storeFactory: StoreFactory<TemplatesState>,
    private httpService: HttpService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  async getAvailableTemplates() {
    this._store.patchState(() => ({
      status: Status.Loading
    }));

    try {
      const response = await this.httpService.get<{
        templates: ITemplate[];
        currentTemplate: string;
      }>(`/templates`);

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.templates = response.templates;
        state.currentTemplate = response.currentTemplate;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('quick-start.LoadError'));
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async apply(data) {
    this._store.patchState(() => ({
      status: Status.Loading
    }));

    try {
      await this.httpService.post<any>(`/templates/apply`, data);

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.completed = true;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('quick-start.LoadError'));
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async skip() {
    this._store.patchState(() => ({
      status: Status.Loading
    }));

    try {
      await this.httpService.post<any>(`/templates/skip`, {});

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.completed = true;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('quick-start.LoadError'));
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async isCompleted() {
    try {
      if (this._store.snapshot.completed === undefined) {
        const response = await this.httpService.get<TemplatesStatus>(
          `/templates/status`
        );

        this._store.patchState((state) => {
          state.completed = response.completed;
        });

        return response.completed;
      }

      return this._store.snapshot.completed;
    } catch (err) {
      return false;
    }
  }

  private _emptyState() {
    return <TemplatesState>{
      status: Status.NotInitialized,
      templates: [] as ITemplate[]
    };
  }
}
