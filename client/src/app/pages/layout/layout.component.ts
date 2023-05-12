import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, of, Subscription } from 'rxjs';
import { filter, map, mergeMap, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../shared';
import { TimeSyncCheckService } from '../../services/time-sync-check.service';
import { TranslateService } from '@ngx-translate/core';
import { NetServiceService } from '../../services';

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

  noLayout = false;
  resetPasswordLayout = false;
  statusIcon: string;

  get supportHref() {
    return `${window.location.protocol}//${
      window.location.hostname
    }/help${this.translate.instant('common.LanguageDocumentationPath')}/docs/`;
  }

  subs = new Subscription();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private readonly translate: TranslateService,
    private timeSyncCheckService: TimeSyncCheckService,
    private netServiceService: NetServiceService
  ) {
    this.subs.add(
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          map(() => this.route),
          mergeMap((route) => {
            if (route.firstChild) {
              return route.firstChild!.data;
            }

            return of({});
          })
        )
        .subscribe(({ resetPasswordLayout, noLayout }) => {
          this.resetPasswordLayout = resetPasswordLayout;
          this.noLayout = noLayout;
        })
    );
  }

  ngOnInit() {
    this.subs.add(
      this.netServiceService.statusIcon.subscribe((x) => (this.statusIcon = x))
    );
    //Check time after a while to avoid not loading translation
    setTimeout(() => {
      this.timeSyncCheckService.checkTimeDifference();
    }, 500);
  }

  async logout() {
    await this.auth.logout();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
