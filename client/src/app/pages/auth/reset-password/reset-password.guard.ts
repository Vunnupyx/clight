import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../../shared';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.verifyResetToken(route.params.resetToken)
      .then(() => true)
      .catch(() => this.router.navigate(['/login']).then(() => false))
  }
}
