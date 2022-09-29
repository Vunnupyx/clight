import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { NetworkService } from 'app/services';
import { MessengerConnectionService } from 'app/services/messenger-connection.service';
import * as moment from 'moment';

@Component({
  selector: 'app-register-machine',
  templateUrl: './register-machine.component.html',
  styleUrls: ['./register-machine.component.scss']
})
export class RegisterMachineComponent implements OnInit {
  profileForm = new FormGroup({
    model: new FormControl(''),
    name: new FormControl(''),
    organization: new FormControl(''),
    timezone: new FormControl('')
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

  timezoneOptions!: string[];
  timezoneOptionKeyphrase = '';

  constructor(private networkService: NetworkService, private messengerConnectionService:MessengerConnectionService) {}

  ngOnInit(): void {
    this.timezoneOptions = this._getTimezoneOptions();
    this.messengerConnectionService.config.subscribe(v=>{
      this.profileForm.patchValue({
        model:v.configuration.model,
        name:v.configuration.name,
        organization:v.configuration.organization,
        timezone:this.timezoneOptions[v.configuration.timezone]
      })
    })
    console.log(this._getTimezoneOptions())
  }

  save(){
    const obj ={
      model:this.profileForm.value.model,
      name:this.profileForm.value.name,
      organization:this.profileForm.value.organization,
      timezone:this.timezoneOptions.indexOf(this.profileForm.value.timezone)
    }
    this.messengerConnectionService.updateNetworkConfig(obj)
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
}
