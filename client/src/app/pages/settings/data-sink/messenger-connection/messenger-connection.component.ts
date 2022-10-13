import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import {
  MessengerConnectionService,
  RegistrationStatus,
  ServerStatus,
  RegistrationErrorReasonStatus, MessengerConfiguration, MessengerStatus
} from 'app/services/messenger-connection.service';
import { RegisterMachineComponent } from '../register-machine/register-machine.component';
import { Subscription } from "rxjs";

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
  RegistrationErrorReasonStatus = RegistrationErrorReasonStatus;
  isFormSending = true;
  sub = new Subscription();
  messengerConfiguration: MessengerConfiguration;
  messengerStatus: MessengerStatus;

  get isBusy() {
    return this.messengerConnectionService.isBusy;
  }

  constructor(
    public dialogRef: MatDialogRef<MessengerConnectionComponent>,
    private dialog: MatDialog,
    private messengerConnectionService: MessengerConnectionService
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.messengerConnectionService.config.subscribe(
        (v) => (this.messengerConfiguration = v)
      )
    );
    this.sub.add(
      this.messengerConnectionService.status.subscribe(
        (v) => (this.messengerStatus = v)
      )
    );
    this.profileForm.patchValue({
      hostname: this.messengerConfiguration.hostname,
      username: this.messengerConfiguration.username,
      password: this.messengerConfiguration.password
    });
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }

  onSubmit() {
    this.messengerConnectionService
      .updateNetworkConfig(this.profileForm.value)
      .then(() => this.messengerConnectionService.getMessengerStatus())
      .then(() => this.messengerConnectionService.getMessengerMetadata())
      .then(() => {
        if (
          this.messengerStatus.server === ServerStatus.Available &&
          this.messengerStatus.registration === RegistrationStatus.Registered
        ) {
          this.dialog.open(RegisterMachineComponent, {
            width: '900px',
            data: {
              configuration: this.messengerConfiguration
            }
          });
          this.close();
        }
      });
  }

  close() {
    this.isFormSending = false;
    this.dialogRef.close();
  }
}
