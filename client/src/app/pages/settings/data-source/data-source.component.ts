import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Connection } from 'app/api/models';
import { DataPoint, DataSource } from 'app/models';
import { DataPointService, DataSourceService } from 'app/services';
import { Status } from 'app/shared/state';
import { clone } from 'app/shared/utils';
import { Subscription } from 'rxjs';

export enum Protocol {
    S7 = 'p_s7',
    IOShield = 'IOShield',
}

@Component({
    selector: 'app-data-source',
    templateUrl: './data-source.component.html',
    styleUrls: ['./data-source.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DataSourceComponent implements OnInit {

    Protocol = Protocol;

    dataSource?: DataSource;
    datapointRows?: DataPoint[];
    
    unsavedRow?: DataPoint;
    unsavedRowIndex: number | undefined;

    sub = new Subscription();

    constructor(
        private dataPointService: DataPointService,
        private dataSourceService: DataSourceService,
    ) {}

    get isBusy() { 
        return this.dataSourceService.status != Status.Ready
            || this.dataPointService.status != Status.Ready;
    }

    ngOnInit() {
        this.sub.add(this.dataSourceService.dataSources.subscribe(x => this.onDataSources(x)));
        this.sub.add(this.dataPointService.dataPoints.subscribe(x => this.onDataPoints(x)));

        this.dataSourceService.getDataSources();
    }
    
    onDataSources(arr: DataSource[]) {
        if (!arr || !arr.length) {
            return;
        }
        // TODO: Choose one datasource from array
        this.dataSource = arr[0];
        this.dataPointService.getDataPoints(this.dataSource.id!);
    }

    updateProtocol(val: string) {
        if (!this.dataSource) {
            return;
        }
        this.dataSource.protocol = val;
        this.dataSourceService.updateDataSource(this.dataSource);
    }

    updateIpAddress(valid: boolean | null, val: string) {
        if (!valid) {
            return;
        }
        if (!this.dataSource) {
            return;
        }
        this.dataSource.connection = this.dataSource.connection || <Connection>{};
        this.dataSource.connection.ipAddr = val;
        this.dataSourceService.updateDataSource(this.dataSource);
    }

    onDataPoints(arr: DataPoint[]) {
        this.datapointRows = arr;
    }

    onEditStart(rowIndex: number, row: any) {
        this.unsavedRowIndex = rowIndex;
        this.unsavedRow = clone(row);
    }

    onEditEnd(rowIndex: number) {
        if (!this.datapointRows) {
            return;
        }
        this.dataPointService.updateDataPoint(this.dataSource!.id!, this.unsavedRow!);
        delete this.unsavedRow;
        delete this.unsavedRowIndex;
    }

    onEditCancel() {
        delete this.unsavedRow;
        delete this.unsavedRowIndex;
    }

    ngOnDestroy() {
        this.sub && this.sub.unsubscribe();
      }
}