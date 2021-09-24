import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DataSinkService } from '../../../../services';
import { DataPoint } from '../../../../models';

export interface CreateDataItemModalData {
  selection: string;
}

@Component({
  selector: 'app-create-data-item-modal',
  templateUrl: 'create-data-item-modal.component.html'
})
export class CreateDataItemModalComponent implements OnInit {
  rows: DataPoint[] = [];

  constructor(
    private dataSinkService: DataSinkService,
    private dialogRef: MatDialogRef<CreateDataItemModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateDataItemModalData
  ) {}

  ngOnInit() {
    this.rows = this.dataSinkService.getPredefinedDataPoints();
  }

  onSelect({ selected }) {
    this.dialogRef.close(selected[0]);
  }

  onClose() {
    this.dialogRef.close();
  }
}
