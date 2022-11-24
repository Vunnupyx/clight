import { HttpService } from './http.service';
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class ConfigurationAgentHttpService extends HttpService {
  protected _getUrl(url: string): string {
    return `${environment.configurationAgentApiRoot}${url}`;
  }
}
