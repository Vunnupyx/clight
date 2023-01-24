import { NgModule } from '@angular/core';
import { LoadingDialogComponent } from './loading-dialog.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [LoadingDialogComponent],
  exports: [LoadingDialogComponent]
})
export class LoadingDialogModule {}
