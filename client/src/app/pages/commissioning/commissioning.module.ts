import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommissioningComponent } from './commissioning.component';
import { SharedModule } from 'app/shared/shared.module';

const routes: Routes = [
  {
    path: 'commissioning',
    component: CommissioningComponent,
    data: { noLayout: true }
  }
];

const COMPONENTS = [CommissioningComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class CommissioningModule {}
