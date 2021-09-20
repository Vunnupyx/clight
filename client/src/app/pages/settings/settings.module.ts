import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import { ConfirmDialogModule } from 'app/shared/components/confirm-dialog/confirm-dialog.module';

import { GeneralComponent } from "./general/general.component";
import { DataSourceComponent } from './data-source/data-source.component';
import { DataSinkComponent } from "./data-sink/data-sink.component";
import { SelectTypeModalComponent } from './data-source/select-type-modal/select-type-modal.component';
import { SelectVarModalComponent } from "./data-sink/select-var-modal/select-var-modal.component";

const COMPONENTS = [
    GeneralComponent,
    DataSourceComponent,
    DataSinkComponent,
    SelectTypeModalComponent,
    SelectVarModalComponent,
];

@NgModule({
    imports: [
        SharedModule,
        ConfirmDialogModule,
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    entryComponents: [SelectTypeModalComponent],
})

export class SettingsModule { }