import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ObjectMap } from '../../../../shared/utils';
import { TimeSeriesValue } from "../../../../models";

export interface SetThresholdsModalData {
  thresholds: ObjectMap<number>;
  timeseries: TimeSeriesValue[];
}

@Component({
  selector: 'app-set-thresholds-modal',
  templateUrl: 'set-thresholds-modal.component.html'
})
export class SetThresholdsModalComponent implements OnInit {
  rows: any[] = [];

  options: any;
  updateOptions: any;

  constructor(
    private dialogRef: MatDialogRef<SetThresholdsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SetThresholdsModalData,
  ) {}

  ngOnInit() {
    this.rows = Object.entries(this.data.thresholds).map(([value, threshold]) => ({
      value,
      threshold,
    }));

    const data = this.data.timeseries.map((el) => {
      const now = new Date();
      const ts = new Date(el.ts);

      return {
        value: [
          Math.round((ts.getTime() - now.getTime()) / 1000),
          Number(el.value),
        ]
      };
    });

    this.options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: (value) => {
            return `${value}s`;
          },
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        },
      },
      series: [{
        name: 'Mocking Data',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data,
      }]
    };
  }

  onClose() {
    console.log(this.prepareThresholds());
    this.dialogRef.close(this.prepareThresholds());
  }

  onAdd() {
    this.rows.push({
      value: '',
      threshold: '',
    });
  }

  deleteThreshold(i: number) {
    this.rows.splice(i, 1);
  }

  private prepareThresholds() {
    return this.rows.reduce((acc, curr) => {
      if (Number.isFinite(Number(curr.value)) && Number.isFinite(Number(curr.threshold))) {
        acc[Number(curr.value)] = Number(curr.threshold);
      }

      return acc;
    }, {});
  }
}
