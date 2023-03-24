import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { QuickStartComponent } from './quick-start.component';
import { SharedModule } from 'app/shared/shared.module';
import { AuthGuard, CommissioningGuard } from 'app/shared/guards';

const routes: Routes = [
  {
    path: 'quick-start',
    component: QuickStartComponent,
    data: { noLayout: true },
    canActivate: [CommissioningGuard, AuthGuard]
  }
];

const COMPONENTS = [QuickStartComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  exports: [...COMPONENTS]
})
export class QuickStartModule {}
