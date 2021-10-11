import { NgModule } from '@angular/core';

import { DataMappingService } from './data-mapping.service';
import { DataSourceService } from './data-source.service';
import { DataSinkService } from './data-sink.service';
import { DataPointService } from './data-point.service';
import { SourceDataPointService } from './source-data-point.service';
import { DeviceInfoService } from './device-info.service';
import { TemplateService } from './template.service';
import { NetworkService } from './network.service';
import { VirtualDataPointService } from './virtual-data-point.service';
import { SystemInformationService } from './system-information.service';

@NgModule({
  providers: [
    DataMappingService,
    DataPointService,
    DataSinkService,
    DataSourceService,
    DeviceInfoService,
    SourceDataPointService,
    TemplateService,
    NetworkService,
    VirtualDataPointService,
    SystemInformationService,
  ]
})
export class ServicesModule {}
