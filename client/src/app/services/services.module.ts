import { NgModule } from "@angular/core";

import { DataSourceService } from "./data-source.service";
import { DataSinkService } from "./data-sink.service";
import { DataPointService } from "./data-point.service";
import { SourceDataPointService } from "./source-data-point.service";

@NgModule({
    providers: [
        DataPointService,
        DataSinkService,
        DataSourceService,
        SourceDataPointService,
    ]
})
export class ServicesModule { }