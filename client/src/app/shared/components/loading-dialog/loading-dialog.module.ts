import { NgModule } from '@angular/core';
import { LoadingDialogComponent } from './loading-dialog.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [LoadingDialogComponent],
  exports: [LoadingDialogComponent]
})
export class LoadingDialogModule {}
