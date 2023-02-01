import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, Subscription } from 'rxjs';

import {
  DataMapping,
  DataPoint,
  DataPointLiveData,
  DataPointType,
  DataSink,
  DataSinkAuth,
  DataSinkAuthType,
  DataSinkConnection,
  DataSinkConnectionStatus,
  DataSinkProtocol,
  PreDefinedDataPoint
} from 'app/models';
import {
  DataMappingService,
  DataPointService,
  DataSinkService
} from 'app/services';
import { arrayToMap, clone, ObjectMap } from 'app/shared/utils';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import {
  CreateDataItemModalComponent,
  CreateDataItemModalData
} from '../create-data-item-modal/create-data-item-modal.component';
import { SelectMapModalComponent } from '../select-map-modal/select-map-modal.component';
import { Status } from 'app/shared/state';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { MessengerConnectionComponent } from '../messenger-connection/messenger-connection.component';
import { MessengerConnectionService } from 'app/services/messenger-connection.service';
import {
  SelectOpcUaVariableModalComponent,
  SelectOpcUaVariableModalData
} from '../select-opc-ua-variable-modal/select-opc-ua-variable-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-data-sink-mt-connect',
  templateUrl: './data-sink-mt-connect.component.html',
  styleUrls: ['./data-sink-mt-connect.component.scss']
})
export class DataSinkMtConnectComponent implements OnInit, OnChanges {
  DataPointType = DataPointType;
  DataSinkAuthTypes = [
    DataSinkAuthType.Anonymous,
    DataSinkAuthType.UserAndPass
  ];
  DataSinkAuthType = DataSinkAuthType;
  Protocol = DataSinkProtocol;
  MTConnectItems: PreDefinedDataPoint[] = [];
  OPCUAAddresses: PreDefinedDataPoint[] = [];
  DataSinkConnectionStatus = DataSinkConnectionStatus;

  @Input() dataSink?: DataSink;
  @Output() dataPointsChange = new EventEmitter<DataPoint[]>();

  auth: DataSinkAuth = {
    type: DataSinkAuthType.Anonymous,
    userName: '',
    password: ''
  };
  connection?: DataSinkConnection;

  datapointRows?: DataPoint[];

  unsavedRow?: DataPoint;
  unsavedRowIndex: number | undefined;

  liveData: ObjectMap<DataPointLiveData> = {};

  displayedColumns = ['name', 'enabled'];
  desiredServices: Array<{ name: string; enabled: boolean }> = [];

  sub = new Subscription();
  statusSub!: Subscription;

  filterAddressStr = '';

  @ViewChild(DatatableComponent) ngxDatatable: DatatableComponent;

  get addressesOrDataItems() {
    const array =
      this.dataSink?.protocol !== DataSinkProtocol.OPC
        ? this.MTConnectItems
        : this.OPCUAAddresses;

    return array.filter((x) =>
      (x.address! + x.name!)
        .toLowerCase()
        .includes(this.filterAddressStr.toLowerCase())
    );
  }

  get isTouchedTable() {
    return this.dataPointService.isTouched;
  }

  get isLoading() {
    return this.dataPointService.status === Status.Loading;
  }

  get MTConnectStreamHref() {
    return `http://${window.location.hostname}:15404/current`;
  }

  get isBusy() {
    return this.messengerConnectionService.isBusy;
  }

