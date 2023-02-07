import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SystemInformationComponent } from './system-information.component';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { LoadingDialogModule } from '../../shared/components/loading-dialog/loading-dialog.module';

const routes: Routes = [
  {
    path: 'system-information',
    component: SystemInformationComponent,
    canActivate: [AuthGuard]
  }
];

const COMPONENTS = [SystemInformationComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    LoadingDialogModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class SystemInformationModule {}
