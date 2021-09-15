import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";

import { SettingsModule } from "../settings/settings.module";

import { LayoutComponent } from "./layout.component";
import { ClockComponent } from "./clock/clock.component";

const COMPONENTS = [
    ClockComponent,
    LayoutComponent,
];

@NgModule({
    imports: [
        SharedModule,

        // TODO: Remove. Use routing instead
        SettingsModule,
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
})

export class LayoutModule { }