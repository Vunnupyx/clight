import { Component, ViewEncapsulation } from '@angular/core'
import { clone } from 'app/shared/utils';

export enum Protocol {
    S7 = 'S7',
    NC = 'NC',
}

@Component({
    selector: 'app-data-source',
    templateUrl: './data-source.component.html',
    styleUrls: ['./data-source.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DataSourceComponent {

    Protocol = Protocol;

    unsavedRow: any;
    unsavedRowIndex: number | undefined;

    datasourceRows = [
        { name: 'Temperature', type: 'PLC', address: 'DB10,X106.1' },
        { name: 'Temperature', type: 'NCK', address: 'ncAutoCounter' },
    ] as any[];

    onEditStart(rowIndex: number, row: any) {
        this.unsavedRowIndex = rowIndex;
        this.unsavedRow = clone(row);
    }

    onEditEnd(rowIndex: number) {
        console.log('TODO: save', this.unsavedRow[rowIndex]);
        this.datasourceRows[rowIndex] = {...this.datasourceRows[rowIndex], ...this.unsavedRow};
        delete this.unsavedRow;
        delete this.unsavedRowIndex;
    }

    onEditCancel() {
        delete this.unsavedRow;
        delete this.unsavedRowIndex;
    }
}