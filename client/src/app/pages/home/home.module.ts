import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";

import { HomeComponent } from "./home.component";


const COMPONENTS = [
    HomeComponent,
];

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
})

export class HomeModule { }