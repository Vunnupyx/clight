import {
  Component,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {
  ColumnMode,
  DatatableComponent
} from '@swimlane/ngx-datatable';

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

  @ViewChild(DatatableComponent) ngxDatatable: DatatableComponent;

  constructor(
    private dialogRef: MatDialogRef<SelectTypeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectTypeModalData,
    private dataSourceService: DataSourceService
  ) {}

  ngOnInit() {
    this.rows = this.dataSourceService.getNckAddresses();
  }

  ngAfterViewInit() {
    this.ngxDatatable.columnMode = ColumnMode.force;
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
