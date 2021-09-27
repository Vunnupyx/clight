import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {DataSinkService} from '../../../../services';
import {DataPoint, DataSinkProtocol} from '../../../../models';

export interface CreateDataItemModalData {
  selection: string;
  dataSinkProtocol: DataSinkProtocol;
}

@Component({
  selector: 'app-create-data-item-modal',
  templateUrl: 'create-data-item-modal.component.html'
})
export class CreateDataItemModalComponent implements OnInit {
  rows: DataPoint[] = [];
  DataSinkProtocol = DataSinkProtocol;

  constructor(
    private dataSinkService: DataSinkService,
    private dialogRef: MatDialogRef<CreateDataItemModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateDataItemModalData
  ) {}

  ngOnInit() {
    switch (this.data.dataSinkProtocol) {
      case DataSinkProtocol.MTConnect:
        this.rows = this.dataSinkService.getPredefinedMtConnectDataPoints();
        break;
      case DataSinkProtocol.OPC:
        this.rows = this.dataSinkService.getPredefinedOPCDataPoints();
        break;
      case DataSinkProtocol.DH:
        break;
      default:
        break;
    }
  }

  onSelect({ selected }) {
    this.dialogRef.close(selected[0]);
  }

  onClose() {
    this.dialogRef.close();
  }
}
