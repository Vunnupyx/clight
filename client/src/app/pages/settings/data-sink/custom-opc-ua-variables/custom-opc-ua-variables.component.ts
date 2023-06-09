import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DataSinkService } from 'app/services';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from 'app/shared/components/confirm-dialog/confirm-dialog.component';

import {
  DataPointDataType,
  DataSinkProtocol,
  PreDefinedDataPoint
} from '../../../../models';
import {
  EditCustomOpcUaVariableModalComponent,
  EditCustomOpcUaVariableModalData
} from '../edit-custom-opc-ua-variable-modal/edit-custom-opc-ua-variable-modal.component';

@Component({
  selector: 'app-custom-opc-ua-variables',
  templateUrl: 'custom-opc-ua-variables.component.html'
})
export class CustomOpcUaVariablesComponent {
  DataPointDataType = DataPointDataType;

  @Input() rows: PreDefinedDataPoint[] = [];
  @Input() existingAddresses: string[];
  @Output() selected = new EventEmitter<PreDefinedDataPoint>();

  constructor(
    private dataSinkService: DataSinkService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  isExisting(address: string) {
    return this.existingAddresses.includes(address);
  }

  onAdd() {
    const newCustomDatapoint = {} as PreDefinedDataPoint;
    const predefinedOPCDataPoints =
      this.dataSinkService.getPredefinedOPCDataPoints();

    this.dialog
      .open<
        EditCustomOpcUaVariableModalComponent,
        EditCustomOpcUaVariableModalData,
        PreDefinedDataPoint
      >(EditCustomOpcUaVariableModalComponent, {
        data: {
          existingNames: [
            ...(this.rows || []).map((dp) => dp.name).filter(Boolean)
          ],
          existingAddresses: [
            ...(predefinedOPCDataPoints || [])
              .map((dp) => dp.address)
              .filter(Boolean),
            ...(this.rows || []).map((dp) => dp.address).filter(Boolean)
          ],
          customDatapoint: newCustomDatapoint
        } as EditCustomOpcUaVariableModalData
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.onAddConfirm(result);
      });
  }

  private onAddConfirm(obj: PreDefinedDataPoint) {
    this.dataSinkService.addCustomDatapoint(DataSinkProtocol.OPC, obj);
  }

  onEdit(obj: PreDefinedDataPoint) {
    const rowsWithoutObj = (this.rows || []).filter(
      (dp) => dp.address !== obj.address
    );

    this.dialog
      .open<
        EditCustomOpcUaVariableModalComponent,
        EditCustomOpcUaVariableModalData,
        PreDefinedDataPoint
      >(EditCustomOpcUaVariableModalComponent, {
        data: {
          existingNames: [...rowsWithoutObj.map((dp) => dp.name)],
          existingAddresses: [...rowsWithoutObj.map((dp) => dp.address)],
          customDatapoint: obj
        } as EditCustomOpcUaVariableModalData
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }
        const rowIndex = this.rows?.indexOf(obj) || 0;
        this.onEditConfirm(rowIndex, result);
      });
  }

  private onEditConfirm(replaceAt: number, obj: PreDefinedDataPoint) {
    this.dataSinkService.updateCustomDatapoint(
      replaceAt,
      DataSinkProtocol.OPC,
      obj
    );
  }

  onDelete(obj: PreDefinedDataPoint) {
    const title = this.translate.instant('settings-data-sink.Delete');
    const message = this.translate.instant(
      'settings-data-sink.OPCUACustomVariableDeleteMessage'
    );

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(title, message)
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (!dialogResult) {
        return;
      }
      this.dataSinkService.deleteCustomDatapoint(DataSinkProtocol.OPC, obj);
    });
  }

  onSelect(obj: PreDefinedDataPoint) {
    this.selected.emit(obj);
  }
}
