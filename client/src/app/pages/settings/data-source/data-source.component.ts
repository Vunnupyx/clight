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
  IOShieldTypes,
  S7Types,
  SourceDataPoint,
  SourceDataPointType
} from 'app/models';
import { DataSourceService, SourceDataPointService } from 'app/services';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { PromptService } from 'app/shared/services/prompt.service';
import { Status } from 'app/shared/state';
import { clone, ObjectMap } from 'app/shared/utils';
import { IP_REGEX } from 'app/shared/utils/regex';
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
  S7Types = S7Types;
  IOShieldTypes = IOShieldTypes;

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
  statusSub!: Subscription;

  ipRegex = IP_REGEX;
  dsFormValid = true;

  filterDigitalInputAddressStr = '';

  get ioshieldAddresses() {
    return this.DigitalInputAddresses.filter((x) => {
      const searchCond = x
        .toLowerCase()
        .includes(this.filterDigitalInputAddressStr.toLowerCase());

      return searchCond && this.filterIOShieldAddress(x);
    });
  }

  get isTouchedTable() {
    return this.sourceDataPointService.isTouched;
  }

  get isLoading() {
    return this.sourceDataPointService.status === Status.Loading;
  }

  private mapIOShieldsAIAddresses = {
    DI8: 'DI0',
    DI7: 'DI1',
    DI6: 'DI2',
    DI5: 'DI3',
    DI0: 'DI4',
    AI0: 'AI0',
    AI1: 'AI1'
  };

  private mapIOShieldsKeys = Object.keys(this.mapIOShieldsAIAddresses);

  constructor(
    private sourceDataPointService: SourceDataPointService,
    private dataSourceService: DataSourceService,
    private dialog: MatDialog,
    private promptService: PromptService
  ) {
    this.promptService.initWarnBeforePageUnload(
      () => this.sourceDataPointService.isTouched
    );
  }

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

  toString(x: any): string {
    return String(x);
  }

  filterIOShieldAddress(address: string): boolean {
    const type = this.dataSource?.type;

    if (!type) {
      return true;
    }

    switch (type) {
      case IOShieldTypes.DI_10: {
        return !['AI0', 'AI1'].includes(address);
      }
      case IOShieldTypes.AI_100_5di:
      case IOShieldTypes.AI_150_5di: {
        return this.mapIOShieldsKeys.includes(address);
      }
      default: {
        return true;
      }
    }
  }

  mapAddressLabel(address: string) {
    if (
      this.dataSource?.protocol === this.Protocol.IOShield &&
      [IOShieldTypes.AI_100_5di, IOShieldTypes.AI_150_5di].includes(
        this.dataSource?.type as IOShieldTypes
      )
    ) {
      return this.mapIOShieldsAIAddresses[address] || address;
    }

    return address;
  }

  onDataSources(arr: DataSource[]) {
    if (!arr || !arr.length) {
      return;
    }
    this.dataSourceList = arr;

    if (!this.dataSource) {
      this.switchDataSource(arr[0]);
    } else {
      const newDs = arr.find((x) => x.protocol === this.dataSource?.protocol);

      if (newDs) {
        this.dataSource = newDs;
      }
    }
  }

  async switchDataSource(obj: DataSource) {
    if (this.isTouchedTable) {
      try {
        await this.promptService.warn();
        await this.sourceDataPointService.revert();
      } catch {
        return;
      }
    }

    this.dataSource = obj;
    this.sourceDataPointService.getDataPoints(obj.protocol!);

    if (this.statusSub) {
      this.statusSub.unsubscribe();
    }

    if (this.dataSource.protocol !== DataSourceProtocol.IOShield) {
      this.statusSub = this.dataSourceService
        .setStatusTimer(this.dataSource.protocol!)
        .subscribe();
    }

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
    this.dsFormValid = !!valid;

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
    this.statusSub && this.statusSub.unsubscribe();
    this.promptService.destroyWarnBeforePageUnload();
  }

  updateSoftwareVersion(version: string) {
    this.dataSourceService.updateDataSource(this.dataSource?.protocol!, {
      softwareVersion: version
    });
  }

  updateControllerType(type: S7Types | IOShieldTypes) {
    this.dataSourceService.updateDataSource(this.dataSource?.protocol!, {
      type
    });
  }

  onDiscard() {
    return this.sourceDataPointService.revert();
  }

  onApply() {
    return this.sourceDataPointService.apply(this.dataSource?.protocol!);
  }

  private onConnection(x: DataSourceConnection | undefined) {
    this.connection = x;
  }

  private onDataPointsLiveData(x: ObjectMap<DataPointLiveData>) {
    this.liveData = x;
  }
}
