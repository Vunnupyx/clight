import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { DataPoint, DataPointType, DataSink } from 'app/models';
import { DataPointService, DataSinkService } from 'app/services';
import { Status } from 'app/shared/state';
import { clone } from 'app/shared/utils';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { CreateDataItemModalComponent } from '../create-data-item-modal/create-data-item-modal.component';
import { MT_CONNECT_DATA_ITEMS_MOCK } from './data-sink-mt-connect.component.mock';
import { SelectMapModalComponent } from '../select-map-modal/select-map-modal.component';
import { PreDefinedDataPoint } from '../create-data-item-modal/create-data-item-modal.component.mock';

@Component({
  selector: 'app-data-sink-mt-connect',
  templateUrl: './data-sink-mt-connect.component.html',
  styleUrls: ['./data-sink-mt-connect.component.scss']
})
export class DataSinkMtConnectComponent implements OnInit, OnChanges {
  DataPointType = DataPointType;
  MTConnectItems = MT_CONNECT_DATA_ITEMS_MOCK();

  @Input() dataSink?: DataSink;

  datapointRows?: DataPoint[];

  unsavedRow?: DataPoint;
  unsavedRowIndex: number | undefined;

  sub = new Subscription();

  constructor(
    private dataPointService: DataPointService,
    private dataSinkService: DataSinkService,
    private dialog: MatDialog
  ) {}

  get isBusy() {
    return (
      this.dataSinkService.status != Status.Ready ||
      this.dataPointService.status != Status.Ready
    );
  }

  get isEditing() {
    return !!this.unsavedRow;
  }

  ngOnInit() {
    this.sub.add(
      this.dataPointService.dataPoints.subscribe((x) => this.onDataPoints(x))
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    const dataSink = changes.dataSink?.currentValue;
    if (dataSink) {
      this.onDataSink(dataSink);
    }
  }

  onDataSink(dataSink: DataSink) {
    this.dataPointService.getDataPoints(dataSink.id!);
  }

  updateEnabled(val: boolean) {
    if (!this.dataSink) {
      return;
    }
    this.dataSink.enabled = val;
    this.dataSinkService.updateDataSink(this.dataSink);
  }

  onDataPoints(arr: DataPoint[]) {
    this.datapointRows = arr;
  }

  onAdd() {
    if (!this.datapointRows) {
      return;
    }

    const dialogRef = this.dialog.open(CreateDataItemModalComponent, {
      data: { selection: undefined }
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
      initValue: result.initialValue,
      type: result.type,
      enabled: true,
      map: []
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
        map: obj.map.map((x) => ({
          from: x.split('->')[0],
          to: x.split('->')[1]
        }))
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.unsavedRow!.map = result.map((x) => `${x.from}->${x.to}`);
    });
  }

  onEditEnd() {
    if (!this.datapointRows) {
      return;
    }
    if (this.unsavedRow!.id) {
      this.dataPointService.updateDataPoint(
        this.dataSink!.id!,
        this.unsavedRow!
      );
    } else {
      this.dataPointService.addDataPoint(this.dataSink!.id!, this.unsavedRow!);
    }
    this.clearUnsavedRow();
  }

  onEditCancel() {
    this.clearUnsavedRow();
  }

  private clearUnsavedRow() {
    delete this.unsavedRow;
    delete this.unsavedRowIndex;
    this.datapointRows = this.datapointRows!.filter((x) => x.id);
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
      this.dataPointService.deleteDataPoint(this.dataSink!.id!, obj);
    });
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }
}
