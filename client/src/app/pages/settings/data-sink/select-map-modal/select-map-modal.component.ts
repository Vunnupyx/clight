import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { clone } from 'app/shared/utils';
import { TranslateService } from '@ngx-translate/core';

export interface SelectMapModalData {
  map: MapItem[];
}

export interface MapItem {
  from: string;
  to: string;
  newUnsaved?: boolean;
}

@Component({
  selector: 'app-select-map-modal',
  templateUrl: 'select-map-modal.component.html'
})
export class SelectMapModalComponent {
  rows?: MapItem[];

  unsavedRow?: MapItem;
  unsavedRowIndex: number | undefined;

  constructor(
    private dialogRef: MatDialogRef<SelectMapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectMapModalData,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  get isEditing() {
    return !!this.unsavedRow;
  }

  ngOnInit() {
    this.rows = this.data.map;
  }

  onAdd() {
    if (!this.rows) {
      return;
    }

    const obj = { newUnsaved: true } as MapItem;
    this.unsavedRowIndex = this.rows.length;
    this.unsavedRow = obj;
    this.rows = this.rows.concat([obj]);
  }

  onEditStart(rowIndex: number, row: any) {
    this.clearUnsavedRow();
    this.unsavedRowIndex = rowIndex;
    this.unsavedRow = clone(row);
  }

  onEditEnd() {
    if (!this.rows) {
      return;
    }
    const unsavedRow = clone(this.unsavedRow!);
    delete unsavedRow.newUnsaved;
    this.rows = this.rows.map((row, i) =>
      i === this.unsavedRowIndex ? unsavedRow! : row
    );
    this.clearUnsavedRow();
  }

  onEditCancel() {
    this.clearUnsavedRow();
  }

  private clearUnsavedRow() {
    delete this.unsavedRow;
    delete this.unsavedRowIndex;
    this.rows = this.rows!.filter((x) => !x.newUnsaved);
  }

  onDelete(obj: MapItem) {
    const title = this.translate.instant('settings-data-sink.Delete');
    const message = this.translate.instant(
      'settings-data-sink.MappingDeleteMessage',
      { from: obj.from, to: obj.to }
    );

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(title, message)
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (!dialogResult) {
        return;
      }
      this.rows = this.rows!.filter(
        (x) => x.from !== obj.from || x.to !== obj.to
      );
    });
  }

  onSave() {
    this.dialogRef.close(this.rows);
  }

  onCancel() {
    this.dialogRef.close();
  }

  isDuplicatingField(field: 'from' | 'to', idx: number) {
    if (!this.unsavedRow || !this.unsavedRow[field]) {
      return false;
    }

    if (this.unsavedRow[field] === undefined) {
      return false;
    }

    // check whether other VDPs do not have such name
    const newFieldValue = (this.unsavedRow[field] as string)
      .toLowerCase()
      .trim();

    return this.rows!.some((mapping, index) => {
      return (
        mapping[field].toLowerCase().trim() === newFieldValue && idx !== index
      );
    });
  }
}