  constructor(
    private dataPointService: DataPointService,
    private dataSinkService: DataSinkService,
    private dataMappingService: DataMappingService,
    private dialog: MatDialog,
    private messengerConnectionService: MessengerConnectionService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  get isEditing() {
    return !!this.unsavedRow;
  }

  ngOnInit() {
    this.MTConnectItems =
      this.dataSinkService.getPredefinedMtConnectDataPoints();
    this.OPCUAAddresses = [
      ...this.dataSinkService.getPredefinedOPCDataPoints(),
      ...(this.dataSink.customDataPoints || [])
    ];
    this.sub.add(
      combineLatest([
        this.dataPointService.dataPoints,
        this.dataMappingService.dataMappings
      ]).subscribe(([dataPoints, dataMappings]) =>
        this.onDataPoints(dataPoints, dataMappings)
      )
    );
    this.sub.add(
      this.dataSinkService.connection.subscribe((x) => this.onConnection(x))
    );

    if (this.dataSink?.protocol === DataSinkProtocol.DH) {
      //For now only DataHub supports livedata
      this.sub.add(
        this.dataSinkService.dataPointsLivedata.subscribe((x) =>
          this.onDataPointsLiveData(x)
        )
      );

      this.sub.add(
        this.dataSinkService.setLivedataTimer(DataSinkProtocol.DH).subscribe()
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const dataSink = changes.dataSink?.currentValue;
    if (!dataSink) return;

    if (
      !changes.dataSink?.previousValue ||
      dataSink.protocol !== changes.dataSink?.previousValue.protocol
    ) {
      this.onDataSink(dataSink);
    }
  }

  ngAfterViewInit() {
    this.ngxDatatable.columnMode = ColumnMode.force;
  }

  onDiscard() {
    return this.dataPointService.revert();
  }

  onApply() {
    return this.dataPointService.apply(this.dataSink?.protocol!);
  }

  onDataSink(dataSink: DataSink) {
    if (dataSink.auth) {
      this.auth = clone(dataSink.auth);
    }

    if (this.statusSub) {
      this.statusSub.unsubscribe();
    }

    this.statusSub = this.dataSinkService
      .setStatusTimer(dataSink.protocol)
      .subscribe();

    this.dataPointService.getDataPoints(dataSink.protocol);
    this.dataMappingService.getDataMappingsAll();
    if (dataSink.protocol === DataSinkProtocol.DH) {
      this.desiredServices = dataSink.desired?.services
        ? Object.entries(dataSink.desired?.services).map(
            ([name, { enabled }]) => ({
              name,
              enabled
            })
          )
        : [];
    }
  }

  updateEnabled(val: boolean) {
    if (!this.dataSink) {
      return;
    }
    this.dataSink.enabled = val;
    this.dataSinkService.updateDataSink(this.dataSink.protocol, {
      enabled: this.dataSink.enabled
    });
  }

  onDataPoints(dataPoints: DataPoint[], dataMappings: DataMapping[]) {
    for (const datapoint of dataPoints) {
      datapoint['dataMapping'] = dataMappings.find(
        (x) => datapoint.id == x.target
      );
    }
    this.datapointRows = dataPoints;
    this.dataPointsChange.emit(dataPoints);
  }

  onAdd() {
    if (!this.datapointRows) {
      return;
    }

    if (this.dataSink?.protocol === DataSinkProtocol.OPC) {
      this.dialog
        .open<
          SelectOpcUaVariableModalComponent,
          SelectOpcUaVariableModalData,
          PreDefinedDataPoint
        >(SelectOpcUaVariableModalComponent, {
          data: {
            existingAddresses: this.datapointRows
              .map((x) => x.address)
              .filter(Boolean)
          } as SelectOpcUaVariableModalData
        })
        .afterClosed()
        .subscribe((result) => {
          if (!result) {
            return;
          }
          this.onAddConfirm(result);
        });
    } else {
      this.dialog
        .open<
          CreateDataItemModalComponent,
          CreateDataItemModalData,
          PreDefinedDataPoint
        >(CreateDataItemModalComponent, {
          data: {
            dataSinkProtocol: this.dataSink?.protocol,
            existingAddresses: this.datapointRows
              .map((x) => x.address)
              .filter(Boolean)
          } as CreateDataItemModalData
        })
        .afterClosed()
        .subscribe((result) => {
          if (!result) {
            return;
          }
          this.onAddConfirm(result);
        });
    }
  }

  private onAddConfirm(result: PreDefinedDataPoint) {
    const obj = {
      ...result,
      enabled: true
    } as DataPoint;

    this.unsavedRowIndex = this.datapointRows!.length;
    this.unsavedRow = obj;
    this.datapointRows = this.datapointRows!.concat([obj]);
  }

  onEditStart(rowIndex: number, row: any) {
    this.clearUnsavedRow();
    this.unsavedRowIndex = rowIndex;
    this.unsavedRow = clone(row);
  }

  onMapEdit(obj: DataPoint) {
    const dialogRef = this.dialog.open(SelectMapModalComponent, {
      data: {
        map: Object.entries(obj.map! || {}).map(([key, value]) => ({
          from: key,
          to: value
        }))
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.unsavedRow!.map = arrayToMap(result, 'from', 'to');
    });
  }

  setDataPointAddress(obj: DataPoint, value: string) {
    obj.address = value;

    const customDataPoint = this.getCustomDataPointByAddress(obj.address);
    if (customDataPoint?.dataType) {
      obj.dataType = customDataPoint.dataType;
    }
  }

  onEditEnd() {
    if (!this.datapointRows) {
      return;
    }
    if (this.unsavedRow!.id) {
      this.dataPointService.updateDataPoint(
        this.dataSink!.protocol,
        this.unsavedRow!
      );
    } else {
      this.dataPointService.addDataPoint(
        this.dataSink!.protocol,
        this.unsavedRow!
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

  onDelete(obj: DataPoint) {
    const title = this.translate.instant('settings-data-sink.Delete');
    const message = this.translate.instant('settings-data-sink.DeleteMessage');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(title, message)
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (!dialogResult) {
        return;
      }
      this.clearUnsavedRow();
      this.dataPointService.deleteDataPoint(this.dataSink!.protocol, obj);
    });
  }

  parseMap(value: any) {
    return value ? Object.entries(value) : [];
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
    this.statusSub && this.statusSub.unsubscribe();
  }

  onSaveAuth() {
    if (
      this.dataSink?.auth?.type === this.auth.type &&
      this.auth.userName &&
      this.dataSink?.auth?.userName === this.auth.userName &&
      this.auth.password &&
      this.dataSink?.auth?.password === this.auth.password
    ) {
      return;
    }

    this.dataSinkService.updateDataSink(this.dataSink?.protocol!, {
      auth: this.auth
    });
  }

  isExistingDataPointAddress(address: string) {
    return this.datapointRows?.some((x) => x.address === address);
  }

  getDataSinkDataPointPrefix(id: string) {
    return this.dataPointService.getPrefix(id);
  }

  isNonDefinedAddress(obj: DataPoint) {
    if (!this.OPCUAAddresses) {
      return false;
    }

    return this.OPCUAAddresses.every((dp) => dp.address !== obj.address);
  }

  private getCustomDataPointByAddress(address: string) {
    if (!this.dataSink?.customDataPoints) {
      return;
    }
    return this.dataSink.customDataPoints.find((dp) => dp.address === address);
  }

  goToMtConnectStream() {
    window.open(this.MTConnectStreamHref, '_blank');
  }

  private onConnection(x: DataSinkConnection | undefined) {
    this.connection = x;
  }

  openMessenger() {
    this.messengerConnectionService
      .getMessengerStatus()
      .then(() => this.messengerConnectionService.getMessengerConfig())
      .then(() => {
        this.dialog.open(MessengerConnectionComponent, {
          width: '900px'
        });
      });
  }
  private onDataPointsLiveData(x: ObjectMap<DataPointLiveData>) {
    this.liveData = x;
  }
}
