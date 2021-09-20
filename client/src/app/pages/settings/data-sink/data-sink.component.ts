import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
import { DataPoint, DataPointType, DataSink, DataSinkProtocol } from 'app/models';
import { DataPointService, DataSinkService } from 'app/services';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { Status } from 'app/shared/state';
import { clone } from 'app/shared/utils';
import { Subscription } from 'rxjs';
import { SelectVarModalComponent } from './select-var-modal/select-var-modal.component';

@Component({
    selector: 'app-data-sink',
    templateUrl: './data-sink.component.html',
    styleUrls: ['./data-sink.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DataSinkComponent implements OnInit {

    DataPointType = DataPointType;
    Protocol = DataSinkProtocol;

    dataSinkList?: DataSink[];
    dataSink?: DataSink;
    datapointRows?: DataPoint[];

    unsavedRow?: DataPoint;
    unsavedRowIndex: number | undefined;

    sub = new Subscription();

    constructor(
        private dataPointService: DataPointService,
        private dataSinkService: DataSinkService,
        private dialog: MatDialog,
    ) { }

    get isBusy() {
        return this.dataSinkService.status != Status.Ready
            || this.dataPointService.status != Status.Ready;
    }

    ngOnInit() {
        this.sub.add(this.dataSinkService.dataSinks.subscribe(x => this.onDataSinks(x)));
        this.sub.add(this.dataPointService.dataPoints.subscribe(x => this.onDataPoints(x)));

        this.dataSinkService.getDataSinks();
    }

    onDataSinks(arr: DataSink[]) {
        if (!arr || !arr.length) {
            return;
        }
        this.dataSinkList = arr;
        this.switchDataSink(arr[0]);
    }

    switchDataSink(obj: DataSink) {
        this.dataSink = obj;
        this.dataPointService.getDataPoints(obj.id!);
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
        const obj = {} as DataPoint;
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
            this.dataPointService.updateDataPoint(this.dataSink!.id!, this.unsavedRow!);
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
        this.datapointRows = this.datapointRows!.filter(x => x.id);
    }

    onAddressSelect(obj: DataPoint) {
        const dialogRef = this.dialog.open(SelectVarModalComponent, {
            data: { selection: obj.map },
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            this.unsavedRow!.map = result;
        });
    }

    onDelete(obj: DataPoint) {
        const title = `Delete`;
        const message = `Are you sure you want to delete data point ${obj.name}?`;

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: new ConfirmDialogModel(title, message)
        });

        dialogRef.afterClosed().subscribe(dialogResult => {
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