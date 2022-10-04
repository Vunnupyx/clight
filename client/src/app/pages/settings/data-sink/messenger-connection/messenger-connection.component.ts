import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {
  MessengerConnectionService,
  MessengerStore,
  RegistrationStatus,
  ServerStatus
} from 'app/services/messenger-connection.service';
import { RegisterMachineComponent } from '../register-machine/register-machine.component';

@Component({
  selector: 'app-messenger-connection',
  templateUrl: './messenger-connection.component.html',
  styleUrls: ['./messenger-connection.component.scss']
})
export class MessengerConnectionComponent implements OnInit {
  profileForm = new FormGroup({
    hostname: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  ServerStatus = ServerStatus;
  RegistrationStatus = RegistrationStatus;
  isFormSending = true;

  get isBusy() {
    return this.messengerConnectionService.queryStatus;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Partial<MessengerStore>,
    public dialogRef: MatDialogRef<MessengerConnectionComponent>,
    private dialog: MatDialog,
    private messengerConnectionService: MessengerConnectionService
  ) {}

  ngOnInit(): void {
    this.profileForm.patchValue({
      hostname: this.data.configuration.hostname,
      username: this.data.configuration.username,
      password: this.getPassword(this.data.configuration.password)
    });
  }

  onSubmit() {
    this.messengerConnectionService
      .updateNetworkConfig(this.profileForm.value)
      .then(() => {
        if (this.data.status.server === ServerStatus.Available) {
          this.messengerConnectionService.getMessengerConfig().then(() => {
            if (
              this.data.status.server === ServerStatus.Available &&
              this.data.status.registration === RegistrationStatus.Registered
            ) {
              this.dialog.open(RegisterMachineComponent, {
                width: '900px',
                data: this.data
              });
              this.close();
            }
          });
        }
      });
  }

  close() {
    this.isFormSending = false;
    this.dialogRef.close();
  }

  getPassword(v: boolean | string) {
    if (v) return '00000000';
    return '';
  }
}
