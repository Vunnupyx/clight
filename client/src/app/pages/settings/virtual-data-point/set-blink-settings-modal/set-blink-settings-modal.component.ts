import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VirtualDataPoint, VirtualDataPointBlinkSettings } from 'app/models';
import { VirtualDataPointService } from 'app/services';

export interface SetBlinkSettingsModalData {
  blinkSettings: VirtualDataPointBlinkSettings;
  dataPointsWithBlinkDetection: VirtualDataPoint[];
}

@Component({
  selector: 'app-set-blink-settings-modal',
  templateUrl: './set-blink-settings-modal.component.html',
  styleUrls: ['./set-blink-settings-modal.component.scss']
})
export class SetBlinkSettingsModalComponent implements OnInit {
  blinkSettings: VirtualDataPointBlinkSettings;
  dataPointsWithBlinkDetection: VirtualDataPoint[];
  MIN_TIMEFRAME = 1000;
  MAX_TIMEFRAME = 120000;
  MIN_RISING_EDGES = 1;
  MAX_RISING_EDGES = 10;

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: SetBlinkSettingsModalData,
    private virtualDataPointService: VirtualDataPointService
  ) {}

  ngOnInit(): void {
    this.blinkSettings = this.data.blinkSettings;
    this.dataPointsWithBlinkDetection = this.data.dataPointsWithBlinkDetection;
  }

  areInputsValid() {
    let result = false;
    let timeframe = this.blinkSettings.timeframe;
    let risingEdges = this.blinkSettings.risingEdges;
    if (
      Number.isInteger(timeframe) &&
      timeframe >= this.MIN_TIMEFRAME &&
      timeframe <= this.MAX_TIMEFRAME &&
      Number.isInteger(risingEdges) &&
      risingEdges >= this.MIN_RISING_EDGES &&
      risingEdges <= this.MAX_RISING_EDGES
    ) {
      result = true;
    }

    return result;
  }

  getVirtualDataPointPrefix() {
    return this.virtualDataPointService.getPrefix();
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close({ blinkSettings: this.blinkSettings });
  }
}
