import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface SelectTypeModalData {
    selection: string;
}

@Component({
    selector: 'app-select-type-modal',
    templateUrl: 'select-type-modal.component.html',
})
export class SelectTypeModalComponent {

    rows = [
        { area: 'B[.]', component: 'S', variable: 'ncAutoCounter[.]' },
        { area: 'B[.]', component: 'S', variable: 'ncAutoCounter[.]' },
        { area: 'B[.]', component: 'S', variable: 'ncAutoCounter[.]' },
        { area: 'B[.]', component: 'S', variable: 'ncAutoCounter[.]' },
    ];

    constructor(
        private dialogRef: MatDialogRef<SelectTypeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SelectTypeModalData,
    ) { }

    onSelect({ selected }) {
        this.dialogRef.close(selected[0]);
    }

    onClose() {
        this.dialogRef.close();
    }

}