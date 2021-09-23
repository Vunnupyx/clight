/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationInterface } from './api-configuration';

import { DatasourceService } from './services/datasource.service';
import { DatasinksService } from './services/datasinks.service';
import { VirtualDatapointsService } from './services/virtual-datapoints.service';
import { BackupService } from './services/backup.service';
import { MappingsService } from './services/mappings.service';
import { DeviceInfosService } from './services/device-infos.service';

/**
 * Provider for all Api services, plus ApiConfiguration
 */
@NgModule({
  imports: [
    HttpClientModule
  ],
  exports: [
    HttpClientModule
  ],
  declarations: [],
  providers: [
    ApiConfiguration,
    DatasourceService,
    DatasinksService,
    VirtualDatapointsService,
    BackupService,
    MappingsService,
    DeviceInfosService
  ],
})
export class ApiModule {
  static forRoot(customParams: ApiConfigurationInterface): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
