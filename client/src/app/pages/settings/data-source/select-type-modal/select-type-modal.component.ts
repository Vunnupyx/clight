import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { DataSourceProtocol } from '../../../../models';
import { DataSourceService } from '../../../../services';

export interface SelectTypeModalData {
  selection: string;
  protocol: DataSourceProtocol;
  existingAddresses: string[];
}

@Component({
  selector: 'app-select-type-modal',
  templateUrl: 'select-type-modal.component.html'
})
export class SelectTypeModalComponent implements OnInit {
  rows: any[] = [];

  @ViewChild(DatatableComponent) ngxDatatable: DatatableComponent;

  constructor(
    private dialogRef: MatDialogRef<SelectTypeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectTypeModalData,
    private dataSourceService: DataSourceService
  ) {}

  ngOnInit() {
    this.rows =
      this.data.protocol === DataSourceProtocol.S7
        ? this.dataSourceService.getNckAddresses()
        : this.dataSourceService.getFanucAddresses();
  }

  ngAfterViewInit() {
    this.ngxDatatable.columnMode = ColumnMode.force;
  }

  onSelect(row) {
    this.dialogRef.close(row);
  }

  isExisting({ address }) {
    return this.data.existingAddresses.includes(address);
  }

  onClose() {
    this.dialogRef.close();
  }
}
