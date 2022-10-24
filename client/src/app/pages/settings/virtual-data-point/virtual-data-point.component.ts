import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import {
  DataPointLiveData,
  SourceDataPoint,
  VirtualDataPoint,
  VirtualDataPointOperationType
} from '../../../models';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { clone, ObjectMap } from '../../../shared/utils';
import {
  SourceDataPointService,
  VirtualDataPointService
} from '../../../services';
import { SetThresholdsModalComponent } from './set-thresholds-modal/set-thresholds-modal.component';
import { Status } from 'app/shared/state';
import { SetEnumerationModalComponent } from './set-enumeration-modal/set-enumeration-modal.component';
import {
  PromptDialogComponent,
  PromptDialogModel
} from 'app/shared/components/prompt-dialog/prompt-dialog.component';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import {
  SetFormulaModalComponent,
  SetFormulaModalData
} from './set-formula-modal/set-formula-modal.component';
import { SetSchedulesModalComponent, SetSchedulesModalData } from "./set-schedules-modal/set-schedules-modal.component";

@Component({
  selector: 'app-virtual-data-point',
  templateUrl: './virtual-data-point.component.html',
  styleUrls: ['./virtual-data-point.component.scss']
})
export class VirtualDataPointComponent implements OnInit {
  datapointRows?: VirtualDataPoint[];

  VirtualDataPointOperationType = VirtualDataPointOperationType;

  Operations = [
    {
      value: VirtualDataPointOperationType.AND,
      text: 'virtual-data-point-operation-type.And'
    },
    {
      value: VirtualDataPointOperationType.OR,
      text: 'virtual-data-point-operation-type.Or'
    },
    {
      value: VirtualDataPointOperationType.NOT,
      text: 'virtual-data-point-operation-type.Not'
    },
    {
      value: VirtualDataPointOperationType.COUNTER,
      text: 'virtual-data-point-operation-type.Counter'
    },
    {
      value: VirtualDataPointOperationType.THRESHOLDS,
      text: 'virtual-data-point-operation-type.Thresholds'
    },
    {
      value: VirtualDataPointOperationType.GREATER,
      text: 'virtual-data-point-operation-type.Greater'
    },
    {
      value: VirtualDataPointOperationType.GREATER_EQUAL,
      text: 'virtual-data-point-operation-type.GreaterOrEqual'
    },
    {
      value: VirtualDataPointOperationType.SMALLER,
      text: 'virtual-data-point-operation-type.Smaller'
    },
    {
      value: VirtualDataPointOperationType.SMALLER_EQUAL,
      text: 'virtual-data-point-operation-type.SmallerEqual'
    },
    {
      value: VirtualDataPointOperationType.EQUAL,
      text: 'virtual-data-point-operation-type.Equal'
    },
    {
      value: VirtualDataPointOperationType.UNEQUAL,
      text: 'virtual-data-point-operation-type.Unequal'
    },
    {
      value: VirtualDataPointOperationType.ENUMERATION,
      text: 'virtual-data-point-operation-type.Enumeration'
    },
    {
      value: VirtualDataPointOperationType.CALCULATION,
      text: 'virtual-data-point-operation-type.Calculation'
    }
  ];

  unsavedRow?: VirtualDataPoint;
  unsavedRowIndex: number | undefined;
  liveData: ObjectMap<DataPointLiveData> = {};

  filterSourceStr: string = '';

  sub = new Subscription();

  @ViewChild(DatatableComponent) ngxDatatable: DatatableComponent;

  private sourceDataPoints: SourceDataPoint[] = [];

  get isEditing() {
    return !!this.unsavedRow;
  }

  get dataSources() {
    return (this.sourceDataPoints || []) as { id: string; name: string }[];
  }

  get previousVirtualPoints() {
    return (this.datapointRows || []).filter(
      (x) => x.id !== this.unsavedRow?.id
    ) as { id: string; name: string }[];
  }

  get previousVirtualPointsFiltered() {
    return this.previousVirtualPoints.filter((x) =>
      x.name?.toLowerCase().includes(this.filterSourceStr.toLowerCase())
    );
  }

  get dataSourcesFiltered() {
    return this.dataSources.filter((x) =>
      x.name?.toLowerCase().includes(this.filterSourceStr.toLowerCase())
    );
  }

  get sources() {
    return [
      ...((this.sourceDataPoints || []) as { id: string; name: string }[]),
      ...((this.datapointRows || []).filter(
        (x) => x.id !== this.unsavedRow?.id
      ) as { id: string; name: string }[])
    ];
  }

