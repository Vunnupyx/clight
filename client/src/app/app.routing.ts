import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GeneralComponent } from "./pages/settings/general/general.component";
import { HomeComponent } from "./pages/home/home.component";

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
        path: 'home',
        component: HomeComponent,
    },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
