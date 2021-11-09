import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { SourceDataPointService } from 'app/services';
import { PromptService } from 'app/shared/services/prompt.service';
import { Observable } from 'rxjs';
import { DataSourceComponent } from './data-source.component';

@Injectable()
export class DataSourceGuard implements CanDeactivate<DataSourceComponent> {
  constructor(
    private service: SourceDataPointService,
    private promptService: PromptService
  ) {}

  canDeactivate(
    _component: DataSourceComponent,
    _currentRoute: ActivatedRouteSnapshot,
    _currentState: RouterStateSnapshot,
    _nextState: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.service.isTouched) {
      return true;
    }

    return this.promptService
      .warn()
      .then(() => this.service.revert())
      .catch(() => false);
  }
}
