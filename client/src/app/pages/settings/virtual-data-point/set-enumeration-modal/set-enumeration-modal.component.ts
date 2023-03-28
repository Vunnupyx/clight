import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {
  DataPointLiveData,
  DataSourceProtocol,
  SourceDataPoint,
  VirtualDataPoint,
  VirtualDataPointEnumeration,
  VirtualDataPointEnumerationItem
} from 'app/models';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { SourceDataPointService, VirtualDataPointService } from 'app/services';
import { Subscription } from 'rxjs';
import { ObjectMap } from 'app/shared/utils';
import { withLatestFrom } from 'rxjs/operators';

export interface SetEnumerationModalData {
  protocol?: DataSourceProtocol;
  sources?: string[];
  enumeration: VirtualDataPointEnumeration;
}

@Component({
  selector: 'app-set-enumeration-modal',
  templateUrl: './set-enumeration-modal.component.html',
  styleUrls: ['./set-enumeration-modal.component.scss']
})
export class SetEnumerationModalComponent implements OnInit, OnDestroy {
  sourceOptions?: SourceDataPoint[];
  liveData?: ObjectMap<DataPointLiveData>;

  sub = new Subscription();
  liveDataSub!: Subscription;

  defaultValue!: string;
  rows: VirtualDataPointEnumerationItem[] = [];
  unsavedRow?: VirtualDataPointEnumerationItem;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<
      SetEnumerationModalComponent,
      SetEnumerationModalData
    >,
    @Inject(MAT_DIALOG_DATA) public data: SetEnumerationModalData,
    private sourceDataPointService: SourceDataPointService,
    private virtualDataPointService: VirtualDataPointService
  ) {}

  ngOnInit() {
    this.sub.add(
      this.sourceDataPointService.dataPoints
        .pipe(withLatestFrom(this.virtualDataPointService.dataPoints))
        .subscribe(([sourceDataPoints, virtualDataPoints]) =>
          this.onDataPoints(sourceDataPoints, virtualDataPoints)
        )
    );
    this.sub.add(
      this.sourceDataPointService.dataPointsLivedata.subscribe((x) =>
        this.onLiveData(x)
      )
    );
    this.sub.add(
      this.virtualDataPointService.dataPointsLivedata.subscribe((x) =>
        this.onLiveData(x)
      )
    );

    this.liveDataSub = this.sourceDataPointService
      .setLivedataTimer(this.data.protocol!, 'true')
      .subscribe();

    this.defaultValue = this.data.enumeration.defaultValue!;
    this.rows = this.data.enumeration.items.sort(
      (a, b) => a.priority - b.priority
    );
  }

  onDelete(index: number) {
    const title = `Delete`;
    const message = `Are you sure you want to delete enumeration item?`;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(title, message)
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (!dialogResult) {
        return;
      }
      this.rows.splice(index, 1);
    });
  }

  onAdd() {
    if (!this.rows) {
      this.rows = [];
    }

    const newSchedule = {} as VirtualDataPointEnumerationItem;

    this.rows = this.rows.concat([newSchedule]);
  }

  onSave() {
    this.dialogRef.close({
      enumeration: {
        defaultValue: this.defaultValue,
        items: this.rows.map((row, index) => ({ ...row, priority: index }))
      }
    });
  }

  onReorder(event) {
    moveItemInArray(this.rows, event.previousIndex, event.currentIndex);
  }

  onCancel() {
    this.dialogRef.close();
  }

  getLiveDataValue(source: string) {
    if (!source || !this.liveData) {
      return;
    }
    return this.liveData[source]?.value;
  }

  getSourcePrefix(source: SourceDataPoint | VirtualDataPoint) {
    if ((source as SourceDataPoint).address) {
      return this.sourceDataPointService.getPrefix(source.id);
    }
    return this.virtualDataPointService.getPrefix();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.liveDataSub.unsubscribe();
  }

  private onDataPoints(
    sourceDataPoints: SourceDataPoint[],
    virtualDataPoints: VirtualDataPoint[]
  ) {
    if (!sourceDataPoints?.length) {
      return;
    }
    const dictionaries = [
      ...(sourceDataPoints || []),
      ...(virtualDataPoints || [])
    ];

    this.sourceOptions = this.data.sources
      ?.map(
        (sourceId) =>
          dictionaries.find((obj) => obj.id === sourceId) as SourceDataPoint
      )
      .filter(Boolean);
  }

  private onLiveData(obj: ObjectMap<DataPointLiveData>) {
    if (!obj) {
      return;
    }
    this.liveData = {
      ...this.liveData,
      ...obj
    };
  }
}
