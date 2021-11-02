import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-virtual-data-point',
  templateUrl: './virtual-data-point.component.html',
  styleUrls: ['./virtual-data-point.component.scss']
})
export class VirtualDataPointComponent implements OnInit {
  datapointRows?: VirtualDataPoint[];

  VirtualDataPointOperationType = VirtualDataPointOperationType;

  Operations = [
    VirtualDataPointOperationType.AND,
    VirtualDataPointOperationType.OR,
    VirtualDataPointOperationType.NOT,
    VirtualDataPointOperationType.COUNTER,
    VirtualDataPointOperationType.THRESHOLDS
  ];

  unsavedRow?: VirtualDataPoint;
  unsavedRowIndex: number | undefined;
  liveData: ObjectMap<DataPointLiveData> = {};

  sub = new Subscription();

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

  get sources() {
    return [
      ...((this.sourceDataPoints || []) as { id: string; name: string }[]),
      ...((this.datapointRows || []).filter(
        (x) => x.id !== this.unsavedRow?.id
      ) as { id: string; name: string }[])
    ];
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

  onDataPoints(arr: VirtualDataPoint[]) {
    console.log(arr);
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
        source: virtualPoint.sources![0]
      },
      width: '850px'
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
      VirtualDataPointOperationType.OR
    ].includes(operationType!);
  }

  private onSourceDataPoints(x: SourceDataPoint[]) {
    this.sourceDataPoints = x;
  }

  private onLiveData(x: ObjectMap<DataPointLiveData>) {
    this.liveData = x;
  }
}
