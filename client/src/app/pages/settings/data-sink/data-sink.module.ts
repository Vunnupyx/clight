import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "app/shared/shared.module";
import { ConfirmDialogModule } from 'app/shared/components/confirm-dialog/confirm-dialog.module';

import { DataSinkComponent } from "./data-sink.component";
import { DataSinkMtConnectComponent } from "./data-sink-mt-connect/data-sink-mt-connect.component";
import { SelectVarModalComponent } from "./select-var-modal/select-var-modal.component";

const routes: Routes = [
    {
        path: 'settings/data-sink',
        component: DataSinkComponent,
    },
];

const COMPONENTS = [
    DataSinkComponent,
    DataSinkMtConnectComponent,
    SelectVarModalComponent,
];

@NgModule({
    imports: [
        SharedModule,
        ConfirmDialogModule,
        RouterModule.forRoot(routes),
    ],
    declarations: COMPONENTS,
    exports: [
        RouterModule,
        ...COMPONENTS,
    ],
})

export class DataSinkModule { }