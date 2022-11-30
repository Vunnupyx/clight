import { NgModule } from '@angular/core';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { AuthService } from './auth.service';
import { HttpMockupService } from './http-mockup.service';
import { HttpService } from './http.service';
import { LocalStorageService } from './local-storage.service';
import { PromptService } from './prompt.service';
import { ConfigurationAgentHttpService } from './configuration-agent-http.service';
import { ConfigurationAgentHttpMockupService } from './configuration-agent-http-mockup.service';

@NgModule({
  imports: [NgxWebstorageModule.forRoot({ prefix: 'mdcl', separator: '.' })],
  providers: [
    AuthService,
    HttpMockupService,
    HttpService,
    LocalStorageService,
    PromptService,
    ConfigurationAgentHttpService,
    ConfigurationAgentHttpMockupService
  ]
})
export class SharedServicesModule {}
