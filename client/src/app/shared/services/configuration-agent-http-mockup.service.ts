import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpMockupService } from './http-mockup.service';

@Injectable()
export class ConfigurationAgentHttpMockupService extends HttpMockupService {
  protected _getUrl(url: string): string {
    return `${environment.configurationAgentApiRoot}${url}`;
  }
}
