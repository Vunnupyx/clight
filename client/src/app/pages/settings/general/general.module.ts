import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { GeneralComponent } from './general.component';
import { DeviceInfoComponent } from './device-info/device-info.component';
import { AuthGuard, QuickStartGuard } from 'app/shared/guards';
import { UpdateDialogComponent } from './update/update-dialog.component';
import { ConfirmDialogModule } from 'app/shared/components/confirm-dialog/confirm-dialog.module';
import { AlertDialogModule } from 'app/shared/components/alert-dialog/alert-dialog.module';

const routes: Routes = [
  {
    path: 'settings/general',
    component: GeneralComponent,
    canActivate: [AuthGuard, QuickStartGuard]
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
    RouterModule.forRoot(routes)
  ],
  declarations: COMPONENTS,
  exports: [RouterModule, ...COMPONENTS]
})
export class GeneralSettingsModule {}
