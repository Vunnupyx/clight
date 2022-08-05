import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ConfirmDialogModule } from 'app/shared/components/confirm-dialog/confirm-dialog.module';

import { DataSourceComponent } from './data-source.component';
import { SelectTypeModalComponent } from './select-type-modal/select-type-modal.component';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { DataSourceIoshieldComponent } from './data-source-ioshield/data-source-ioshield.component';
import { DataSourceMtconnectComponent } from './data-source-mtconnect/data-source-mtconnect.component';
import { DataSourceGuard } from './data-source.guard';

const routes: Routes = [
  {
    path: 'settings/data-source',
    component: DataSourceComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DataSourceGuard]
  }
];

const COMPONENTS = [
  DataSourceComponent,
  SelectTypeModalComponent,
  DataSourceIoshieldComponent,
  DataSourceMtconnectComponent
];

@NgModule({
    imports: [SharedModule, ConfirmDialogModule, RouterModule.forRoot(routes)],
    declarations: COMPONENTS,
    exports: [RouterModule, ...COMPONENTS],
    providers: [DataSourceGuard]
})
export class DataSourceModule {}
