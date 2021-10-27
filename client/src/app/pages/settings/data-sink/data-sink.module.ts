import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ConfirmDialogModule } from 'app/shared/components/confirm-dialog/confirm-dialog.module';

import { DataSinkComponent } from './data-sink.component';
import { DataSinkMtConnectComponent } from './data-sink-mt-connect/data-sink-mt-connect.component';
import { CreateDataItemModalComponent } from './create-data-item-modal/create-data-item-modal.component';
import { SelectMapModalComponent } from './select-map-modal/select-map-modal.component';
import {AuthGuard} from "../../../shared/guards/auth.guard";

const routes: Routes = [
  {
    path: 'settings/data-sink',
    component: DataSinkComponent,
    canActivate: [AuthGuard],
  }
];

const COMPONENTS = [
  DataSinkComponent,
  DataSinkMtConnectComponent,
  CreateDataItemModalComponent,
  SelectMapModalComponent
];

@NgModule({
  imports: [SharedModule, ConfirmDialogModule, RouterModule.forRoot(routes)],
  declarations: COMPONENTS,
  exports: [RouterModule, ...COMPONENTS]
})
export class DataSinkModule {}
