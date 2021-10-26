import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { NetworkComponent } from './network.component';
import { SharedModule } from '../../../shared/shared.module';
import {AuthGuard} from "../../../shared/guards/auth.guard";

const routes: Route[] = [
  {
    path: 'settings/network',
    component: NetworkComponent,
    canActivate: [AuthGuard],
  }
];

const COMPONENTS = [NetworkComponent];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    SharedModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule, ...COMPONENTS]
})
export class NetworkModule { }
