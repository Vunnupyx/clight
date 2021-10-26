import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfirmDialogModule } from 'app/shared/components/confirm-dialog/confirm-dialog.module';
import { SharedModule } from 'app/shared/shared.module';

import { VirtualDataPointComponent } from './virtual-data-point.component';
import {AuthGuard} from "../../../shared/guards/auth.guard";

const routes: Routes = [
  {
    path: 'settings/virtual-data-point',
    component: VirtualDataPointComponent,
    canActivate: [AuthGuard],
  }
];

const COMPONENTS = [VirtualDataPointComponent]

@NgModule({
  declarations: COMPONENTS,
  imports: [
    SharedModule,
    ConfirmDialogModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule, ...COMPONENTS]
})
export class VirtualDataPointModule { }
