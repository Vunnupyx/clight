import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, of } from 'rxjs';
import { filter, map, mergeMap, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../shared';

@Component({
  selector: 'app-layer',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  routeData$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.route),
    mergeMap((route) => {
      if (route.firstChild) {
        return route.firstChild!.data;
      }

      return of({});
    })
  );

  get supportHref() {
    return `${window.location.protocol}//${window.location.hostname}/help/docs/`;
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  async logout() {
    await this.auth.logout();
  }
}
