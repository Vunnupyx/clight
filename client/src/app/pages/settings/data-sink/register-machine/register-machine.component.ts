import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MessengerConnectionService,
  MessengerStore
} from 'app/services/messenger-connection.service';
import * as moment from 'moment';

@Component({
  selector: 'app-register-machine',
  templateUrl: './register-machine.component.html',
  styleUrls: ['./register-machine.component.scss']
})
export class RegisterMachineComponent implements OnInit {
  profileForm = new FormGroup({
    model: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    organization: new FormControl('', Validators.required),
    timezone: new FormControl('', Validators.required)
  });

  get timezoneOptionsSearchResults() {
    if (!this.timezoneOptions || !this.timezoneOptionKeyphrase) {
      return this.timezoneOptions;
    }
    return this.timezoneOptions.filter((x) =>
      x
        .toLocaleLowerCase()
        .includes(this.timezoneOptionKeyphrase.toLocaleLowerCase())
    );
  }

  get isBusy() {
    return this.messengerConnectionService.isBusy;
  }

  isFormSending = true;
  timezoneOptions!: string[];
  timezoneOptionKeyphrase = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Partial<MessengerStore>,
    public dialogRef: MatDialogRef<RegisterMachineComponent>,
    private messengerConnectionService: MessengerConnectionService
  ) {}

  ngOnInit(): void {
    this.timezoneOptions = this._getTimezoneOptions();
    this.profileForm.patchValue({
      model: this.data.configuration.model,
      name: this.data.configuration.name,
      organization: this.data.configuration.organization,
      timezone: this.timezoneOptions[this.data.configuration.timezone]
    });
  }

  save() {
    const obj = {
      model: this.profileForm.value.model,
      name: this.profileForm.value.name,
      organization: this.profileForm.value.organization,
      timezone: this.timezoneOptions.indexOf(this.profileForm.value.timezone)
    };
    this.messengerConnectionService.updateNetworkConfig(obj);
    this.close();
  }

  private _getTimezoneOptions() {
    return moment.tz
      .names()
      .filter((name) =>
        [
          'Universal',
          'Africa/',
          'America/',
          'Antarctica/',
          'Arctic/',
          'Asia/',
          'Australia/',
          'Europe/',
          'Indian/',
          'Pacific/'
        ].find((x) => name.startsWith(x))
      );
  }

  close() {
    this.isFormSending = false;
    this.dialogRef.close();
  }
}
