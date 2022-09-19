import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataPointDataType, DataSink, PreDefinedDataPoint } from 'app/models';
import { DataSinkService } from 'app/services';
import { Subscription } from 'rxjs';

export interface EditCustomOpcUaVariableModalData {
  isEditing?: boolean;
  customDatapoint: PreDefinedDataPoint;
}

@Component({
  selector: 'app-edit-custom-opc-ua-variable-modal',
  templateUrl: 'edit-custom-opc-ua-variable-modal.component.html'
})
export class EditCustomOpcUaVariableModalComponent implements OnInit {
  DataPointDataType = DataPointDataType;

  customDatapoint: PreDefinedDataPoint;
  existingAddresses: string[];

  sub = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<
    EditCustomOpcUaVariableModalComponent,
    EditCustomOpcUaVariableModalData
    >,
    @Inject(MAT_DIALOG_DATA) public data: EditCustomOpcUaVariableModalData,
    private dataSinkService: DataSinkService
  ) {}

  ngOnInit() {
    this.customDatapoint = { ...this.data.customDatapoint };

    this.sub.add(
      this.dataSinkService.opcDataSink.subscribe((x) => this.onOpcDataSink(x))
    );
  }

  onOpcDataSink(x: DataSink): void {
    if (this.data.isEditing) {
      return;
    }
    const predefinedOPCDataPoints = this.dataSinkService.getPredefinedOPCDataPoints();
    this.existingAddresses = [
      ...(predefinedOPCDataPoints || []).map(dp => dp.address).filter(Boolean),
      ...(x.customDataPoints || []).map(dp => dp.address).filter(Boolean),
    ];
  }

  isDuplicatingAddress(unsavedObj: PreDefinedDataPoint) {
    if (!this.existingAddresses) {
      return false;
    }

    // check whether other DPs do not have such address
    const newAddress = unsavedObj?.address?.toLowerCase().trim();

    return this.existingAddresses.some((addr) => {
      return addr?.toLowerCase().trim() === newAddress;
    });
  }

  onSave() {
    this.dialogRef.close({ customDatapoint: this.customDatapoint });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
