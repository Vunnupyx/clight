import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { CommissioningService } from 'app/services';

@Injectable({
  providedIn: 'root'
})
export class CommissioningGuard implements CanActivate {
  constructor(
    private router: Router,
    private commissioningService: CommissioningService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const isFinished = await this.commissioningService.isFinished();

    if (isFinished) {
      if (route.routeConfig?.path === 'commissioning')
        return this.router.navigate(['/']);

      return true;
    }
    if (route.routeConfig?.path === 'commissioning') return true;

    return this.router.navigate(['/commissioning']).then(() => false);
  }
}
