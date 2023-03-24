import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DataSourceProtocol, SourceDataPointType } from '../../../../models';
import { DataSourceService } from '../../../../services';

export interface SelectTypeModalData {
  selection: string;
  type: SourceDataPointType;
  protocol: DataSourceProtocol;
  existingAddresses: string[];
}

@Component({
  selector: 'app-select-type-modal',
  templateUrl: 'select-type-modal.component.html',
  styleUrls: ['select-type-modal.component.scss']
})
export class SelectTypeModalComponent implements OnInit {
  rows: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<SelectTypeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectTypeModalData,
    private dataSourceService: DataSourceService
  ) {}

  ngOnInit() {
    this.rows =
      this.data.protocol === DataSourceProtocol.S7
        ? this.dataSourceService.getNckAddresses()
        : this.dataSourceService.getEnergyAddresses();
  }

  onSelect(row) {
    this.dialogRef.close(row);
  }

  isExisting({ address }) {
    return this.data.existingAddresses.includes(address);
  }

  isEnergySource() {
    return this.data.protocol === DataSourceProtocol.Energy;
  }

  onClose() {
    this.dialogRef.close();
  }
}
