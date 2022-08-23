import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionType } from '@swimlane/ngx-datatable';
import { VirtualDataPointSchedule } from 'app/models';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { EditScheduleModalComponent, EditScheduleModalData } from '../edit-schedule-modal/edit-schedule-modal.component';

export interface SetSchedulesModalData {
  schedules: VirtualDataPointSchedule[];
}

@Component({
  selector: 'app-set-schedules-modal',
  templateUrl: 'set-schedules-modal.component.html',
  styleUrls: ['./set-schedules-modal.component.scss'],
})
export class SetSchedulesModalComponent implements OnInit {
  SelectionType = SelectionType;

  rows: VirtualDataPointSchedule[] = [];
  unsavedRow?: VirtualDataPointSchedule;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SetSchedulesModalComponent, SetSchedulesModalData>,
    @Inject(MAT_DIALOG_DATA) public data: SetSchedulesModalData,
  ) {}

  ngOnInit() {
    this.rows = this.data.schedules;
  }

  canAdd() {
    return this.rows.length < 3;
  }

  onDelete(index: number) {
    const title = `Delete`;
    const message = `Are you sure you want to delete data point ${this.rows[index].name}?`;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(title, message)
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (!dialogResult) {
        return;
      }
      this.rows.splice(index, 1);
    });
  }

  onAdd() {
    if (!this.rows) {
      return;
    }

    const newSchedule = {
      month: 1,
      date: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
    } as VirtualDataPointSchedule;
    const dialogRef = this.dialog.open<EditScheduleModalComponent, EditScheduleModalData, EditScheduleModalData>(
      EditScheduleModalComponent,
      {
        data: {
          schedule: newSchedule,
        },
      });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.onAddConfirm(result.schedule);
    });
  }

  onEdit({ selected }: { selected: VirtualDataPointSchedule[] }) {
    const schedule = selected[0];
    const index = this.rows.indexOf(schedule);

    const dialogRef = this.dialog.open<EditScheduleModalComponent, EditScheduleModalData, EditScheduleModalData>(
      EditScheduleModalComponent,
      {
        data: {
          schedule,
        },
      });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.onEditConfirm(index, result.schedule);
    });
  }

  onSave() {
    this.dialogRef.close({ schedules: this.rows });
  }
  
  onCancel() {
    this.dialogRef.close();
  }

  private onAddConfirm(newSchedule: VirtualDataPointSchedule) {
    this.rows = this.rows.concat([newSchedule]);
  }

  private onEditConfirm(index: number, schedule: VirtualDataPointSchedule) {
    this.rows = this.rows.map((x, i) => i === index ? schedule : x);
  }
}
