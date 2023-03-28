import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { noLayout: true }
  }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, RouterModule.forRoot(routes), SharedModule],
  providers: []
})
export class AuthModule {}
