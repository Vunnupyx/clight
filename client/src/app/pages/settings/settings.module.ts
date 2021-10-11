import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { GeneralSettingsModule } from './general/general.module';
import { DataSinkModule } from './data-sink/data-sink.module';
import { DataSourceModule } from './data-source/data-source.module';
import { DataMappingModule } from './data-mapping/data-mapping.module';
import { NetworkModule } from './network/network.module';
import { VirtualDataPointModule } from './virtual-data-point/virtual-data-point.module';

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
    DataMappingModule,
    NetworkModule,
    VirtualDataPointModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class SettingsModule {}
