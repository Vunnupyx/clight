import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";

import { GeneralComponent } from "./general/general.component";

const COMPONENTS = [
    GeneralComponent,
];

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
})

export class SettingsModule { }