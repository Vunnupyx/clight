import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
    imports: [SharedModule],
    declarations: [ConfirmDialogComponent],
    exports: [ConfirmDialogComponent]
})
export class ConfirmDialogModule {}
