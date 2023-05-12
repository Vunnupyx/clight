import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetServiceComponent } from './net-service.component';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthGuard,
  CommissioningGuard,
  QuickStartGuard
} from 'app/shared/guards';
import { SharedModule } from 'app/shared/shared.module';

const routes: Routes = [
  {
    path: 'net-service',
    component: NetServiceComponent,
    canActivate: [CommissioningGuard, AuthGuard, QuickStartGuard]
  }
];

const COMPONENTS = [NetServiceComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class NetServiceModule {}
