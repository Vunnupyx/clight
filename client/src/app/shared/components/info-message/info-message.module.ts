import { NgModule } from '@angular/core';
import { InfoMessageComponent } from './info-message.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [InfoMessageComponent],
  exports: [InfoMessageComponent]
})
export class InfoMessageModule {}
