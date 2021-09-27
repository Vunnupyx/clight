import { NgModule } from '@angular/core';

import { DataMappingService } from './data-mapping.service';
import { DataSourceService } from './data-source.service';
import { DataSinkService } from './data-sink.service';
import { DataPointService } from './data-point.service';
import { SourceDataPointService } from './source-data-point.service';
import { DeviceInfoService } from './device-info.service';

@NgModule({
  providers: [
    DataMappingService,
    DataPointService,
    DataSinkService,
    DataSourceService,
    DeviceInfoService,
    SourceDataPointService
  ]
})
export class ServicesModule {}
