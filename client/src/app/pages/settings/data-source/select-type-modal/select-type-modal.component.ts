import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DataSourceProtocol } from '../../../../models';
import { DataSourceService } from '../../../../services';

export interface SelectTypeModalData {
  selection: string;
  protocol: DataSourceProtocol;
  existedAddresses: string[];
}

@Component({
  selector: 'app-select-type-modal',
  templateUrl: 'select-type-modal.component.html'
})
export class SelectTypeModalComponent implements OnInit {
  rows: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<SelectTypeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectTypeModalData,
    private dataSourceService: DataSourceService
  ) {}

  ngOnInit() {
    this.rows = this.dataSourceService.getNckAddresses();
  }

  onSelect(row) {
    this.dialogRef.close(row);
  }

  isExisted({ address }) {
    return this.data.existedAddresses.includes(address);
  }

  onClose() {
    this.dialogRef.close();
  }
}
