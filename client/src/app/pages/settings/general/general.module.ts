import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { GeneralComponent } from './general.component';
import { DeviceInfoComponent } from './device-info/device-info.component';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { UpdateDialogComponent } from './update/update-dialog.component';
import { ConfirmDialogModule } from 'app/shared/components/confirm-dialog/confirm-dialog.module';
import { AlertDialogModule } from 'app/shared/components/alert-dialog/alert-dialog.module';
import { LoadingDialogModule } from '../../../shared/components/loading-dialog/loading-dialog.module';

const routes: Routes = [
  {
    path: 'settings/general',
    component: GeneralComponent,
    canActivate: [AuthGuard]
  }
];

const COMPONENTS = [
  GeneralComponent,
  DeviceInfoComponent,
  UpdateDialogComponent
];

@NgModule({
  imports: [
    SharedModule,
    AlertDialogModule,
    ConfirmDialogModule,
    LoadingDialogModule,
    RouterModule.forRoot(routes)
  ],
  declarations: COMPONENTS,
  exports: [RouterModule, ...COMPONENTS]
})
export class GeneralSettingsModule {}
