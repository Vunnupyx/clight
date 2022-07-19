import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { PromptDialogComponent } from './prompt-dialog.component';

@NgModule({
  imports: [SharedModule],
  declarations: [PromptDialogComponent],
  exports: [PromptDialogComponent],
  entryComponents: [PromptDialogComponent]
})
export class PromptDialogModule {}
