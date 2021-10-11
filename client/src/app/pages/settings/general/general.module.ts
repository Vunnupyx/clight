import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { GeneralComponent } from './general.component';
import { DeviceInfoComponent } from './device-info/device-info.component';

const routes: Routes = [
  {
    path: 'settings/general',
    component: GeneralComponent
  }
];

const COMPONENTS = [GeneralComponent, DeviceInfoComponent];

@NgModule({
  imports: [SharedModule, RouterModule.forRoot(routes)],
  declarations: COMPONENTS,
  exports: [RouterModule, ...COMPONENTS]
})
export class GeneralSettingsModule {}