import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ConfirmDialogModule } from 'app/shared/components/confirm-dialog/confirm-dialog.module';

import { DataMappingComponent } from './data-mapping.component';
import { AuthGuard, QuickStartGuard } from 'app/shared/guards';
import { DataMappingGuard } from './data-mapping.guard';

const routes: Routes = [
  {
    path: 'settings/data-mapping',
    component: DataMappingComponent,
    canActivate: [AuthGuard, QuickStartGuard],
    canDeactivate: [DataMappingGuard]
  }
];

const COMPONENTS = [DataMappingComponent];

@NgModule({
  imports: [SharedModule, ConfirmDialogModule, RouterModule.forRoot(routes)],
  declarations: COMPONENTS,
  exports: [RouterModule, ...COMPONENTS],
  providers: [DataMappingGuard]
})
export class DataMappingModule {}
