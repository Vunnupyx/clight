import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Uses nested route such as Angular does not support async guards queue
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'settings/general'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
