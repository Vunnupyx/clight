import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { AlertDialogComponent } from './alert-dialog.component';

@NgModule({
    imports: [SharedModule],
    declarations: [AlertDialogComponent],
    exports: [AlertDialogComponent]
})
export class AlertDialogModule {}
