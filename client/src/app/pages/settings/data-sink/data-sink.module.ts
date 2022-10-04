import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';

import { SharedModule } from 'app/shared/shared.module';
import { ConfirmDialogModule } from 'app/shared/components/confirm-dialog/confirm-dialog.module';

import { DataSinkComponent } from './data-sink.component';
import { DataSinkMtConnectComponent } from './data-sink-mt-connect/data-sink-mt-connect.component';
import { CreateDataItemModalComponent } from './create-data-item-modal/create-data-item-modal.component';
import { SelectMapModalComponent } from './select-map-modal/select-map-modal.component';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { DataSinkGuard } from './data-sink.guard';
import { RegisterMachineComponent } from './register-machine/register-machine.component';
import { MessengerConnectionComponent } from './messenger-connection/messenger-connection.component';

const routes: Routes = [
  {
    path: 'settings/data-sink',
    component: DataSinkComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DataSinkGuard]
  }
];

const COMPONENTS = [
  DataSinkComponent,
  DataSinkMtConnectComponent,
  CreateDataItemModalComponent,
  SelectMapModalComponent,
  RegisterMachineComponent,
  MessengerConnectionComponent
];

@NgModule({
  imports: [
    SharedModule,
    ConfirmDialogModule,
    MatTableModule,
    RouterModule.forRoot(routes)
  ],
  declarations: COMPONENTS,
  exports: [RouterModule, ...COMPONENTS],
  providers: [DataSinkGuard]
})
export class DataSinkModule {}
