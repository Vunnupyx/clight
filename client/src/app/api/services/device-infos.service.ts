/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { DeviceInfos } from '../models/device-infos';

/**
 * Everything about the deviceInfos.
 */
@Injectable({
  providedIn: 'root',
})
class DeviceInfosService extends __BaseService {
  static readonly deviceInfosGetPath = '/deviceInfos';
  static readonly deviceInfosPatchPath = '/deviceInfos';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Get device information
   * @return Returns all information about the connected device
   */
  deviceInfosGetResponse(): __Observable<__StrictHttpResponse<DeviceInfos>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/deviceInfos`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DeviceInfos>;
      })
    );
  }
  /**
   * Get device information
   * @return Returns all information about the connected device
   */
  deviceInfosGet(): __Observable<DeviceInfos> {
    return this.deviceInfosGetResponse().pipe(
      __map(_r => _r.body as DeviceInfos)
    );
  }

  /**
   * @param patchObject The changed properties
   */
  deviceInfosPatchResponse(patchObject?: DeviceInfos): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = patchObject;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/deviceInfos`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param patchObject The changed properties
   */
  deviceInfosPatch(patchObject?: DeviceInfos): __Observable<null> {
    return this.deviceInfosPatchResponse(patchObject).pipe(
      __map(_r => _r.body as null)
    );
  }
}

module DeviceInfosService {
}

export { DeviceInfosService }
