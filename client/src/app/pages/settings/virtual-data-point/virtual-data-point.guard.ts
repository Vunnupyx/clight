import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { VirtualDataPointService } from 'app/services';
import { PromptService } from 'app/shared/services/prompt.service';
import { Observable } from 'rxjs';
import { VirtualDataPointComponent } from './virtual-data-point.component';

@Injectable()
export class VirtualDataPointGuard
  implements CanDeactivate<VirtualDataPointComponent>
{
  constructor(
    private service: VirtualDataPointService,
    private promptService: PromptService
  ) {}

  canDeactivate(
    _component: VirtualDataPointComponent,
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
