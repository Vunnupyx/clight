import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessengerConnectionService, MessengerMetadata, MessengerStore } from 'app/services/messenger-connection.service';
import { Subscription } from "rxjs";
import { MessengerConnectionComponent } from '../messenger-connection/messenger-connection.component';

@Component({
  selector: 'app-register-machine',
  templateUrl: './register-machine.component.html',
  styleUrls: ['./register-machine.component.scss']
})
export class RegisterMachineComponent implements OnInit {
  profileForm = new FormGroup({
    model: new FormControl(0, Validators.required),
    name: new FormControl('', Validators.required),
    organization: new FormControl('', Validators.required),
    timezone: new FormControl(0, Validators.required)
  });
  isFormSending = true;
  timezoneOptionKeyphrase = '';
  organizationOptionKeyphrase = '';
  modelOptionKeyphrase = '';
  messengerMetadata: MessengerMetadata;
  sub = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Partial<MessengerStore>,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<RegisterMachineComponent>,
    private messengerConnectionService: MessengerConnectionService
  ) {}

  get optionsSearchResults() {
    return (items: any[], searchKeyphrase: string) => {
      if (!items || !searchKeyphrase) {
        return items;
      }
      return items.filter((x) =>
        x.name
          .toLocaleLowerCase()
          .includes(searchKeyphrase.toLocaleLowerCase())
      );
    }

  }

  get isBusy() {
    return this.messengerConnectionService.isBusy;
  }

  ngOnInit(): void {
    this.sub.add(
      this.messengerConnectionService.metadata.subscribe(
        (v) => (this.messengerMetadata = v)
      )
    );
    this.profileForm.patchValue({
      model: this.data.configuration.model,
      name: this.data.configuration.name,
      organization: this.data.configuration.organization,
      timezone: this.data.configuration.timezone
    });
  }

  save() {
    this.messengerConnectionService.updateNetworkConfig({...this.data.configuration, ...this.profileForm.value, ...{password: null}}).then(() => {
      this.close()
    });
  }

  close() {
    this.messengerConnectionService
      .getMessengerStatus()
      .then(() => this.messengerConnectionService.getMessengerConfig())
      .then(() => {
        this.dialog.open(MessengerConnectionComponent, {
          width: '900px'
        });
      });
    this.isFormSending = false;
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }
}
