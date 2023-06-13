import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import {
  TemplateService,
  TermsAndConditionsService,
  CommissioningService
} from 'app/services';
import { AuthService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class QuickStartGuard implements CanActivate {
  constructor(
    private router: Router,
    private templateService: TemplateService,
    private termsService: TermsAndConditionsService,
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
      const isCompleted = await this.templateService.isCompleted();
      const isTermsAccepted = await this.termsService.isAccepted();

      if (isCompleted && isTermsAccepted) {
        return true;
      }
    }

    return this.router.navigate(['/quick-start']).then(() => false);
  }
}
