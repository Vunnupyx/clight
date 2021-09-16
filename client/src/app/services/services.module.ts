import { NgModule } from "@angular/core";

import { DataPointService } from "./data-point.service";
import { DataSourceService } from "./data-source.service";

@NgModule({
    providers: [
        DataPointService,
        DataSourceService,
    ]
})
export class ServicesModule { }