import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {DataSinkService} from '../../../../services';
import {DataSinkProtocol, PreDefinedDataPoint} from '../../../../models';

export interface CreateDataItemModalData {
  dataSinkProtocol: DataSinkProtocol;
  existingAddresses: string[];
}

@Component({
  selector: 'app-create-data-item-modal',
  templateUrl: 'create-data-item-modal.component.html'
})
export class CreateDataItemModalComponent implements OnInit {
  rows: PreDefinedDataPoint[] = [];
  DataSinkProtocol = DataSinkProtocol;

  constructor(
    private dataSinkService: DataSinkService,
    private dialogRef: MatDialogRef<CreateDataItemModalComponent, PreDefinedDataPoint>,
    @Inject(MAT_DIALOG_DATA) public data: CreateDataItemModalData
  ) {}

  ngOnInit() {
    if (this.data.dataSinkProtocol === DataSinkProtocol.MTConnect) {
      this.rows = this.dataSinkService.getPredefinedMtConnectDataPoints();
    }
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
}
