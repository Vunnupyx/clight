import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScheduleDay, ScheduleEvery, ScheduleMonth, VirtualDataPointSchedule } from 'app/models';

export interface EditScheduleModalData {
  schedule: VirtualDataPointSchedule;
}

@Component({
  selector: 'app-edit-schedule-modal',
  templateUrl: 'edit-schedule-modal.component.html',
  styleUrls: ['edit-schedule-modal.component.scss'],
})
export class EditScheduleModalComponent implements OnInit {
  ScheduleDay = ScheduleDay;
  ScheduleMonth = ScheduleMonth;
  ScheduleEvery: ScheduleEvery = 'Every';

  schedule?: VirtualDataPointSchedule;

  constructor(
    private dialogRef: MatDialogRef<EditScheduleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditScheduleModalData,
  ) {}

  ngOnInit() {
    this.schedule = this.data.schedule;
  }

  onSetDay() {
    (this.schedule as any).date = undefined;
  }

  onSetDate() {
    (this.schedule as any).day = undefined;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close({ schedule: this.schedule });
  }

  isValid() {
    return this.schedule
        && (this.schedule.date || this.schedule.day) && this.schedule.month
        && this.schedule.hours != null
        && this.schedule.minutes != null
        && this.schedule.seconds != null
        && this.schedule.name;
  }
}
