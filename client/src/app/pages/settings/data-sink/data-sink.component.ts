import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataSink, DataSinkProtocol } from 'app/models';
import { DataSinkService } from 'app/services';
import { Status } from 'app/shared/state';

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

  constructor(private dataSinkService: DataSinkService) {}

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
    }
  }

  switchDataSink(obj: DataSink) {
    this.dataSink = obj;
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }
}
