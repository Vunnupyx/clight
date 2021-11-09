import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { DataMappingService } from 'app/services';
import { PromptService } from 'app/shared/services/prompt.service';
import { Observable } from 'rxjs';
import { DataMappingComponent } from './data-mapping.component';

@Injectable()
export class DataMappingGuard implements CanDeactivate<DataMappingComponent> {
  constructor(
    private service: DataMappingService,
    private promptService: PromptService
  ) {}

  canDeactivate(
    _component: DataMappingComponent,
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
