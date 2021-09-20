import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GeneralComponent } from "./pages/settings/general/general.component";
import { DataSourceComponent } from './pages/settings/data-source/data-source.component';
import { DataSinkComponent } from "./pages/settings/data-sink/data-sink.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'settings/general',
        pathMatch: 'full',
    },
    {
        path: 'settings',
        redirectTo: 'settings/general',
        pathMatch: 'full',
    },
    {
        path: 'settings/general',
        component: GeneralComponent,
    },
    {
        path: 'settings/data-source',
        component: DataSourceComponent,
    },
    {
        path: 'settings/data-sink',
        component: DataSinkComponent,
    },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
