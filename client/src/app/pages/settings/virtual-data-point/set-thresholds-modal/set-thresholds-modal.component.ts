import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { ObjectMap } from '../../../../shared/utils';
import { DataPointLiveData, TimeSeriesValue } from '../../../../models';
import { SourceDataPointService } from '../../../../services';

export interface SetThresholdsModalData {
  thresholds: ObjectMap<number>;
  source: string;
}

@Component({
  selector: 'app-set-thresholds-modal',
  templateUrl: 'set-thresholds-modal.component.html'
})
export class SetThresholdsModalComponent implements OnInit, OnDestroy {
  rows: any[] = [];
  timeseries: TimeSeriesValue[] = [];

  options: any;
  updateOptions: any;

  sub = new Subscription();
  liveDataSub!: Subscription;

  constructor(
    private dialogRef: MatDialogRef<SetThresholdsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SetThresholdsModalData,
    private sourceDataPointsService: SourceDataPointService
  ) {}

  ngOnInit() {
    const sub = this.sourceDataPointsService.dataPointsLivedata.subscribe((x) =>
      this.onLiveData(x)
    );

    this.sub.add(sub);

    this.liveDataSub = this.sourceDataPointsService
      .setLivedataTimer(
        this.sourceDataPointsService.getProtocol(this.data.source),
        'true'
      )
      .subscribe();

    this.rows = Object.entries(this.data.thresholds).map(
      ([value, threshold]) => ({
        value,
        threshold
      })
    );

    const data = this.prepareTimeseries();

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
          }
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: [
        ...this.getThresholdsSeries(),
        {
          name: 'Mocking Data',
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data
        }
      ]
    };
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.liveDataSub.unsubscribe();
  }

  onClose() {
    this.dialogRef.close(this.prepareThresholds());
  }

  onAdd() {
    this.rows.push({
      value: '',
      threshold: ''
    });
  }

  deleteThreshold(i: number) {
    this.rows.splice(i, 1);
  }

  private prepareTimeseries() {
    return this.timeseries.map((el) => {
      const now = new Date();
      const ts = new Date(el.ts);

      return {
        value: [
          Math.round((ts.getTime() - now.getTime()) / 1000),
          Number(el.value)
        ]
      };
    });
  }

  private prepareThresholds() {
    return this.rows.reduce((acc, curr) => {
      if (
        Number.isFinite(Number(curr.value)) &&
        Number.isFinite(Number(curr.threshold))
      ) {
        acc[Number(curr.value)] = Number(curr.threshold);
      }

      return acc;
    }, {});
  }

  private getThresholdsSeries() {
    return Object.values(this.data.thresholds).map((threshold) => ({
      name: `Threshold val: ${threshold}`,
      type: 'line',
      showSymbol: false,
      hoverAnimation: false,
      data: [{ value: [-30, threshold] }, { value: [0, threshold] }]
    }));
  }

  private onLiveData(x: ObjectMap<DataPointLiveData>) {
    if (!x) {
      return;
    }
    const thresholdsSeries = this.getThresholdsSeries();

    this.timeseries = x[this.data.source]?.timeseries || [];

    this.updateOptions = {
      series: [
        ...thresholdsSeries,
        {
          data: this.prepareTimeseries()
        }
      ]
    };
  }
}
