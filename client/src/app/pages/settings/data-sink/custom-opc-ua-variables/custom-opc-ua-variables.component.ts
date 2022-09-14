import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataSinkService } from 'app/services';

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
    private dialog: MatDialog
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

  onAddConfirm(obj: PreDefinedDataPoint) {
    this.rows = (this.rows || []).concat([obj]);
    this.dataSinkService.addCustomDatapoint(DataSinkProtocol.OPC, obj);
  }

  onSelect(obj: PreDefinedDataPoint) {
    this.selected.emit(obj);
  }
}
