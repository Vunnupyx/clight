import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";

import { GeneralComponent } from "./general/general.component";
import { DataSourceComponent } from './data-source/data-source.component';

const COMPONENTS = [
    GeneralComponent,
    DataSourceComponent,
];

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
})

export class SettingsModule { }