import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ConfirmDialogModule } from 'app/shared/components/confirm-dialog/confirm-dialog.module';

import { DataSourceComponent } from './data-source.component';
import { SelectTypeModalComponent } from './select-type-modal/select-type-modal.component';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { DataSourceGuard } from './data-source.guard';
import { InfoMessageModule } from 'app/shared/components/info-message/info-message.module';

const routes: Routes = [
  {
    path: 'settings/data-source',
    component: DataSourceComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DataSourceGuard]
  }
];

const COMPONENTS = [DataSourceComponent, SelectTypeModalComponent];

@NgModule({
  imports: [
    SharedModule,
    ConfirmDialogModule,
    RouterModule.forRoot(routes),
    InfoMessageModule
  ],
  declarations: COMPONENTS,
  exports: [RouterModule, ...COMPONENTS],
  providers: [DataSourceGuard]
})
export class DataSourceModule {}
