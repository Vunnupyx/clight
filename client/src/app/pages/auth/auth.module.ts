import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { LoginComponent } from './login/login.component';
import { AuthGuard, CommissioningGuard } from 'app/shared/guards';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { noLayout: true },
    canActivate: [AuthGuard, CommissioningGuard]
  }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, RouterModule.forRoot(routes), SharedModule],
  providers: []
})
export class AuthModule {}
