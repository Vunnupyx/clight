import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

import { SourceDataPoint, VirtualDataPoint, VirtualDataPointOperationType } from '../../../models';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { clone } from "../../../shared/utils";
import { Status } from '../../../shared/state';
import { SourceDataPointService, VirtualDataPointService } from '../../../services';


@Component({
  selector: 'app-virtual-data-point',
  templateUrl: './virtual-data-point.component.html',
  styleUrls: ['./virtual-data-point.component.scss']
})
export class VirtualDataPointComponent implements OnInit {
  datapointRows?: VirtualDataPoint[];

  Operations = [
    VirtualDataPointOperationType.AND,
    VirtualDataPointOperationType.OR,
    VirtualDataPointOperationType.NOT,
    VirtualDataPointOperationType.COUNTER,
  ];

  unsavedRow?: VirtualDataPoint;
  unsavedRowIndex: number | undefined;

  sub = new Subscription();

  private sourceDataPoints: SourceDataPoint[] = [];

  get isEditing() {
    return !!this.unsavedRow;
  }

  get sources() {
    return [
      ...(this.sourceDataPoints || []) as { id: string, name: string }[],
      ...(this.datapointRows || []).filter(x => x.id !== this.unsavedRow?.id) as { id: string, name: string }[],
    ];
  }

  constructor(
    private virtualDataPointService: VirtualDataPointService,
    private sourceDataPointService: SourceDataPointService,
    private dialog: MatDialog,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.sub.add(
      this.virtualDataPointService.dataPoints.subscribe((x) =>
        this.onDataPoints(x)
      )
    );

    this.sub.add(
      this.sourceDataPointService.dataPoints.subscribe((x) =>
        this.onSourceDataPoints(x)
      )
    );

    this.virtualDataPointService.getDataPoints();
    this.sourceDataPointService.getSourceDataPointsAll();
  }

  onDataPoints(arr: VirtualDataPoint[]) {
    this.datapointRows = arr;
  }

  onAdd() {
    if (!this.datapointRows) { return; }

    const obj = {
      sources: [],
      operationType: VirtualDataPointOperationType.AND,
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
    if (this.unsavedRow!.id) {
      this.virtualDataPointService.updateDataPoint(
        this.unsavedRow?.id!,
        this.unsavedRow!
      );
    } else {
      this.virtualDataPointService.addDataPoint(
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

  onDelete(obj: VirtualDataPoint) {
    const title = this.translate.instant('settings-virtual-data-point.DeleteTitle');
    const message = this.translate.instant('settings-virtual-data-point.DeleteMessage');

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
    return this.sources.filter(x => sources.includes(x.id)).map(x => x.name).join(', ');
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }

  private onSourceDataPoints(x: SourceDataPoint[]) {
    this.sourceDataPoints = x;
  }
}
