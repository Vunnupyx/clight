import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VirtualDataPoint, VirtualDataPointBlinkSettings } from 'app/models';
import { VirtualDataPointService } from 'app/services';

export interface SetBlinkSettingsModalData {
  virtualPoint: VirtualDataPoint;
  dataPointsWithBlinkDetection: VirtualDataPoint[];
}

@Component({
  selector: 'app-set-blink-settings-modal',
  templateUrl: './set-blink-settings-modal.component.html',
  styleUrls: ['./set-blink-settings-modal.component.scss']
})
export class SetBlinkSettingsModalComponent implements OnInit {
  virtualPoint: VirtualDataPoint;
  dataPointsWithBlinkDetection: VirtualDataPoint[];

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: SetBlinkSettingsModalData,
    private virtualDataPointService: VirtualDataPointService
  ) {}

  ngOnInit(): void {
    this.virtualPoint = this.data.virtualPoint;
    this.dataPointsWithBlinkDetection = this.data.dataPointsWithBlinkDetection;
  }

  isLinkingAllowed(blinkSettings) {
    return !blinkSettings?.linkedBlinkDetections?.includes(
      this.virtualPoint?.id
    );
  }

  getVirtualDataPointPrefix() {
    return this.virtualDataPointService.getPrefix();
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close({
      blinkSettings: this.virtualPoint.blinkSettings
    });
  }
}