  get isTouchedTable() {
    return this.virtualDataPointService.isTouched;
  }

  get isLoading() {
    return this.virtualDataPointService.status === Status.Loading;
  }

  get supportHref() {
    return `${window.location.protocol}//${window.location.hostname}/help/docs/VirtualDataPoints`;
  }

  constructor(
    private virtualDataPointService: VirtualDataPointService,
    private sourceDataPointService: SourceDataPointService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.sub.add(
      this.virtualDataPointService.dataPoints.subscribe((x) =>
        this.onDataPoints(x)
      )
    );

    this.sub.add(
      this.virtualDataPointService.dataPointsLivedata.subscribe((x) =>
        this.onLiveData(x)
      )
    );

    this.sub.add(
      this.sourceDataPointService.dataPoints.subscribe((x) =>
        this.onSourceDataPoints(x)
      )
    );

    this.sub.add(this.virtualDataPointService.setLivedataTimer().subscribe());

    this.virtualDataPointService.getDataPoints();
    this.virtualDataPointService.getLiveDataForDataPoints();
    this.sourceDataPointService.getSourceDataPointsAll();
  }

  ngAfterViewInit() {
    this.ngxDatatable.columnMode = ColumnMode.force;
  }

  onDiscard() {
    return this.virtualDataPointService.revert();
  }

  onApply() {
    return this.virtualDataPointService.apply();
  }

  onDataPoints(arr: VirtualDataPoint[]) {
    this.datapointRows = arr;
  }

  getVirtualDataPointPrefix() {
    return this.virtualDataPointService.getPrefix();
  }

  getDataSourceDataPointPrefix(id: string) {
    return this.sourceDataPointService.getPrefix(id);
  }

  onAdd() {
    if (!this.datapointRows) {
      return;
    }

    const obj = {
      id: '',
      sources: [],
      operationType: VirtualDataPointOperationType.AND
    } as VirtualDataPoint;

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

    if (
      this.unsavedRow?.operationType !==
      VirtualDataPointOperationType.THRESHOLDS
    ) {
      delete this.unsavedRow?.thresholds;
    }

    if (this.unsavedRow!.id) {
      this.virtualDataPointService
        .updateDataPoint(this.unsavedRow?.id!, this.unsavedRow!)
        .then(() => this.virtualDataPointService.getLiveDataForDataPoints());
    } else {
      this.virtualDataPointService
        .addDataPoint(this.unsavedRow!)
        .then(() => this.virtualDataPointService.getLiveDataForDataPoints());
    }
    this.clearUnsavedRow();
  }

  isDuplicatingName() {
    if (!this.datapointRows) {
      return false;
    }

    // check whether other VDPs do not have such name
    const newName = this.unsavedRow?.name?.toLowerCase().trim();
    const editableId = this.unsavedRow?.id;

    return this.datapointRows.some((dp) => {
      return dp.name?.toLowerCase().trim() === newName && dp.id !== editableId;
    });
  }

  onEditCancel() {
    this.clearUnsavedRow();
  }

  private clearUnsavedRow() {
    delete this.unsavedRow;
    delete this.unsavedRowIndex;
    this.datapointRows = this.datapointRows?.filter((x) => x.id) || [];
  }

