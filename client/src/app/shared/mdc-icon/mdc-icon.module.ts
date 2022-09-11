import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIcon, MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MdcIconRegistry } from './mdc-icon.service';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports: [
    MatIcon,
  ],
  providers: [{
    provide: MatIconRegistry,
    useClass: MdcIconRegistry,
  }],
})
export class MdcIconModule {}
