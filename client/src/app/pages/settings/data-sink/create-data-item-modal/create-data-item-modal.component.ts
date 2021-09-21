import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PRE_DEFINED_DATA_POINTS } from './create-data-item-modal.component.mock';

export interface CreateDataItemModalData {
    selection: string;
}

@Component({
    selector: 'app-create-data-item-modal',
    templateUrl: 'create-data-item-modal.component.html',
})
export class CreateDataItemModalComponent {

    rows = PRE_DEFINED_DATA_POINTS();

    constructor(
        private dialogRef: MatDialogRef<CreateDataItemModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CreateDataItemModalData,
    ) { }

    onSelect({ selected }) {
        this.dialogRef.close(selected[0]);
    }

    onClose() {
        this.dialogRef.close();
    }

}