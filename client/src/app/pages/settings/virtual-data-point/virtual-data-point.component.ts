import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import {
  DataPointLiveData,
  SourceDataPoint,
  VirtualDataPoint,
  VirtualDataPointErrorType,
  VirtualDataPointOperationType,
  VirtualDataPointReorderValidityStatus
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
import { DatatableComponent } from '@swimlane/ngx-datatable';
import {
  SetFormulaModalComponent,
  SetFormulaModalData
} from './set-formula-modal/set-formula-modal.component';
import {
  SetSchedulesModalComponent,
  SetSchedulesModalData
} from './set-schedules-modal/set-schedules-modal.component';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';

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
    },
    {
      value: VirtualDataPointOperationType.SET_TARIFF,
      text: 'virtual-data-point-operation-type.SetTariff'
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
    return `${window.location.protocol}//${
      window.location.hostname
    }/help${this.translate.instant(
      'common.LanguageDocumentationPath'
    )}/docs/VirtualDataPoints`;
  }

  constructor(
    private virtualDataPointService: VirtualDataPointService,
    private sourceDataPointService: SourceDataPointService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private toastr: ToastrService
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
    this.ngxDatatable.sorts = [];
    this.datapointRows = [obj].concat(this.datapointRows);
  }

  onEditStart(rowIndex: number, row: any) {
    console.log(rowIndex);
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

    if (
      this.unsavedRow?.operationType ===
        VirtualDataPointOperationType.SET_TARIFF &&
      !this.unsavedRow?.enumeration
    ) {
      this.unsavedRow.enumeration = {
        defaultValue: 'unknown',
        items: [
          {
            source: '',
            returnValueIfTrue: 'STANDBY',
            priority: 0
          },
          {
            source: '',
            returnValueIfTrue: 'READY_FOR_PROCESSING',
            priority: 1
          },
          {
            source: '',
            returnValueIfTrue: 'WARM_UP',
            priority: 2
          },
          {
            source: '',
            returnValueIfTrue: 'PROCESSING',
            priority: 3
          }
        ]
      };
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
    const title = this.translate.instant('settings-virtual-data-point.Delete');
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
      this.clearUnsavedRow();
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
    const dialogRef = this.dialog.open<
      SetSchedulesModalComponent,
      SetSchedulesModalData,
      SetSchedulesModalData
    >(SetSchedulesModalComponent, {
      data: {
        schedules: virtualPoint.resetSchedules || []
      },
      width: '900px'
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
        resetSchedules: result.schedules
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
        enumeration: clone(virtualPoint.enumeration),
        sources: virtualPoint.sources,
        protocol,
        isSetTariffType:
          virtualPoint.operationType ===
          VirtualDataPointOperationType.SET_TARIFF
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

  onOperationTypeChange(newOperationType) {
    if (this.unsavedRow) {
      this.unsavedRow.sources = this.unsavedRow.sources
        ? [this.unsavedRow.sources[0]]
        : [];
      this.unsavedRow.operationType = newOperationType;
    }
  }

  isAbleToSelectMultipleSources(
    operationType: VirtualDataPointOperationType | undefined
  ) {
    return [
      VirtualDataPointOperationType.AND,
      VirtualDataPointOperationType.OR,
      VirtualDataPointOperationType.ENUMERATION,
      VirtualDataPointOperationType.SET_TARIFF,
      VirtualDataPointOperationType.CALCULATION
    ].includes(operationType!);
  }

  private onSourceDataPoints(x: SourceDataPoint[]) {
    this.sourceDataPoints = x;
  }

  private onLiveData(x: ObjectMap<DataPointLiveData>) {
    this.liveData = x;
  }

  /**
   *
   * @see src/modules/VirtualDataPointManager/index.ts for usage of same logic in backend!
   * Update there as well if any logic changes here
   */
  public getVdpValidityStatus(
    vdpListToCheck: VirtualDataPoint[]
  ): VirtualDataPointReorderValidityStatus {
    if (!Array.isArray(vdpListToCheck) || vdpListToCheck?.length === 0) {
      return {
        isValid: false,
        error: 'wrongFormat'
      };
    }

    let result: VirtualDataPointReorderValidityStatus = {
      isValid: true
    };

    try {
      for (let [index, vdp] of vdpListToCheck.entries()) {
        const otherVdpSources = vdp.sources.filter((sourceVdpId) =>
          vdpListToCheck.find((v) => v.id === sourceVdpId)
        );
        if (otherVdpSources.length > 0) {
          for (let sourceVdpId of otherVdpSources) {
            const indexOfSourceVdp = vdpListToCheck.findIndex(
              (x) => x.id === sourceVdpId
            );
            if (indexOfSourceVdp >= index) {
              result.isValid = false;
              result.error = 'wrongVdpsOrder';
              result.vdpIdWithError = vdp.id;
              result.notYetDefinedSourceVdpId = sourceVdpId;
              break;
            }
          }
        }
        if (!result.isValid) {
          break;
        }
      }
      return result;
    } catch {
      return {
        isValid: false,
        error: 'unexpectedError'
      };
    }
  }

  onReorder(event) {
    let vdpList = clone(this.datapointRows);
    moveItemInArray(vdpList, event.previousIndex, event.currentIndex);

    // These warnings are shown only on reordering in the UI and prevents from clicking Apply Changes.
    // On page load, the warning is handled by virtual-data-point.service.ts
    if (!this.getVdpValidityStatus(vdpList).isValid) {
      const { vdpIdWithError, notYetDefinedSourceVdpId, error } =
        this.getVdpValidityStatus(vdpList);

      if (
        error === VirtualDataPointErrorType.UnexpectedError ||
        error === VirtualDataPointErrorType.WrongFormat
      ) {
        this.toastr.warning(
          this.translate.instant(`settings-virtual-data-point.UnexpectedError`)
        );
      } else if (error === VirtualDataPointErrorType.WrongVdpsOrder) {
        this.toastr.warning(
          this.translate.instant('settings-virtual-data-point.WrongVdpsOrder', {
            SourceId: this.datapointRows.find(
              (x) => x.id === notYetDefinedSourceVdpId
            )?.name,
            ErrorId: this.datapointRows.find((x) => x.id === vdpIdWithError)
              ?.name
          }),
          undefined,
          { timeOut: 20000, extendedTimeOut: 10000 }
        );
      }

      // Revert the changes till the order is valid
      while (!this.getVdpValidityStatus(vdpList).isValid) {
        event.previousIndex > event.currentIndex
          ? event.currentIndex++
          : event.currentIndex--;
        vdpList = clone(this.datapointRows);
        moveItemInArray(vdpList, event.previousIndex, event.currentIndex);
      }
    }
    this.virtualDataPointService.updateOrderDataPoints(vdpList);
  }

  isSetTariffAlreadyIncluded(): boolean {
    return this.datapointRows.some(
      (dp) => dp.operationType === VirtualDataPointOperationType.SET_TARIFF
    );
  }
}
