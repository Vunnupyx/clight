import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessengerConnectionService, MessengerStore } from 'app/services/messenger-connection.service';
import { Observable } from 'rxjs';
import { RegisterMachineComponent } from '../register-machine/register-machine.component';

export type ServerStatus =
  | 'notconfigured'
  | 'invalidhost'
  | 'invalidauth'
  | 'available';
export type RegistrationStatus = 'notregistered' | 'registered' | 'unknown';
export interface MessengerConfiguration {
  hostname: string | null;
  username: string | null;
  password: boolean;
  model: string | null;
  name: string | null;
  organization: string | null;
  timezone: number | null;
}
export interface MessengerStatus {
  server: ServerStatus;
  registration: RegistrationStatus;
}

@Component({
  selector: 'app-dmg-mori-messenger',
  templateUrl: './dmg-mori-messenger.component.html',
  styleUrls: ['./dmg-mori-messenger.component.scss']
})
export class DMGMoriMessengerComponent implements OnInit {
  profileForm = new FormGroup({
    hostName: new FormControl(''),
    userName: new FormControl(''),
    password: new FormControl(''),
  });
  response:Observable<MessengerStore>;
  serverStatus: ServerStatus = 'available';
  registrationStatus: RegistrationStatus = 'registered';
  name = new FormControl('');
  constructor(private dialog: MatDialog, private messengerConnectionService:MessengerConnectionService) {}

  ngOnInit(): void {
    this.messengerConnectionService.getMessengerConfig().then(v=>console.log(v))
    this.messengerConnectionService.getMessengerStatus().then(v=>console.log(v))
    this.messengerConnectionService.config.subscribe(v=>{
      this.serverStatus = v.status.server;
      this.registrationStatus = v.status.registration;
      const password = this.isTrue(v.configuration.password)
      this.profileForm.patchValue({
        hostName:v.configuration.hostname,
        userName:v.configuration.username,
        password:password,
      })
    })
  }

  register(){
    this.messengerConnectionService.updateNetworkConfig(this.profileForm.value)
    this.messengerConnectionService.getMessengerStatus().then(()=>{
      if(this.serverStatus ==='available'){
        this.messengerConnectionService.getMessengerStatus().then(()=>{
          if(this.registrationStatus === 'registered'){
            this.dialog.open(RegisterMachineComponent,{width: '900px'});
          }
        })
      }
    })
  }

  isTrue(v:boolean){
    if (v)return '00000000'
    return ''
  }
}
