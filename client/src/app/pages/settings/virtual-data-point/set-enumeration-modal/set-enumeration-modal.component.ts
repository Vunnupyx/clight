import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataPointLiveData, DataSourceProtocol, SourceDataPoint, VirtualDataPointEnumeration, VirtualDataPointEnumerationItem } from 'app/models';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { SourceDataPointService } from 'app/services';
import { Subscription } from 'rxjs';
import { ObjectMap } from 'app/shared/utils';

export interface SetEnumerationModalData {
  protocol?: DataSourceProtocol;
  sources?: string[];
  enumeration: VirtualDataPointEnumeration;
}

@Component({
  selector: 'app-set-enumeration-modal',
  templateUrl: './set-enumeration-modal.component.html',
  styleUrls: ['./set-enumeration-modal.component.scss'],
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
    private dialogRef: MatDialogRef<SetEnumerationModalComponent, SetEnumerationModalData>,
    @Inject(MAT_DIALOG_DATA) public data: SetEnumerationModalData,
    private sourceDataPointService: SourceDataPointService,
  ) {}

  ngOnInit() {
    
    this.sub.add(this.sourceDataPointService.dataPoints.subscribe(x => this.onDataPoints(x)));
    this.sub.add(this.sourceDataPointService.dataPointsLivedata.subscribe(x => this.onLiveData(x)));

    this.liveDataSub = this.sourceDataPointService
      .setLivedataTimer(
        this.data.protocol!,
        'true'
      )
      .subscribe();

    this.defaultValue = this.data.enumeration.defaultValue!;
    this.rows = this.data.enumeration.items;
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

    const newSchedule = {
    } as VirtualDataPointEnumerationItem;

    this.rows = this.rows.concat([newSchedule]);
  }

  onSave() {
    this.dialogRef.close({
      enumeration: {
        defaultValue: this.defaultValue,
        items: this.rows.map((row, index) => ({...row, priority: index})),
      },
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private onDataPoints(arr: SourceDataPoint[]) {
    if (!arr) {
      return;
    }
    this.sourceOptions = this.data.sources?.map(sourceId => arr.find(obj => obj.id === sourceId)).filter(Boolean) as SourceDataPoint[];
  }

  private onLiveData(obj: ObjectMap<DataPointLiveData>) {
    if (!obj) {
      return;
    }
    this.liveData = obj;
  }

}
