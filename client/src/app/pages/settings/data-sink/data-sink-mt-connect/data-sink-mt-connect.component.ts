import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import {
  DataPoint,
  DataPointType,
  DataSink,
  DataSinkAuth,
  DataSinkAuthType,
  DataSinkConnection,
  DataSinkConnectionStatus,
  DataSinkProtocol
} from 'app/models';
import { DataPointService, DataSinkService } from 'app/services';
import { arrayToMap, clone } from 'app/shared/utils';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { CreateDataItemModalComponent } from '../create-data-item-modal/create-data-item-modal.component';
import { SelectMapModalComponent } from '../select-map-modal/select-map-modal.component';
import { PreDefinedDataPoint } from '../create-data-item-modal/create-data-item-modal.component.mock';

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
  MTConnectItems: DataPoint[] = [];
  OPCUAAddresses: DataPoint[] = [];
  DataSinkConnectionStatus = DataSinkConnectionStatus;

  @Input() dataSink?: DataSink;

  auth: DataSinkAuth = {
    type: DataSinkAuthType.Anonymous,
    userName: '',
    password: ''
  };
  connection?: DataSinkConnection;

  datapointRows?: DataPoint[];

  unsavedRow?: DataPoint;
  unsavedRowIndex: number | undefined;

  sub = new Subscription();

  get MTConnectStreamHref() {
    return `${window.location.protocol}//${window.location.hostname}:15504/current`;
  }

  constructor(
    private dataPointService: DataPointService,
    private dataSinkService: DataSinkService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  get isEditing() {
    return !!this.unsavedRow;
  }

  ngOnInit() {
    this.MTConnectItems =
      this.dataSinkService.getPredefinedMtConnectDataPoints();
    this.OPCUAAddresses = this.dataSinkService.getPredefinedOPCDataPoints();
    this.sub.add(
      this.dataPointService.dataPoints.subscribe((x) => this.onDataPoints(x))
    );
    this.sub.add(
      this.dataSinkService.connection.subscribe((x) => this.onConnection(x))
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    const dataSink = changes.dataSink?.currentValue;
    if (dataSink) {
      this.onDataSink(dataSink);
    }
  }

  onDataSink(dataSink: DataSink) {
    if (dataSink.auth) {
      this.auth = clone(dataSink.auth);
    }

    if (dataSink.protocol !== DataSinkProtocol.DH) {
      this.dataPointService.getDataPoints(dataSink.protocol);
      this.dataSinkService.getStatus(dataSink.protocol);
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

  onDataPoints(arr: DataPoint[]) {
    this.datapointRows = arr;
  }

  onAdd() {
    if (!this.datapointRows) {
      return;
    }

    const dialogRef = this.dialog.open(CreateDataItemModalComponent, {
      data: {
        selection: undefined,
        dataSinkProtocol: this.dataSink?.protocol,
        existedAddresses: this.datapointRows
          .map((x) => x.address)
          .filter(Boolean)
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.onAddConfirm(result);
    });
  }

  onAddConfirm(result: PreDefinedDataPoint) {
    const obj = {
      name: result.name,
      address: result.address,
      initialValue: result.initialValue,
      type: result.type,
      enabled: true,
      map: result.map
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
    const title = `Delete`;
    const message = `Are you sure you want to delete data point ${obj.name}?`;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(title, message)
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (!dialogResult) {
        return;
      }
      this.dataPointService.deleteDataPoint(this.dataSink!.protocol, obj);
    });
  }

  parseMap(value: any) {
    return value ? Object.entries(value) : [];
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
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

  saveDatahubConfig(form: NgForm) {
    this.dataSinkService
      .updateDataSink(this.dataSink?.protocol!, { datahubconfig: form.value })
      .then(() =>
        this.toastr.success(
          this.translate.instant('settings-data-sink.DataHubConfigSaveSuccess')
        )
      )
      .then(() => form.resetForm(form.value));
  }

  goToMtConnectStream() {
    window.open(this.MTConnectStreamHref, '_blank');
  }

  private onConnection(x: DataSinkConnection | undefined) {
    this.connection = x;
  }
}
