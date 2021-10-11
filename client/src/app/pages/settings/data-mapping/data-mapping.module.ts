import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ConfirmDialogModule } from 'app/shared/components/confirm-dialog/confirm-dialog.module';

import { DataMappingComponent } from './data-mapping.component';

const routes: Routes = [
  {
    path: 'settings/data-mapping',
    component: DataMappingComponent
  }
];

const COMPONENTS = [DataMappingComponent];

@NgModule({
  imports: [SharedModule, ConfirmDialogModule, RouterModule.forRoot(routes)],
  declarations: COMPONENTS,
  exports: [RouterModule, ...COMPONENTS]
})
export class DataMappingModule {}
