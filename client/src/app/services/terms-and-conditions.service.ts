import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { filter, map } from 'rxjs/operators';

import { Status, Store, StoreFactory } from '../shared/state';
import { HttpService } from '../shared';
import { errorHandler } from '../shared/utils';
import { CommissioningService } from 'app/services';
export class TermsAndConditionsState {
  status!: Status;
  text!: string;
  accepted!: boolean;
}

@Injectable()
export class TermsAndConditionsService {
  private _store: Store<TermsAndConditionsState>;

  get accepted() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.accepted));
  }

  get termsText() {
    return this._store.state
      .pipe(filter((x) => x.status != Status.NotInitialized))
      .pipe(map((x) => x.text));
  }

  constructor(
    storeFactory: StoreFactory<TermsAndConditionsState>,
    private httpService: HttpService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private commissioningService: CommissioningService
  ) {
    this._store = storeFactory.startFrom(this._emptyState());
  }

  async getTermsAndConditions(lang: string): Promise<boolean> {
    try {
      const response = await this.httpService.get<{
        text: string;
        accepted: boolean;
      }>(`/terms-and-conditions`, { params: { lang } } as any);

      const isCommissioningSkipped =
        await this.commissioningService.isSkipped();

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.text = response.text;
        state.accepted = isCommissioningSkipped || response.accepted;
      });

      return isCommissioningSkipped || response.accepted;
    } catch (err) {
      this.toastr.error(this.translate.instant('quick-start.TermsLoadError'));
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });

      return true;
    }
  }

  async accept(accepted) {
    try {
      await this.httpService.post<any>(`/terms-and-conditions/accept`, {
        accepted
      });

      this._store.patchState((state) => {
        state.status = Status.Ready;
        state.accepted = accepted;
      });
    } catch (err) {
      this.toastr.error(this.translate.instant('quick-start.AcceptError'));
      errorHandler(err);
      this._store.patchState((state) => {
        state.status = Status.Ready;
      });
    }
  }

  async isAccepted() {
    if (this._store.snapshot.accepted === undefined) {
      return await this.getTermsAndConditions(this.translate.currentLang);
    }
    return this._store.snapshot.accepted;
  }

  private _emptyState() {
    return <TermsAndConditionsState>{
      status: Status.NotInitialized,
      text: ''
    };
  }
}
