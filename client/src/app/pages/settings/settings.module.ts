import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";

import { GeneralComponent } from "./general/general.component";
import { DataSourceComponent } from './data-source/data-source.component';
import { SelectTypeModalComponent } from './data-source/select-type-modal/select-type-modal.component';

const COMPONENTS = [
    GeneralComponent,
    DataSourceComponent,
    SelectTypeModalComponent,
];

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    entryComponents: [SelectTypeModalComponent],
})

export class SettingsModule { }