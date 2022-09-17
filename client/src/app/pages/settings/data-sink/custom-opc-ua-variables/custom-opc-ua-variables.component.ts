import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DataSinkService } from 'app/services';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'app/shared/components/confirm-dialog/confirm-dialog.component';

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

    this.dialog
      .open<
        EditCustomOpcUaVariableModalComponent,
        EditCustomOpcUaVariableModalData,
        EditCustomOpcUaVariableModalData
      >(EditCustomOpcUaVariableModalComponent, {
        data: {
          customDatapoint: newCustomDatapoint
        }
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.onAddConfirm(result.customDatapoint);
      });
  }

  private onAddConfirm(obj: PreDefinedDataPoint) {
    this.dataSinkService.addCustomDatapoint(DataSinkProtocol.OPC, obj);
  }

  onEdit(obj: PreDefinedDataPoint) {
    this.dialog
      .open<
        EditCustomOpcUaVariableModalComponent,
        EditCustomOpcUaVariableModalData,
        EditCustomOpcUaVariableModalData
      >(EditCustomOpcUaVariableModalComponent, {
        data: {
          isEditing: true,
          customDatapoint: obj
        }
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.onEditConfirm(result.customDatapoint);
      });
  }

  private onEditConfirm(obj: PreDefinedDataPoint) {
    console.log('!!! onEditConfirm', obj)
    this.dataSinkService.updateCustomDatapoint(DataSinkProtocol.OPC, obj);
  }

  onDelete(obj: PreDefinedDataPoint) {
    const title = this.translate.instant('settings-data-sink.Delete');
    const message = this.translate.instant('settings-data-sink.DeleteMessage');

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
