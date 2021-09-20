import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface SelectVarModalData {
    selection: string;
}

@Component({
    selector: 'app-select-var-modal',
    templateUrl: 'select-var-modal.component.html',
})
export class SelectVarModalComponent {

    rows = [
        { area: 'B[.]', component: 'S', variable: 'ncAutoCounter[.]' },
        { area: 'B[.]', component: 'S', variable: 'ncAutoCounter[.]' },
        { area: 'B[.]', component: 'S', variable: 'ncAutoCounter[.]' },
        { area: 'B[.]', component: 'S', variable: 'ncAutoCounter[.]' },
    ];

    constructor(
        private dialogRef: MatDialogRef<SelectVarModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SelectVarModalData,
    ) { }

    onSelect({ selected }) {
        this.dialogRef.close(selected[0]);
    }

    onClose() {
        this.dialogRef.close();
    }

}