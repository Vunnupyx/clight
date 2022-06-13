import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ECharts } from 'echarts';

import { ObjectMap } from '../../../../shared/utils';
import {
  DataPointLiveData,
  IOShieldTypes,
  TimeSeriesValue
} from '../../../../models';
import {
  DataSourceService,
  SourceDataPointService,
  SystemInformationService
} from '../../../../services';

export interface SetThresholdsModalData {
  thresholds: ObjectMap<number>;
  source: string;
  sourceName: string;
}

@Component({
  selector: 'app-set-schedules-modal',
  templateUrl: 'set-schedules-modal.component.html'
})
export class SetSchedulesModalComponent implements OnInit, OnDestroy {
  rows: any[] = [];
  timeseries: TimeSeriesValue[] = [];

  options: any;
  updateOptions: any;

  sub = new Subscription();
  liveDataSub!: Subscription;
  IOShieldTypes = IOShieldTypes;

  chart!: ECharts;

  private serverOffsetTime = 0;

  constructor(
    private dialogRef: MatDialogRef<SetSchedulesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SetThresholdsModalData,
    private sourceDataPointsService: SourceDataPointService,
    private dataSourceService: DataSourceService,
    private systemInfoService: SystemInformationService
  ) {}

  async ngOnInit() {
    this.systemInfoService
      .getServerTimeOffset()
      .then((offset) => (this.serverOffsetTime = offset));

    const sub = this.sourceDataPointsService.dataPointsLivedata.subscribe((x) =>
      this.onLiveData(x)
    );

    this.sub.add(sub);

    const dataSourceType = await this.dataSourceService.getDataSourceType(
      this.sourceDataPointsService.getProtocol(this.data.source)
    );

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
        },
        formatter: (params) => {
          const seriesTemplate = params
            .map(
              (param) => `
                <div style="margin: 10px 0 5px;line-height:1;">${
                  param.marker
                }<span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">${
                param.seriesName
              }</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${this.formatChartLabel(
                param.value[1],
                dataSourceType
              )}</span><div style="clear:both"></div></div>
              `
            )
            .join('');

          const html = `
            <div style="margin: 0px 0 0;line-height:1;"><div style="font-size:14px;color:#666;font-weight:400;line-height:1;">${params[0].axisValueLabel}</div><div>${seriesTemplate}</div></div>`;

          return html;
        }
      },
      xAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: (value) => {
            const mints = Math.round(-value / 60);
            const secs = -value % 60;

            return `-${this.parseNum(mints)}:${this.parseNum(secs)}`;
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
        },
        axisLabel: {
          formatter: (value) => {
            if (
              [IOShieldTypes.AI_100_5di, IOShieldTypes.AI_150_5di].includes(
                dataSourceType as IOShieldTypes
              )
            ) {
              return `${value} A`;
            }

            return value;
          }
        }
      },
      series: [...this.getThresholdsSeries(), this.getMainLineSeries()]
    };
  }

  onChartInit(event) {
    this.chart = event;
  }

  formatChartLabel(value, dataSourceType) {
    if (
      [IOShieldTypes.AI_100_5di, IOShieldTypes.AI_150_5di].includes(
        dataSourceType as IOShieldTypes
      )
    ) {
      return `${value} A`;
    }

    return value;
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
    return this.timeseries
      .filter((time) => {
        const ts = new Date(time.ts).valueOf() - this.serverOffsetTime * 1000;
        const PERIOD = 5 * 60 * 1000;

        const pastDate = new Date(
          Date.now() - this.serverOffsetTime * 1000 - PERIOD
        ).valueOf();

        return ts >= pastDate;
      })
      .map((el) => {
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
    return new Array(5 * 60 + 1).fill(0).map((el, i) => -i);
  }

  private getThresholdsSeries() {
    return this.rows.map(({ threshold }, idx) => ({
      name: `Threshold #${idx + 1}`,
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
