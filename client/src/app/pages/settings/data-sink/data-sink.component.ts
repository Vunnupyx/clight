import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataPoint, DataSink, DataSinkProtocol } from 'app/models';
import { DataPointService, DataSinkService } from 'app/services';
import { PromptService } from 'app/shared/services/prompt.service';
import { MatTabGroup } from '@angular/material/tabs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-data-sink',
  templateUrl: './data-sink.component.html',
  styleUrls: ['./data-sink.component.scss']
})
export class DataSinkComponent implements OnInit {
  Protocol = DataSinkProtocol;

  dataSinkList?: DataSink[];
  dataSink?: DataSink;
  dataSinkIndex?: number;

  sub = new Subscription();

  @ViewChild('tabs') tabs: MatTabGroup;

  get isTouched() {
    return this.dataPointService.isTouched;
  }

  constructor(
    private dataSinkService: DataSinkService,
    private dataPointService: DataPointService,
    private promptService: PromptService
  ) {}

  ngOnInit() {
    this.sub.add(
      this.dataSinkService.dataSinks.subscribe((x) => this.onDataSinks(x))
    );

    this.dataSinkService.getDataSinks();
  }

  onDataSinks(arr: DataSink[]) {
    if (!arr || !arr.length) {
      return;
    }
    this.dataSinkList = arr;

    if (!this.dataSink) {
      this.switchDataSink(arr[0]);
    } else {
      const newDs = arr.find((x) => x.protocol === this.dataSink?.protocol);

      if (newDs) {
        this.dataSink = newDs;
        this.dataSinkIndex = this.dataSinkList?.indexOf(newDs) || 0;
      }
    }
  }

  onDataSinkIndexChange(idx: number) {
    if (
      this.dataSinkIndex === idx ||
      !this.dataSinkList ||
      !this.dataSinkList[idx]
    ) {
      return;
    }
    this.switchDataSink(this.dataSinkList[idx]);
  }

  async switchDataSink(obj: DataSink) {
    if (this.isTouched) {
      try {
        await this.promptService.warn();
        await this.dataPointService.revert();
      } catch {
        this.tabs.selectedIndex = this.dataSinkIndex;
        return;
      }
    }

    this.dataSink = obj;
    this.dataSinkIndex = this.dataSinkList?.indexOf(obj) || 0;
  }

  onDataPoints(arr: DataPoint[]) {
    this.tabs?.realignInkBar();
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }
}
