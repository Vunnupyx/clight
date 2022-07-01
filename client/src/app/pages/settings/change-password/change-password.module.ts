import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ChangePasswordComponent } from './change-password.component';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: 'settings/change-password',
    component: ChangePasswordComponent,
  },
  {
    path: 'forced-change-password',
    component: ChangePasswordComponent,
    data: { noLayout: true },
  },
];

const COMPONENTS = [
  ChangePasswordComponent,
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forRoot(routes),
  ],
})
export class ChangePasswordModule { }
