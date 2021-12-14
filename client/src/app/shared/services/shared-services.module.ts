import { NgModule } from '@angular/core';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { AuthService } from './auth.service';
import { HttpMockupService } from './http-mockup.service';
import { HttpService } from './http.service';
import { LocalStorageService } from './local-storage.service';
import { PromptService } from './prompt.service';

@NgModule({
  imports: [NgxWebstorageModule.forRoot({ prefix: 'mdcl', separator: '.' })],
  providers: [
    AuthService,
    HttpMockupService,
    HttpService,
    LocalStorageService,
    PromptService
  ]
})
export class SharedServicesModule {}
