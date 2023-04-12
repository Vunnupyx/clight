import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { AuthService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const isLoggedIn = !!this.authService.token;

    if (isLoggedIn) {
      if (route.routeConfig?.path === 'login')
        return this.router.navigate(['/']);

      return true;
    }
    if (route.routeConfig?.path === 'login') return true;

    return this.router.navigate(['/login']).then(() => false);
  }
}
