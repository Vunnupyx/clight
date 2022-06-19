import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';

import { ConfirmDialogModule } from 'app/shared/components/confirm-dialog/confirm-dialog.module';
import { SharedModule } from 'app/shared/shared.module';

import { VirtualDataPointComponent } from './virtual-data-point.component';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { SetThresholdsModalComponent } from './set-thresholds-modal/set-thresholds-modal.component';
import { VirtualDataPointGuard } from './virtual-data-point.guard';
import { SetSchedulesModalComponent } from './set-schedules-modal/set-schedules-modal.component';
import { EditScheduleModalComponent } from './edit-schedule-modal/edit-schedule-modal.component';

const routes: Routes = [
  {
    path: 'settings/virtual-data-point',
    component: VirtualDataPointComponent,
    canActivate: [AuthGuard],
    canDeactivate: [VirtualDataPointGuard]
  }
];

const COMPONENTS = [
  VirtualDataPointComponent,
  SetThresholdsModalComponent,
  SetSchedulesModalComponent,
  EditScheduleModalComponent,
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    SharedModule,
    ConfirmDialogModule,
    RouterModule.forRoot(routes),
    NgxEchartsModule
  ],
  exports: [RouterModule, ...COMPONENTS],
  entryComponents: [
    SetThresholdsModalComponent,
    SetSchedulesModalComponent,
  ],
  providers: [VirtualDataPointGuard]
})
export class VirtualDataPointModule {}
