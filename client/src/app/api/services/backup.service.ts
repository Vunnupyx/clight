/* tslint:disable */
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpResponse,
  HttpHeaders
} from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { ConfigFile } from '../models/config-file';

/**
 * Everything about the backup and restore
 */
@Injectable({
  providedIn: 'root'
})
class BackupService extends __BaseService {
  static readonly backupGetPath = '/backup';
  static readonly backupPostPath = '/backup';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * @return Config file as JSON.
   */
  backupGetResponse(): __Observable<__StrictHttpResponse<Blob>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/backup`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'blob'
    });

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Blob>;
      })
    );
  }
  /**
   * @return Config file as JSON.
   */
  backupGet(): __Observable<Blob> {
    return this.backupGetResponse().pipe(__map((_r) => _r.body as Blob));
  }

  /**
   * @param config New config file to use.
   * @return Config file uploaded to the system.
   */
  backupPostResponse(
    config: Blob
  ): __Observable<__StrictHttpResponse<ConfigFile>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let __formData = new FormData();
    __body = __formData;
    if (config != null) {
      __formData.append('config', config as string | Blob);
    }
    let req = new HttpRequest<any>('POST', this.rootUrl + `/backup`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ConfigFile>;
      })
    );
  }
  /**
   * @param config New config file to use.
   * @return Config file uploaded to the system.
   */
  backupPost(config: Blob): __Observable<ConfigFile> {
    return this.backupPostResponse(config).pipe(
      __map((_r) => _r.body as ConfigFile)
    );
  }
}

module BackupService {}

export { BackupService };