  onDelete(obj: VirtualDataPoint) {
    const title = this.translate.instant(
      'settings-virtual-data-point.DeleteTitle'
    );
    const message = this.translate.instant(
      'settings-virtual-data-point.DeleteMessage'
    );

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(title, message)
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (!dialogResult) {
        return;
      }
      this.virtualDataPointService.deleteDataPoint(obj.id!);
    });
  }

  onReset(obj: VirtualDataPoint) {
    if (obj.operationType !== 'counter') {
      return;
    }
    this.virtualDataPointService.resetCounter(obj);
  }

  getSourceNames(sources: string[]) {
    return this.sources
      .filter((x) => sources.includes(x.id))
      .map(
        (x) =>
          `${
            this.getDataSourceDataPointPrefix(x.id) ||
            this.getVirtualDataPointPrefix()
          } ${x.name}`
      )
      .join(', ');
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }

  getRowIndex(id: string) {
    return this.datapointRows?.findIndex((x) => x.id === id)!;
  }

  onSetSchedule(virtualPoint: VirtualDataPoint) {
    const dialogRef = this.dialog.open<SetSchedulesModalComponent, SetSchedulesModalData, SetSchedulesModalData>(
      SetSchedulesModalComponent,
      {
        data: {
          schedules: virtualPoint.resetSchedules!.slice(),
        },
      });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      if (!virtualPoint.id) {
        virtualPoint.resetSchedules = result.schedules;
        return;
      }

      this.virtualDataPointService.updateDataPoint(virtualPoint.id, {
        ...virtualPoint,
        resetSchedules: result.schedules,
      });
    });
  }

  canSetComparativeValue(
    operationType: VirtualDataPointOperationType | undefined
  ) {
    return [
      VirtualDataPointOperationType.GREATER,
      VirtualDataPointOperationType.GREATER_EQUAL,
      VirtualDataPointOperationType.SMALLER,
      VirtualDataPointOperationType.SMALLER_EQUAL,
      VirtualDataPointOperationType.EQUAL,
      VirtualDataPointOperationType.UNEQUAL
    ].includes(operationType!);
  }

  onSetEnumeration(virtualPoint: VirtualDataPoint) {
    if (!virtualPoint.enumeration) {
      virtualPoint.enumeration = { items: [] };
    }

    const protocol = this.sourceDataPointService.getProtocol(
      virtualPoint.sources![0]
    );

    this.sourceDataPointService.getSourceDataPointsAll();
    this.sourceDataPointService.getLiveDataForDataPoints(protocol, 'true');

    const dialogRef = this.dialog.open(SetEnumerationModalComponent, {
      data: {
        enumeration: { ...virtualPoint.enumeration },
        sources: virtualPoint.sources,
        protocol
      },
      width: '900px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!virtualPoint.id) {
          virtualPoint.enumeration = result.enumeration;
          return;
        }

        this.virtualDataPointService.updateDataPoint(virtualPoint.id, {
          ...virtualPoint,
          enumeration: result.enumeration
        });
      }
    });
  }

  onSetFormula(virtualPoint: VirtualDataPoint) {
    const dialogRef = this.dialog.open<
      SetFormulaModalComponent,
      SetFormulaModalData,
      SetFormulaModalData
    >(SetFormulaModalComponent, {
      data: {
        formula: virtualPoint.formula,
        sources: virtualPoint.sources
      },
      width: '900px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!virtualPoint.id) {
          virtualPoint.formula = result.formula;
          return;
        }

        this.virtualDataPointService.updateDataPoint(virtualPoint.id, {
          formula: result.formula
        });
      }
    });
  }

  onSetComparativeValue(virtualPoint: VirtualDataPoint) {
    if (!virtualPoint.thresholds) {
      virtualPoint.thresholds = {};
    }

    const dialogRef = this.dialog.open<
      PromptDialogComponent,
      PromptDialogModel,
      string
    >(PromptDialogComponent, {
      data: {
        title: this.translate.instant(
          'settings-virtual-data-point.SetComparativeValue'
        ),
        inputValue: virtualPoint.comparativeValue
      } as PromptDialogModel
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!virtualPoint.id) {
          virtualPoint.comparativeValue = result;
          return;
        }

        this.virtualDataPointService.updateDataPoint(virtualPoint.id, {
          ...virtualPoint,
          comparativeValue: result
        });
      }
    });
  }

  onSetThreshold(virtualPoint: VirtualDataPoint) {
    if (!virtualPoint.thresholds) {
      virtualPoint.thresholds = {};
    }

    const protocol = this.sourceDataPointService.getProtocol(
      virtualPoint.sources![0]
    );

    this.sourceDataPointService.getLiveDataForDataPoints(protocol, 'true');

    const dialogRef = this.dialog.open(SetThresholdsModalComponent, {
      data: {
        thresholds: { ...virtualPoint.thresholds },
        source: virtualPoint.sources![0],
        sourceName: this.getSourceNames(virtualPoint.sources!)
      },
      width: '1400px',
      maxWidth: '100%'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!virtualPoint.id) {
          virtualPoint.thresholds = result;
          return;
        }

        this.virtualDataPointService.updateDataPoint(virtualPoint.id, {
          ...virtualPoint,
          thresholds: result
        });
      }
    });
  }

  isAbleToSelectMultipleSources(
    operationType: VirtualDataPointOperationType | undefined
  ) {
    return [
      VirtualDataPointOperationType.AND,
      VirtualDataPointOperationType.OR,
      VirtualDataPointOperationType.ENUMERATION,
      VirtualDataPointOperationType.THRESHOLDS,
      VirtualDataPointOperationType.CALCULATION
    ].includes(operationType!);
  }

  private onSourceDataPoints(x: SourceDataPoint[]) {
    this.sourceDataPoints = x;
  }

  private onLiveData(x: ObjectMap<DataPointLiveData>) {
    this.liveData = x;
  }
}
