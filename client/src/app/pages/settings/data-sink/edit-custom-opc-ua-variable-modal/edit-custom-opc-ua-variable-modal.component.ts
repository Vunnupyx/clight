import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataPointDataType, PreDefinedDataPoint } from 'app/models';
import { Subscription } from 'rxjs';

export interface EditCustomOpcUaVariableModalData {
  existingAddresses: string[];
  customDatapoint: PreDefinedDataPoint;
}

@Component({
  selector: 'app-edit-custom-opc-ua-variable-modal',
  templateUrl: 'edit-custom-opc-ua-variable-modal.component.html'
})
export class EditCustomOpcUaVariableModalComponent implements OnInit {
  DataPointDataType = DataPointDataType;

  customDatapoint: PreDefinedDataPoint;

  sub = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<
      EditCustomOpcUaVariableModalComponent,
      PreDefinedDataPoint
    >,
    @Inject(MAT_DIALOG_DATA) public data: EditCustomOpcUaVariableModalData
  ) {}

  ngOnInit() {
    this.customDatapoint = { ...this.data.customDatapoint };
  }

  isDuplicatingAddress(unsavedObj: PreDefinedDataPoint) {
    if (!this.data.existingAddresses) {
      return false;
    }

    // check whether other DPs do not have such address
    const newAddress = unsavedObj?.address?.toLowerCase().trim();

    return this.data.existingAddresses.some((addr) => {
      return addr?.toLowerCase().trim() === newAddress;
    });
  }

  onSave() {
    this.dialogRef.close(this.customDatapoint);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
