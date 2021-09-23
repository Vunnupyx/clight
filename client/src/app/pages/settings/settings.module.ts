import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { GeneralSettingsModule } from './general/general.module';
import { DataSinkModule } from './data-sink/data-sink.module';
import { DataSourceModule } from './data-source/data-source.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'settings',
    redirectTo: 'settings/general',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    SharedModule,
    GeneralSettingsModule,
    DataSinkModule,
    DataSourceModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class SettingsModule {}
