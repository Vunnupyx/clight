import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DataSourceProtocol } from '../../../../models';

export interface SelectTypeModalData {
  selection: string;
  protocol: DataSourceProtocol;
}

@Component({
  selector: 'app-select-type-modal',
  templateUrl: 'select-type-modal.component.html'
})
export class SelectTypeModalComponent {
  DataSourceProtocol = DataSourceProtocol;

  rows = this.data.protocol === DataSourceProtocol.IOShield ? [
    { area: 'B[.]', component: 'S', variable: 'ncAutoCounter[.]' },
    { area: 'B[.]', component: 'S', variable: 'ncAutoCounter[.]' },
    { area: 'B[.]', component: 'S', variable: 'ncAutoCounter[.]' },
    { area: 'B[.]', component: 'S', variable: 'ncAutoCounter[.]' }
  ] : [
    { name: 'Name 1', address: 'Address 1' },
  ];

  constructor(
    private dialogRef: MatDialogRef<SelectTypeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectTypeModalData
  ) {}

  onSelect({ selected }) {
    this.dialogRef.close(selected[0]);
  }

  onClose() {
    this.dialogRef.close();
  }
}
