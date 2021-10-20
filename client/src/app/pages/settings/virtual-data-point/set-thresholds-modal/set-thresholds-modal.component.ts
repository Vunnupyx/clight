import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ObjectMap } from '../../../../shared/utils';

export interface SetThresholdsModalData {
  thresholds: ObjectMap<number>;
}

@Component({
  selector: 'app-set-thresholds-modal',
  templateUrl: 'set-thresholds-modal.component.html'
})
export class SetThresholdsModalComponent implements OnInit, OnDestroy {
  rows: any[] = [];

  options: any;
  updateOptions: any;
  interval: any;

  constructor(
    private dialogRef: MatDialogRef<SetThresholdsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SetThresholdsModalData,
  ) {}

  ngOnInit() {
    this.rows = Object.entries(this.data.thresholds).map(([value, threshold]) => ({
      value,
      threshold,
    }));

    this.options = {
      tooltip: {
        trigger: 'axis',
        // formatter: (params) => {
        //   return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
        // },
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
        data: this.fetchData(),
      }]
    };

    this.interval = setInterval(() => {
      // this.updateOptions = {
      //   series: [{
      //     data: this.fetchData()
      //   }]
      // };
    }, 1000);
  }

  fetchData() {
    return new Array(31)
      .fill(0)
      .map((_, i, array) => i - array.length + 1)
      .map((value) => {
        return {
          name: 'Name',
          value: [value.toString(), Math.round(Math.random() * 100)]
        };
      });
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

  ngOnDestroy() {
    clearInterval(this.interval);
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
