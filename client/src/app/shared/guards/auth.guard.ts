import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { AuthService } from '../services';
import { CommissioningService } from 'app/services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private commissioningService: CommissioningService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const isLoggedIn = !!this.authService.token;
    const isCommissioningSkipped = await this.commissioningService.isSkipped();

    if (isLoggedIn || isCommissioningSkipped) {
      if (route.routeConfig?.path === 'login')
        return this.router.navigate(['/']);

      return true;
    }
    if (route.routeConfig?.path === 'login') return true;

    return this.router.navigate(['/login']).then(() => false);
  }
}
