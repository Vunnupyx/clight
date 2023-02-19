import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SystemInformationComponent } from './system-information.component';
import { SharedModule } from 'app/shared/shared.module';
import { AuthGuard, QuickStartGuard } from 'app/shared/guards';
import { LoadingDialogModule } from 'app/shared/components/loading-dialog/loading-dialog.module';

const routes: Routes = [
  {
    path: 'system-information',
    component: SystemInformationComponent,
    canActivate: [AuthGuard, QuickStartGuard]
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
