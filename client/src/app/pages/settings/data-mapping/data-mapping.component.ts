import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {
  SourceDataPoint,
  DataPoint,
  DataMapping,
  VirtualDataPoint
} from 'app/models';
import {
  SourceDataPointService,
  DataPointService,
  DataMappingService,
  VirtualDataPointService
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
  virtualDataPoints?: VirtualDataPoint[];
  virtualDataPointsById?: ObjectMap<VirtualDataPoint>;

  unsavedRow?: DataMapping;
  unsavedRowIndex: number | undefined;

  filterTargetStr: string = '';
  filterSourceStr: string = '';

  sub = new Subscription();

  get targets() {
    return (
      this.dataPoints?.filter((x) =>
        x.name?.toLowerCase().includes(this.filterTargetStr.toLowerCase())
      ) || []
    );
  }

  constructor(
    private sourceDataPointService: SourceDataPointService,
    private dataPointService: DataPointService,
    private virtualDataPointService: VirtualDataPointService,
    private dataMappingService: DataMappingService,
    private dialog: MatDialog
  ) {}

  get isEditing() {
    return !!this.unsavedRow;
  }

  get sourcesPoints() {
    return this.sourceDataPoints || [];
  }

  get sourcesPointsFiltered() {
    return (
      this.sourceDataPoints?.filter((x) =>
        x.name?.toLowerCase().includes(this.filterSourceStr.toLowerCase())
      ) || []
    );
  }

  get sourcesVirtualPoints() {
    return this.virtualDataPoints || [];
  }

  get sourcesVirtualPointsFiltered() {
    return (
      this.virtualDataPoints?.filter((x) =>
        x.name?.toLowerCase().includes(this.filterSourceStr.toLowerCase())
      ) || []
    );
  }

  get isTouchedTable() {
    return this.dataMappingService.isTouched;
  }

  get isLoading() {
    return this.dataMappingService.status === Status.Loading;
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
      this.virtualDataPointService.dataPoints.subscribe((x) =>
        this.onVirtualDataPoints(x)
      )
    );
    this.sub.add(
      this.dataMappingService.dataMappings.subscribe((x) =>
        this.onDataMappings(x)
      )
    );

    this.sourceDataPointService.getSourceDataPointsAll();
    this.virtualDataPointService.getDataPoints();
    this.dataPointService.getDataPointsAll();
    this.dataMappingService.getDataMappingsAll();
  }

  getSourcePrefix(id: string | undefined) {
    if (!this.sourceDataPointsById || !this.virtualDataPointsById) {
      return null;
    }

    if (this.sourceDataPointsById[id!]) {
      return this.sourceDataPointService.getPrefix(id!);
    }

    return this.virtualDataPointService.getPrefix();
  }

  getTargetPrefix(id: string | undefined) {
    return this.dataPointService.getPrefix(id!);
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

  onVirtualDataPoints(arr: VirtualDataPoint[]) {
    this.virtualDataPoints = arr;
    this.virtualDataPointsById = array2map(arr, (x) => x.id!);
  }

  onDataMappings(arr: DataMapping[]) {
    this.mappingRows = arr;
  }

  getSourceDataPoint(id: string) {
    if (!this.sourceDataPointsById || !this.virtualDataPointsById) {
      return null;
    }

    return this.sourceDataPointsById[id] || this.virtualDataPointsById[id];
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

  onDiscard() {
    return this.dataMappingService.revert();
  }

  async onApply() {
    await this.dataMappingService.apply();
    await this.dataMappingService.getDataMappingsAll();
  }

  isDuplicatingMapping() {
    if (!this.mappingRows || !this.unsavedRow) {
      return false;
    }

    if (
      this.unsavedRow.source === undefined ||
      this.unsavedRow.target === undefined
    ) {
      return false;
    }

    // check whether other DPs do not have such name
    const newFieldValueSource = (this.unsavedRow.source as string)
      .toLowerCase()
      .trim();

    const newFieldValueTarget = (this.unsavedRow.target as string)
      .toLowerCase()
      .trim();

    const editableId = this.unsavedRow?.id;

    return this.mappingRows.some((dp) => {
      return (
        dp.source.toLowerCase().trim() === newFieldValueSource &&
        dp.target.toLowerCase().trim() === newFieldValueTarget &&
        dp.id !== editableId
      );
    });
  }

  private clearUnsavedRow() {
    this.mappingRows = this.mappingRows!.filter((_, idx) =>
      !this.unsavedRow?.id ? idx !== this.unsavedRowIndex : true
    );
    delete this.unsavedRow;
    delete this.unsavedRowIndex;
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

  filterTargets(event) {}
}
