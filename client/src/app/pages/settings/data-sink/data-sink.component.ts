import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataSink, DataSinkProtocol } from 'app/models';
import { DataPointService, DataSinkService } from 'app/services';
import { PromptService } from 'app/shared/services/prompt.service';

@Component({
  selector: 'app-data-sink',
  templateUrl: './data-sink.component.html',
  styleUrls: ['./data-sink.component.scss']
})
export class DataSinkComponent implements OnInit {
  Protocol = DataSinkProtocol;

  dataSinkList?: DataSink[];
  dataSink?: DataSink;

  sub = new Subscription();

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
      }
    }
  }

  async switchDataSink(obj: DataSink) {
    if (this.isTouched) {
      try {
        await this.promptService.warn();
        await this.dataPointService.revert();
      } catch {
        return;
      }
    }

    this.dataSink = obj;
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }
}
