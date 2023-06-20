import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import {
  Connection,
  DataPointLiveData,
  DataSource,
  DataSourceAuth,
  DataSourceAuthType,
  DataSourceConnection,
  DataSourceConnectionStatus,
  DataSourceProtocol,
  DataSourceSoftwareVersion,
  EnergyTypes,
  IOShieldTypes,
  MTConnectTypes,
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
import {
  HOST_REGEX,
  IP_REGEX,
  NON_SPACE_REGEX,
  PORT_REGEX
} from 'app/shared/utils/regex';
import { Subscription } from 'rxjs';
import { SelectTypeModalComponent } from './select-type-modal/select-type-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { isDataPointNameValid } from 'app/shared/utils/validity-checker';

const ENERGY_TARIFF_NUMBER_DP_ADDRESS = 'tariff-number';

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
  MTConnectTypes = MTConnectTypes;
  IOShieldTypes = IOShieldTypes;
  EnergyTypes = EnergyTypes;
  DataSourceAuthType = DataSourceAuthType;

  dataSourceList?: DataSource[];
  dataSource?: DataSource;
  dataSourceIndex?: number;
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

  auth: DataSourceAuth = {
    type: DataSourceAuthType.Anonymous,
    userName: '',
    password: ''
  };

  unsavedRow?: SourceDataPoint;
  unsavedRowIndex: number | undefined;

  liveData: ObjectMap<DataPointLiveData> = {};

  sub = new Subscription();
  liveDataSub!: Subscription;
  statusSub!: Subscription;

  ipRegex = IP_REGEX;
  portRegex = PORT_REGEX;
  ipOrHostRegex = `${IP_REGEX}|${HOST_REGEX}`;
  nonSpaceRegex = NON_SPACE_REGEX;
  dsFormValid = true;
  showCertificateTrustDialog = false;
  isDataPointNameValid = isDataPointNameValid;

  filterDigitalInputAddressStr = '';

  @ViewChild(DatatableComponent) ngxDatatable: DatatableComponent;
  @ViewChild('tabs') tabs: MatTabGroup;

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

  get MTConnectStreamHref() {
    return !this.dataSource?.machineName
      ? `http://${this.dataSource.connection.hostname}:${this.dataSource.connection.port}/current`
      : `http://${this.dataSource.connection.hostname}:${this.dataSource.connection.port}/${this.dataSource.machineName}/current`;
  }

  constructor(
    private sourceDataPointService: SourceDataPointService,
    private dataSourceService: DataSourceService,
    private dialog: MatDialog,
    private promptService: PromptService,
    private translate: TranslateService
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

  ngAfterViewInit() {
    this.ngxDatatable.columnMode = ColumnMode.force;
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
        return !['DI5', 'DI6', 'DI7', 'DI8', 'DI9'].includes(address);
      }
      default: {
        return true;
      }
    }
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
        this.dataSourceIndex = this.dataSourceList?.indexOf(newDs) || 0;
      }
    }
  }

  onDataSourceIndexChange(idx: number) {
    if (
      this.dataSourceIndex === idx ||
      !this.dataSourceList ||
      !this.dataSourceList[idx]
    ) {
      return;
    }
    this.switchDataSource(this.dataSourceList[idx]);
  }

  private async switchDataSource(obj: DataSource) {
    if (this.isTouchedTable) {
      try {
        await this.promptService.warn();
        await this.sourceDataPointService.revert();
      } catch {
        this.tabs.selectedIndex = this.dataSourceIndex;
        return;
      }
    }

    this.dataSource = obj;
    this.dataSourceIndex = this.dataSourceList?.indexOf(obj) || 0;
    this.sourceDataPointService.getDataPoints(obj.protocol!);

    if (obj.auth) {
      this.auth = clone(obj.auth);
    }

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

  updateMachineName(val: string) {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.machineName = val;
    this.dataSourceService.updateDataSource(this.dataSource.protocol!, {
      machineName: this.dataSource.machineName
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

  updateHostname(valid: boolean | null, val: string) {
    this.dsFormValid = !!valid;

    if (!valid || !this.dataSource) {
      return;
    }
    this.dataSource.connection = this.dataSource.connection || <Connection>{};
    this.dataSource.connection.hostname = val;
    this.dataSourceService.updateDataSource(this.dataSource.protocol!, {
      connection: this.dataSource.connection
    });
  }

  updatePort(valid: boolean | null, val: number) {
    this.dsFormValid = !!valid;

    if (!valid) {
      return;
    }
    if (!this.dataSource) {
      return;
    }
    this.dataSource.connection = this.dataSource.connection || <Connection>{};
    this.dataSource.connection.port = val;
    this.dataSourceService.updateDataSource(this.dataSource.protocol!, {
      connection: this.dataSource.connection
    });
  }

  onDataPoints(arr: SourceDataPoint[]) {
    this.datapointRows = arr;
    this.tabs?.realignInkBar();
  }

  isDuplicatingField(field: 'name' | 'address') {
    if (!this.datapointRows || !this.unsavedRow) {
      return false;
    }

    if (this.unsavedRow[field] === undefined) {
      return false;
    }

    // check whether other DPs do not have such name
    const newFieldValue = (this.unsavedRow[field] as string)
      .toLowerCase()
      .trim();
    const editableId = this.unsavedRow?.id;

    return this.datapointRows.some((dp) => {
      return (
        dp[field]?.toLowerCase().trim() === newFieldValue &&
        dp.id !== editableId
      );
    });
  }

  hasSpaceCharacter(text) {
    return !new RegExp(this.nonSpaceRegex).test(text);
  }

  onAdd() {
    if (!this.datapointRows) {
      return;
    }
    const obj = {
      type:
        this.dataSource?.protocol === DataSourceProtocol.S7
          ? SourceDataPointType.NCK
          : this.dataSource?.protocol === DataSourceProtocol.Energy
          ? SourceDataPointType.Measurement
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
    this.ngxDatatable.sorts = [];
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
      width: '650px',
      data: {
        selection: obj.address,
        type: obj.type,
        protocol: this.dataSource?.protocol,
        existingAddresses: this.datapointRows?.map((x) => x.address) || []
      }
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
        this.unsavedRow!.mandatory = result.mandatory;
        if (this.dataSource?.protocol === DataSourceProtocol.Energy) {
          this.unsavedRow!.type = result.type;
        }
      }
    });
  }

  onDelete(obj: SourceDataPoint) {
    const title = this.translate.instant('settings-data-source.Delete');
    const message = this.translate.instant(
      'settings-data-source.DeleteMessage',
      { name: obj.name }
    );

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(title, message)
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (!dialogResult) {
        return;
      }
      this.clearUnsavedRow();
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

  onSaveAuth() {
    if (
      this.dataSource?.auth?.type === this.auth.type &&
      this.auth.userName &&
      this.dataSource?.auth?.userName === this.auth.userName &&
      this.auth.password &&
      this.dataSource?.auth?.password === this.auth.password
    ) {
      return;
    }
    const newAuth = (
      this.auth.type === DataSourceAuthType.Anonymous
        ? { type: this.auth.type }
        : this.auth
    ) as DataSourceAuth;
    this.dataSourceService.updateDataSource(this.dataSource?.protocol!, {
      auth: newAuth
    });
  }

  onDiscard() {
    return this.sourceDataPointService.revert();
  }

  onApply() {
    return this.sourceDataPointService.apply(this.dataSource?.protocol!);
  }

  isAbleToSelectAddress(type: SourceDataPointType | undefined): boolean {
    if (this.dataSource?.protocol === DataSourceProtocol.Energy) {
      return true;
    }

    return [SourceDataPointType.NCK].includes(type);
  }

  findTariffNumberDatapoint(obj: SourceDataPoint): boolean {
    return (
      obj.type === SourceDataPointType.Device &&
      obj.address === ENERGY_TARIFF_NUMBER_DP_ADDRESS
    );
  }

  getTariffText() {
    const tariffNumberDatapoint = this.datapointRows.find((dp) =>
      this.findTariffNumberDatapoint(dp)
    );
    const tariffNumber = this.liveData?.[tariffNumberDatapoint?.address]?.value;
    const translationKey = `settings-data-source.TariffStatus.${tariffNumber}`;
    const result = this.translate.instant(translationKey);
    return result !== translationKey
      ? result
      : this.translate.instant('settings-data-source.TariffStatus.Unknown');
  }

  getLiveDataTextForIoShield(obj: SourceDataPoint) {
    const liveDataValue = this.liveData[obj.id]?.value;

    if (!obj.address?.startsWith('DI')) return liveDataValue;

    const translationKey = `settings-data-source.Livedata.ioshield.${liveDataValue}`;
    const result = this.translate.instant(translationKey);
    return result !== translationKey ? result : liveDataValue;
  }

  goToMtConnectStream() {
    window.open(this.MTConnectStreamHref, '_blank');
  }

  async onPing() {
    return this.sourceDataPointService.ping(this.dataSource?.protocol);
  }

  private onConnection(x: DataSourceConnection | undefined) {
    if (!x) return;

    this.connection = x;

    if (x.status) {
      this.verifyCertificate(x.status);
    }
  }

  private onDataPointsLiveData(x: ObjectMap<DataPointLiveData>) {
    this.liveData = x;
  }

  private verifyCertificate(status: DataSourceConnectionStatus) {
    if (
      !this.showCertificateTrustDialog &&
      status === DataSourceConnectionStatus.UntrustedCertificate
    ) {
      this.showCertificateTrustDialog = true;

      const title = this.translate.instant(
        'settings-data-source.UntrustedCertificate'
      );
      const message = this.translate.instant(
        'settings-data-source.UntrustedCertificateMessage'
      );

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: new ConfirmDialogModel(title, message)
      });

      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (!dialogResult) {
          return;
        }
      });
    }
  }
}
