import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { DataPointService } from 'app/services';
import { PromptService } from 'app/shared/services/prompt.service';
import { Observable } from 'rxjs';
import { DataSinkComponent } from './data-sink.component';

@Injectable()
export class DataSinkGuard implements CanDeactivate<DataSinkComponent> {
  constructor(
    private service: DataPointService,
    private promptService: PromptService
  ) {}

  canDeactivate(
    _component: DataSinkComponent,
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
