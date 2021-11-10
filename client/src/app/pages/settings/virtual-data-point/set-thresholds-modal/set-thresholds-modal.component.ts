import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ECharts } from 'echarts';

import { ObjectMap } from '../../../../shared/utils';
import { DataPointLiveData, TimeSeriesValue } from '../../../../models';
import { SourceDataPointService } from '../../../../services';

export interface SetThresholdsModalData {
  thresholds: ObjectMap<number>;
  source: string;
  sourceName: string;
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

  chart!: ECharts;

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
        },
        axisPointer: {
          label: {
            formatter: ({ value }) => {
              const time = new Date(Date.now() + value * 1000);
              const hours = this.parseNum(time.getHours());
              const minutes = this.parseNum(time.getMinutes());
              const seconds = this.parseNum(time.getSeconds());

              return `${hours}:${minutes}:${seconds}`;
            }
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
      series: [...this.getThresholdsSeries(), this.getMainLineSeries()]
    };
  }

  onChartInit(event) {
    this.chart = event;
  }

  getMainLineSeries() {
    return {
      name: this.data.sourceName,
      type: 'line',
      showSymbol: false,
      hoverAnimation: false,
      data: this.prepareTimeseries(),
      color: '#000000',
      lineStyle: {
        width: 4
      }
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

  onThresholdChanged() {
    if (!this.chart) {
      return;
    }

    const thresholdsSeries = this.getThresholdsSeries();

    this.chart.setOption(
      {
        series: [...thresholdsSeries, this.getMainLineSeries()]
      },
      {
        replaceMerge: ['series'],
        lazyUpdate: false,
        silent: true
      }
    );
  }

  private parseNum(num: number) {
    return num < 10 ? `0${num}` : num;
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

  private getChartXAxisValues() {
    return new Array(31).fill(0).map((el, i) => -i);
  }

  private getThresholdsSeries() {
    return this.rows.map(({ threshold }) => ({
      name: `Threshold val: ${threshold}`,
      type: 'line',
      showSymbol: false,
      hoverAnimation: false,
      data: this.getChartXAxisValues().map((el) => ({
        value: [el, threshold]
      })),
      lineStyle: {
        width: 2
      }
    }));
  }

  private onLiveData(x: ObjectMap<DataPointLiveData>) {
    if (!x || !this.chart) {
      return;
    }
    const thresholdsSeries = this.getThresholdsSeries();

    this.timeseries = x[this.data.source]?.timeseries || [];

    this.chart.setOption({
      series: [...thresholdsSeries, this.getMainLineSeries()]
    });
  }
}
