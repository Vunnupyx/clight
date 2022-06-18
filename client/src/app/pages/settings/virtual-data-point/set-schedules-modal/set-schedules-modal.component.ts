import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VirtualDataPointSchedule } from 'app/models';

export interface SetSchedulesModalData {
  schedules: VirtualDataPointSchedule[];
}

@Component({
  selector: 'app-set-schedules-modal',
  templateUrl: 'set-schedules-modal.component.html'
})
export class SetSchedulesModalComponent implements OnInit {

  rows: VirtualDataPointSchedule[] = [];
  unsavedRow?: VirtualDataPointSchedule;

  constructor(
    private dialogRef: MatDialogRef<SetSchedulesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SetSchedulesModalData,
  ) {}

  ngOnInit() {
    this.rows = this.data.schedules.slice();
  }

  canAdd() {
    return this.rows.length < 3;
  }

  deleteAt(index: number) {
    this.rows.splice(index, 1);
  }

  onAdd() {
    if (!this.rows) {
      return;
    }
    this.unsavedRow = {} as VirtualDataPointSchedule;
  }

  onClose() {
    this.dialogRef.close(this.rows);
  }

  private onAddConfirm() {
    if (!this.unsavedRow) {
      return;
    }
    this.rows = this.rows.concat([this.unsavedRow]);
  }

  private onAddCancel() {
    delete this.unsavedRow;
  }
}
