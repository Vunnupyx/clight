import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { QuickStartComponent } from './quick-start.component';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard } from "../../shared/guards/auth.guard";

const routes: Routes = [
  {
    path: 'quick-start',
    component: QuickStartComponent,
    data: { noLayout: true },
    canActivate: [AuthGuard],
  }
];

const COMPONENTS = [QuickStartComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [...COMPONENTS],
})
export class QuickStartModule { }
