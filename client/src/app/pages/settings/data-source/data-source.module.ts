import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SharedModule } from "app/shared/shared.module";
import { ConfirmDialogModule } from 'app/shared/components/confirm-dialog/confirm-dialog.module';

import { DataSourceComponent } from './data-source.component';
import { SelectTypeModalComponent } from './select-type-modal/select-type-modal.component';

const routes: Routes = [
    {
        path: 'settings/data-source',
        component: DataSourceComponent,
    },
];

const COMPONENTS = [
    DataSourceComponent,
    SelectTypeModalComponent,
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
    entryComponents: [SelectTypeModalComponent],
})

export class DataSourceModule { }