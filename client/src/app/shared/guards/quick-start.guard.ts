import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { TemplateService } from '../../services';

@Injectable({
  providedIn: 'root'
})
export class QuickStartGuard implements CanActivate {
  constructor(
    private router: Router,
    private templateService: TemplateService,
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const isCompleted = await this.templateService.isCompleted();

    if (!isCompleted) {
      if (route.routeConfig?.path === 'quick-start') {
        return true;
      }

      return this.router.navigate(['/quick-start']);
    }

    return this.router.navigate(['/settings/general']);
  }
}
