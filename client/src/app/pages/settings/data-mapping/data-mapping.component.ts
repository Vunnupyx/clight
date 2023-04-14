import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import {
  array2map,
  clone,
  ObjectMap,
  descendingSorter,
  sortBy
} from 'app/shared/utils';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { TranslateService } from '@ngx-translate/core';

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

  @ViewChild(DatatableComponent) ngxDatatable: DatatableComponent;

  get targets() {
    return (
      this.dataPoints?.filter((x) =>
        x.name?.toLowerCase().includes(this.filterTargetStr.toLowerCase())
      ) || []
    );
  }

  getRowClassBound = this.getRowClass.bind(this);

  constructor(
    private sourceDataPointService: SourceDataPointService,
    private dataPointService: DataPointService,
    private virtualDataPointService: VirtualDataPointService,
    private dataMappingService: DataMappingService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  get isEditing() {
    return !!this.unsavedRow;
  }

  get sourcesAndVirtualPointsFiltered() {
    return sortBy(
      [
        ...(this.sourceDataPoints || []),
        ...(this.virtualDataPoints || [])
      ].filter((x) =>
        x.name?.toLowerCase().includes(this.filterSourceStr.toLowerCase())
      ),
      (x) => String(x.enabled != false),
      descendingSorter
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

  ngAfterViewInit() {
    this.ngxDatatable.columnMode = ColumnMode.force;
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
    this.dataPoints = sortBy(
      arr,
      (x) => String(x.enabled != false),
      descendingSorter
    );
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
    this.ngxDatatable.sorts = [];
    this.mappingRows = [obj].concat(this.mappingRows);
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

  isTargetAlreadyMapped() {
    if (
      !this.mappingRows ||
      !this.unsavedRow ||
      this.unsavedRow.target === undefined
    ) {
      return false;
    }

    const newMappingId = this.unsavedRow?.id;
    const newMappingTarget = (this.unsavedRow.target as string)
      .toLowerCase()
      .trim();

    return this.mappingRows.some((dp) => {
      return (
        dp.target.toLowerCase().trim() === newMappingTarget &&
        dp.id !== newMappingId
      );
    });
  }

  private clearUnsavedRow() {
    delete this.unsavedRow;
    delete this.unsavedRowIndex;
    this.mappingRows = this.mappingRows?.filter((x) => x.id) || [];
  }

  onDelete(obj: DataMapping) {
    const title = this.translate.instant('settings-data-mapping.Delete');
    const message = this.translate.instant(
      'settings-data-mapping.DeleteMessage'
    );

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(title, message)
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (!dialogResult) {
        return;
      }
      this.clearUnsavedRow();
      this.dataMappingService.deleteDataMapping(obj);
    });
  }

  isSourceDisabled(dataPoint: SourceDataPoint | VirtualDataPoint) {
    if (!dataPoint) {
      return false;
    }

    if (!('enabled' in dataPoint)) {
      return false;
    }
    return !dataPoint.enabled;
  }

  isDataMappingDisabled(row: DataMapping) {
    const source =
      this.sourceDataPointsById[row.source] ||
      this.virtualDataPointsById[row.source];
    const target = this.dataPointsById[row.target];

    if (!source || !target) {
      return true;
    }

    return this.isSourceDisabled(source) || !target.enabled;
  }

  getRowClass(row: DataMapping) {
    if (row && this.isDataMappingDisabled(row)) {
      return 'hover-disabled';
    }
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }
}
