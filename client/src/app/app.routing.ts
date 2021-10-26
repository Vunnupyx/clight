import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {QuickStartGuard} from './shared/guards/quick-start.guard';
import {AppComponent} from "./app.component";
import {AuthGuard} from "./shared/guards/auth.guard";

// Uses nested route such as Angular does not support async guards queue
const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: AppComponent,
        canActivate: [QuickStartGuard],
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
