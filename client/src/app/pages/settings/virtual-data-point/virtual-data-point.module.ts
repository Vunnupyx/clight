import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';

import { ConfirmDialogModule } from 'app/shared/components/confirm-dialog/confirm-dialog.module';
import { SharedModule } from 'app/shared/shared.module';

import { VirtualDataPointComponent } from './virtual-data-point.component';
import {
  AuthGuard,
  CommissioningGuard,
  QuickStartGuard
} from 'app/shared/guards';
import { SetThresholdsModalComponent } from './set-thresholds-modal/set-thresholds-modal.component';
import { VirtualDataPointGuard } from './virtual-data-point.guard';
import { SetEnumerationModalComponent } from './set-enumeration-modal/set-enumeration-modal.component';
import { PromptDialogModule } from 'app/shared/components/prompt-dialog/prompt-dialog.module';
import { SetFormulaModalComponent } from './set-formula-modal/set-formula-modal.component';
import { EditScheduleModalComponent } from './edit-schedule-modal/edit-schedule-modal.component';
import { SetSchedulesModalComponent } from './set-schedules-modal/set-schedules-modal.component';
import { SetBlinkSettingsModalComponent } from './set-blink-settings-modal/set-blink-settings-modal.component';

const routes: Routes = [
  {
    path: 'settings/virtual-data-point',
    component: VirtualDataPointComponent,
    canActivate: [CommissioningGuard, AuthGuard, QuickStartGuard],
    canDeactivate: [VirtualDataPointGuard]
  }
];

const COMPONENTS = [
  VirtualDataPointComponent,
  SetThresholdsModalComponent,
  SetEnumerationModalComponent,
  SetFormulaModalComponent,
  SetSchedulesModalComponent,
  EditScheduleModalComponent,
  SetBlinkSettingsModalComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    SharedModule,
    ConfirmDialogModule,
    PromptDialogModule,
    RouterModule.forRoot(routes),
    NgxEchartsModule
  ],
  exports: [RouterModule, ...COMPONENTS],
  providers: [VirtualDataPointGuard]
})
export class VirtualDataPointModule {}
