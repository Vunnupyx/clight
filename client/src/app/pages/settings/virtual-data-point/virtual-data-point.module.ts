import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';

import { ConfirmDialogModule } from 'app/shared/components/confirm-dialog/confirm-dialog.module';
import { SharedModule } from 'app/shared/shared.module';

import { VirtualDataPointComponent } from './virtual-data-point.component';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { SetThresholdsModalComponent } from './set-thresholds-modal/set-thresholds-modal.component';
import { VirtualDataPointGuard } from './virtual-data-point.guard';
import { SetEnumerationModalComponent } from './set-enumeration-modal/set-enumeration-modal.component';
import { PromptDialogModule } from 'app/shared/components/prompt-dialog/prompt-dialog.module';
import { SetFormulaModalComponent } from './set-formula-modal/set-formula-modal.component';
import { EditScheduleModalComponent } from './edit-schedule-modal/edit-schedule-modal.component';
import { SetSchedulesModalComponent } from './set-schedules-modal/set-schedules-modal.component';
import { InfoMessageModule } from 'app/shared/components/info-message/info-message.module';

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
  SetEnumerationModalComponent,
  SetFormulaModalComponent,
  SetSchedulesModalComponent,
  EditScheduleModalComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    SharedModule,
    ConfirmDialogModule,
    PromptDialogModule,
    RouterModule.forRoot(routes),
    NgxEchartsModule,
    InfoMessageModule
  ],
  exports: [RouterModule, ...COMPONENTS],
  providers: [VirtualDataPointGuard]
})
export class VirtualDataPointModule {}
