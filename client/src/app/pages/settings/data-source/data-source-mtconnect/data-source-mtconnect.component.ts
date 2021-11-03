import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import {
  Connection,
  DataPointLiveData,
  DataSource,
  DataSourceConnection,
  DataSourceConnectionStatus,
  DataSourceProtocol,
  SourceDataPoint,
  SourceDataPointType
} from 'app/models';
import { DataSourceService, SourceDataPointService } from 'app/services';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { clone, ObjectMap } from 'app/shared/utils';

@Component({
  selector: 'app-data-source-mtconnect',
  templateUrl: './data-source-mtconnect.component.html',
  styleUrls: ['./data-source-mtconnect.component.scss']
})
export class DataSourceMtconnectComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() dataSource!: DataSource;

  SourceDataPointType = SourceDataPointType;
  Protocol = DataSourceProtocol;
  DataSourceConnectionStatus = DataSourceConnectionStatus;

  datapointRows?: SourceDataPoint[];
  connection?: DataSourceConnection;

  unsavedRow?: SourceDataPoint;
  unsavedRowIndex: number | undefined;

  liveData: ObjectMap<DataPointLiveData> = {};

  sub = new Subscription();
  liveDataSub!: Subscription;

  constructor(
    private sourceDataPointService: SourceDataPointService,
    private dataSourceService: DataSourceService,
    private dialog: MatDialog
  ) {}

  get isEditing() {
    return !!this.unsavedRow;
  }

  ngOnInit() {
    this.sub.add(
      this.dataSourceService.connection.subscribe((x) => this.onConnection(x))
    );
    this.sub.add(
      this.sourceDataPointService.dataPoints.subscribe((x) =>
        this.onDataPoints(x)
      )
    );
    this.sub.add(
      this.sourceDataPointService.dataPointsLivedata.subscribe((x) =>
        this.onDataPointsLiveData(x)
      )
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSource.currentValue) {
      this.onDataSource(changes.dataSource.currentValue);
    }
  }

  onDataSource(obj: DataSource) {
    // this.sourceDataPointService.getDataPoints(obj.protocol!);
    this.dataSourceService.getStatus(obj.protocol!);

    this.sourceDataPointService.getLiveDataForDataPoints(
      this.dataSource?.protocol!
    );

    if (this.liveDataSub) {
      this.liveDataSub.unsubscribe();
    }

    this.liveDataSub = this.sourceDataPointService
      .setLivedataTimer(obj.protocol!)
      .subscribe();

    this.clearUnsavedRow();
  }

  updateEnabled(val: boolean) {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.enabled = val;
    this.dataSourceService.updateDataSource(this.dataSource.protocol!, {
      enabled: this.dataSource.enabled
    });
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
    this.dataSourceService.updateDataSource(this.dataSource.protocol!, {
      connection: this.dataSource.connection
    });
  }

  onDataPoints(arr: SourceDataPoint[]) {
    this.datapointRows = arr;
  }

  onAdd() {
    if (!this.datapointRows) {
      return;
    }
    const obj = {} as SourceDataPoint;

    this.unsavedRowIndex = this.datapointRows.length;
    this.unsavedRow = obj;
    this.datapointRows = this.datapointRows.concat([obj]);
  }

  onEditStart(rowIndex: number, row: any) {
    this.clearUnsavedRow();
    this.unsavedRowIndex = rowIndex;
    this.unsavedRow = clone(row);
  }

  onEditEnd() {
    if (!this.datapointRows) {
      return;
    }
    if (this.unsavedRow!.id) {
    } else {
    }
    this.clearUnsavedRow();
  }

  onEditCancel() {
    this.clearUnsavedRow();
  }

  private clearUnsavedRow() {
    delete this.unsavedRow;
    delete this.unsavedRowIndex;
    this.datapointRows = this.datapointRows?.filter((x) => x.id) || [];
  }

  onDelete(obj: SourceDataPoint) {
    const title = `Delete`;
    const message = `Are you sure you want to delete data point ${obj.name}?`;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(title, message)
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (!dialogResult) {
        return;
      }
      this.sourceDataPointService.deleteDataPoint(
        this.dataSource!.protocol!,
        obj
      );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.liveDataSub && this.liveDataSub.unsubscribe();
  }

  private onConnection(x: DataSourceConnection | undefined) {
    this.connection = x;
  }

  private onDataPointsLiveData(x: ObjectMap<DataPointLiveData>) {
    this.liveData = x;
  }
}
