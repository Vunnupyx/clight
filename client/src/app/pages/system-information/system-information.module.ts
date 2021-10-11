import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SystemInformationComponent } from './system-information.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: 'system-information',
    component: SystemInformationComponent,
  }
];

const COMPONENTS = [SystemInformationComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class SystemInformationModule { }
