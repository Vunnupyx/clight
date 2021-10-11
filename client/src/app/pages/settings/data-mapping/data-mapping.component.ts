import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SourceDataPoint, DataPoint, DataMapping } from 'app/models';
import {
  SourceDataPointService,
  DataPointService,
  DataMappingService
} from 'app/services';
import { Status } from 'app/shared/state';
import { array2map, clone, ObjectMap } from 'app/shared/utils';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from 'app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-data-mapping',
  templateUrl: './data-mapping.component.html',
  styleUrls: ['./data-mapping.component.scss']
})
export class DataMappingComponent implements OnInit, OnDestroy {
  sourceDataPoints?: SourceDataPoint[];
  sourceDataPointsById?: ObjectMap<SourceDataPoint>;
  dataPoints?: DataPoint[];
  dataPointsById?: ObjectMap<DataPoint>;
  mappingRows?: DataMapping[];

  unsavedRow?: DataMapping;
  unsavedRowIndex: number | undefined;

  sub = new Subscription();

  constructor(
    private sourceDataPointService: SourceDataPointService,
    private dataPointService: DataPointService,
    private dataMappingService: DataMappingService,
    private dialog: MatDialog
  ) {}

  get isBusy() {
    return (
      this.sourceDataPointService.status != Status.Ready ||
      this.dataPointService.status != Status.Ready ||
      this.dataMappingService.status != Status.Ready
    );
  }

  get isEditing() {
    return !!this.unsavedRow;
  }

  ngOnInit() {
    this.sub.add(
      this.sourceDataPointService.dataPoints.subscribe((x) =>
        this.onSourceDataPoints(x)
      )
    );
    this.sub.add(
      this.dataPointService.dataPoints.subscribe((x) => this.onDataPoints(x))
    );
    this.sub.add(
      this.dataMappingService.dataMappings.subscribe((x) =>
        this.onDataMappings(x)
      )
    );

    this.sourceDataPointService.getSourceDataPointsAll();
    this.dataPointService.getDataPointsAll();
    this.dataMappingService.getDataMappingsAll();
  }

  onSourceDataPoints(arr: SourceDataPoint[]) {
    if (arr) {
      this.sourceDataPoints = arr;
      this.sourceDataPointsById = array2map(arr, (x) => x.id);
    }
  }

  onDataPoints(arr: DataPoint[]) {
    this.dataPoints = arr;
    this.dataPointsById = array2map(arr, (x) => x.id!);
  }

  onDataMappings(arr: DataMapping[]) {
    this.mappingRows = arr;
  }

  getSourceDataPoint(id: string) {
    return this.sourceDataPointsById![id];
  }

  getDataPoint(id: string) {
    return this.dataPointsById![id];
  }

  onAdd() {
    if (!this.mappingRows) {
      return;
    }
    const obj = {} as DataMapping;
    this.unsavedRowIndex = this.mappingRows.length;
    this.unsavedRow = obj;
    this.mappingRows = this.mappingRows.concat([obj]);
  }

  onEditStart(rowIndex: number, row: any) {
    this.clearUnsavedRow();
    this.unsavedRowIndex = rowIndex;
    this.unsavedRow = clone(row);
  }

  onEditEnd() {
    if (!this.mappingRows) {
      return;
    }
    if (this.unsavedRow!.id) {
      this.dataMappingService.updateDataMapping(this.unsavedRow!).then(() => {
        this.clearUnsavedRow();
      });
    } else {
      this.dataMappingService.addDataMapping(this.unsavedRow!).then(() => {
        this.clearUnsavedRow();
      });
    }
  }

  onEditCancel() {
    this.clearUnsavedRow();
  }

  private clearUnsavedRow() {
    delete this.unsavedRow;
    delete this.unsavedRowIndex;
    this.mappingRows = this.mappingRows!.filter((x) => x.source);
  }

  onDelete(obj: DataMapping) {
    const title = `Delete`;
    const message = `Are you sure you want to delete data mapping?`;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(title, message)
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (!dialogResult) {
        return;
      }
      this.dataMappingService.deleteDataMapping(obj);
    });
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }
}
