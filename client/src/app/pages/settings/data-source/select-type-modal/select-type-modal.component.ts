import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DataSourceProtocol } from '../../../../models';

export interface SelectTypeModalData {
  selection: string;
  protocol: DataSourceProtocol;
}

@Component({
  selector: 'app-select-type-modal',
  templateUrl: 'select-type-modal.component.html'
})
export class SelectTypeModalComponent {
  DataSourceProtocol = DataSourceProtocol;

  rows =
    this.data.protocol === DataSourceProtocol.IOShield
      ? [
          { area: 'B[.]', component: 'S', variable: 'ncAutoCounter[.]' },
          { area: 'B[.]', component: 'S', variable: 'ncAutoCounter[.]' },
          { area: 'B[.]', component: 'S', variable: 'ncAutoCounter[.]' },
          { area: 'B[.]', component: 'S', variable: 'ncAutoCounter[.]' }
        ]
      : [
          { name: 'progName', address: '/Channel/ProgramPointer/progName' },
          { name: 'feedRateOvr', address: '/Nck/MachineAxis/feedRateOvr' },
          { name: 'actProgNetTime', address: '/Channel/State/actProgNetTime' },
          { name: 'OpMode', address: '/Bag/State/OpMode' },
          {
            name: 'singleBlockActive',
            address: '/Channel/ProgramModification/singleBlockActive'
          },
          {
            name: 'selectedWorkPProg',
            address: '/Channel/Programinfo/selectedWorkPProg'
          },
          { name: 'feedRateIpoOvr', address: 'Channel/State/feedRateIpoOvr' },
          {
            name: 'numSpindles',
            address: '/Channel/Configuration/numSpindles'
          },
          { name: 'SpindleType', address: '/Channel/Spindle/SpindleType' },
          { name: 'speedOvr', address: '/Channel/Spindle/speedOvr' },
          { name: 'rapFeedRateOvr', address: '/Channel/State/rapFeedRateOvr' },
          { name: 'totalParts', address: '/Channel/State/totalParts' },
          { name: 'reqParts', address: '/Channel/State/reqParts' },
          { name: 'actParts', address: '/Channel/State/actParts' },
          { name: 'actTNumber', address: '/Channel/State/actTNumber' },
          { name: 'numAlarms', address: '/Nck/State/numAlarms' }
        ];

  constructor(
    private dialogRef: MatDialogRef<SelectTypeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectTypeModalData
  ) {}

  onSelect({ selected }) {
    this.dialogRef.close(selected[0]);
  }

  onClose() {
    this.dialogRef.close();
  }
}
