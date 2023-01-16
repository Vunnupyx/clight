import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { LayoutComponent } from './layout.component';

const COMPONENTS = [LayoutComponent];

@NgModule({
  imports: [SharedModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class LayoutModule {}
