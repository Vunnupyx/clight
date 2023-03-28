import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule
} from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { NetworkComponent } from './network.component';
import { SharedModule } from 'app/shared/shared.module';
import { AuthGuard, QuickStartGuard } from 'app/shared/guards';

const routes: Route[] = [
  {
    path: 'settings/network',
    component: NetworkComponent,
    canActivate: [AuthGuard, QuickStartGuard]
  }
];

const COMPONENTS = [NetworkComponent];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    SharedModule,
    RouterModule.forRoot(routes),
    MatDatepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule
  ],
  exports: [RouterModule, ...COMPONENTS]
})
export class NetworkModule {}
