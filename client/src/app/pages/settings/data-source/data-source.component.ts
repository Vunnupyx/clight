import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Connection } from 'app/api/models';
import {
  DataPointLiveData,
  DataSource,
  DataSourceConnection,
  DataSourceConnectionStatus,
  DataSourceProtocol,
  DataSourceSoftwareVersion,
  SourceDataPoint,
  SourceDataPointType
} from 'app/models';
import { DataSourceService, SourceDataPointService } from 'app/services';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { clone, ObjectMap } from 'app/shared/utils';
import { Subscription } from 'rxjs';
import { SelectTypeModalComponent } from './select-type-modal/select-type-modal.component';

@Component({
  selector: 'app-data-source',
  templateUrl: './data-source.component.html',
  styleUrls: ['./data-source.component.scss']
})
export class DataSourceComponent implements OnInit, OnDestroy {
  SourceDataPointType = SourceDataPointType;
  Protocol = DataSourceProtocol;
  DataSourceConnectionStatus = DataSourceConnectionStatus;

  dataSourceList?: DataSource[];
  dataSource?: DataSource;
  datapointRows?: SourceDataPoint[];
  connection?: DataSourceConnection;

  SoftwareVersions = [
    DataSourceSoftwareVersion.v4_5,
    DataSourceSoftwareVersion.v4_7
  ];

  DigitalInputAddresses = [
    ...new Array(10).fill(0).map((_, i) => `DI${i}`),
    ...new Array(2).fill(0).map((_, i) => `AI${i}`)
  ];

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
      this.dataSourceService.dataSources.subscribe((x) => this.onDataSources(x))
    );
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
    this.sourceDataPointService.getDataPoints(obj.protocol!);
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
    const obj = {
      type:
        this.dataSource?.protocol === DataSourceProtocol.S7
          ? SourceDataPointType.NCK
          : null
    } as SourceDataPoint;

    if (this.dataSource?.protocol === DataSourceProtocol.IOShield) {
      const freeAddresses = this.DigitalInputAddresses.filter((x) =>
        this.datapointRows?.every((y) => y.address !== x)
      );

      obj.address = freeAddresses[0];
    }

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
      this.sourceDataPointService
        .updateDataPoint(this.dataSource!.protocol!, this.unsavedRow!)
        .then(() =>
          this.sourceDataPointService.getLiveDataForDataPoints(
            this.dataSource?.protocol!
          )
        );
    } else {
      this.sourceDataPointService
        .addDataPoint(this.dataSource!.protocol!, this.unsavedRow!)
        .then(() =>
          this.sourceDataPointService.getLiveDataForDataPoints(
            this.dataSource?.protocol!
          )
        );
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

  onAddressSelect(obj: SourceDataPoint) {
    const dialogRef = this.dialog.open(SelectTypeModalComponent, {
      data: { selection: obj.address, protocol: this.dataSource?.protocol },
      width: '650px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      if (this.dataSource?.protocol === DataSourceProtocol.IOShield) {
        this.unsavedRow!.address = `${result.area}.${result.component}.${result.variable}`;
      } else {
        this.unsavedRow!.name = result.name;
        this.unsavedRow!.address = result.address;
      }
    });
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

  getDataSourceDataPointPrefix(id: string): string {
    return this.sourceDataPointService.getPrefix(id);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.liveDataSub && this.liveDataSub.unsubscribe();
  }

  updateSoftwareVersion(version: string) {
    this.dataSourceService.updateDataSource(this.dataSource?.protocol!, {
      softwareVersion: version
    });
  }

  private onConnection(x: DataSourceConnection | undefined) {
    this.connection = x;
  }

  private onDataPointsLiveData(x: ObjectMap<DataPointLiveData>) {
    this.liveData = x;
  }
}
