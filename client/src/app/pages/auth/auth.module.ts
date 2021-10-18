import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordGuard } from './reset-password/reset-password.guard';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { noLayout: true },
  },
  {
    path: 'reset-password/:resetToken',
    component: ResetPasswordComponent,
    data: { noLayout: true },
    canActivate: [ResetPasswordGuard],
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    SharedModule,
  ],
  providers: [ResetPasswordGuard]
})
export class AuthModule {}
