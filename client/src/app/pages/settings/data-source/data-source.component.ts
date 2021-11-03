import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataSource, DataSourceProtocol } from 'app/models';
import { DataSourceService } from 'app/services';

@Component({
  selector: 'app-data-source',
  templateUrl: './data-source.component.html',
  styleUrls: ['./data-source.component.scss']
})
export class DataSourceComponent implements OnInit, OnDestroy {
  Protocol = DataSourceProtocol;

  dataSourceList?: DataSource[];
  dataSource?: DataSource;

  sub = new Subscription();

  constructor(private dataSourceService: DataSourceService) {}

  ngOnInit() {
    this.sub.add(
      this.dataSourceService.dataSources.subscribe((x) => this.onDataSources(x))
    );

    this.dataSourceService.getDataSources();
  }

  onDataSources(arr: DataSource[]) {
    if (!arr || !arr.length) {
      return;
    }
    this.dataSourceList = arr;

    if (!this.dataSource) {
      this.switchDataSource(arr[0]);
    }
  }

  switchDataSource(obj: DataSource) {
    this.dataSource = obj;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
