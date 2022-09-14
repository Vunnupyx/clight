import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DataSinkService } from '../../../../services';
import {
  DataPointDataType,
  DataSink,
  PreDefinedDataPoint
} from '../../../../models';
import { Subscription } from 'rxjs';

export interface SelectOpcUaVariableModalData {
  existingAddresses: string[];
}

@Component({
  selector: 'app-select-opc-ua-variable-modal',
  templateUrl: 'select-opc-ua-variable-modal.component.html'
})
export class SelectOpcUaVariableModalComponent implements OnInit {
  DataPointDataType = DataPointDataType;

  rows: PreDefinedDataPoint[] = [];
  customDatapointRows: PreDefinedDataPoint[] = [];

  sub = new Subscription();

  constructor(
    private dataSinkService: DataSinkService,
    private dialogRef: MatDialogRef<
      SelectOpcUaVariableModalComponent,
      PreDefinedDataPoint
    >,
    @Inject(MAT_DIALOG_DATA) public data: SelectOpcUaVariableModalData
  ) {}

  ngOnInit() {
    this.rows = this.dataSinkService.getPredefinedOPCDataPoints();

    this.sub.add(this.dataSinkService.opcDataSink.subscribe(x => this.onOpcDataSink(x)));
  }

  onOpcDataSink(x: DataSink) {
    this.customDatapointRows = x.customDatapoints;
  }

  onSelect(selected: PreDefinedDataPoint) {
    this.dialogRef.close(selected);
  }

  onClose() {
    this.dialogRef.close();
  }

  isExisting(address: string) {
    return this.data.existingAddresses.includes(address);
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }
}
