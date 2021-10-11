import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {QuickStartGuard} from './shared/guards/quick-start.guard';
import {AppComponent} from "./app.component";


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AppComponent,
    canActivate: [QuickStartGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
