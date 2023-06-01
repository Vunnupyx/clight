import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataPointDataType, PreDefinedDataPoint } from 'app/models';
import { Subscription } from 'rxjs';

export interface EditCustomOpcUaVariableModalData {
  existingNames: string[];
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

  isDuplicatingName(unsavedObj: PreDefinedDataPoint) {
    if (
      !Array.isArray(this.data.existingNames) ||
      this.data.existingNames?.length === 0
    ) {
      return false;
    }
    const newName = unsavedObj?.name?.toLowerCase().trim();

    return this.data.existingNames.some((dp) => {
      return dp?.toLowerCase().trim() === newName;
    });
  }

  isDuplicatingAddress(unsavedObj: PreDefinedDataPoint) {
    if (
      !Array.isArray(this.data.existingAddresses) ||
      this.data.existingAddresses?.length === 0
    ) {
      return false;
    }
    const newAddress = unsavedObj?.address?.toLowerCase().trim();

    return this.data.existingAddresses.some((dp) => {
      return dp?.toLowerCase().trim() === newAddress;
    });
  }

  onSave() {
    this.dialogRef.close(this.customDatapoint);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
