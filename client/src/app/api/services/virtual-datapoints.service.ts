/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { VirtualDataPointType } from '../models/virtual-data-point-type';
import { Uuid } from '../models/uuid';

/**
 * Everything about the data points
 */
@Injectable({
  providedIn: 'root',
})
class VirtualDatapointsService extends __BaseService {
  static readonly vdpsGetPath = '/vdps';
  static readonly vdpsPostPath = '/vdps';
  static readonly vdpGetPath = '/vdps/{id}';
  static readonly vdpDeletePath = '/vdps/{id}';
  static readonly vdpPatchPath = '/vdps/{id}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Return a list of virtual datapoints
   * @return List of virtual datapoints.
   */
  vdpsGetResponse(): __Observable<__StrictHttpResponse<{vdps?: Array<VirtualDataPointType & Uuid>}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/vdps`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{vdps?: Array<VirtualDataPointType & Uuid>}>;
      })
    );
  }
  /**
   * Return a list of virtual datapoints
   * @return List of virtual datapoints.
   */
  vdpsGet(): __Observable<{vdps?: Array<VirtualDataPointType & Uuid>}> {
    return this.vdpsGetResponse().pipe(
      __map(_r => _r.body as {vdps?: Array<VirtualDataPointType & Uuid>})
    );
  }

  /**
   * Add a virtual datapoint to the runtime
   * @param newVDP New virtual datapoint
   * @return Successfully create a virtual datapoint resource
   */
  vdpsPostResponse(newVDP: VirtualDataPointType): __Observable<__StrictHttpResponse<{created: VirtualDataPointType & Uuid, href: string}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = newVDP;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/vdps`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{created: VirtualDataPointType & Uuid, href: string}>;
      })
    );
  }
  /**
   * Add a virtual datapoint to the runtime
   * @param newVDP New virtual datapoint
   * @return Successfully create a virtual datapoint resource
   */
  vdpsPost(newVDP: VirtualDataPointType): __Observable<{created: VirtualDataPointType & Uuid, href: string}> {
    return this.vdpsPostResponse(newVDP).pipe(
      __map(_r => _r.body as {created: VirtualDataPointType & Uuid, href: string})
    );
  }

  /**
   * @param id Id of the virtual datapoint to operate on
   * @return Returns a virtual datapoint
   */
  vdpGetResponse(id: string): __Observable<__StrictHttpResponse<VirtualDataPointType & Uuid>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/vdps/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<VirtualDataPointType & Uuid>;
      })
    );
  }
  /**
   * @param id Id of the virtual datapoint to operate on
   * @return Returns a virtual datapoint
   */
  vdpGet(id: string): __Observable<VirtualDataPointType & Uuid> {
    return this.vdpGetResponse(id).pipe(
      __map(_r => _r.body as VirtualDataPointType & Uuid)
    );
  }

  /**
   * @param id Id of the virtual datapoint to operate on
   * @return Delete virtual datapoint with given id.
   */
  vdpDeleteResponse(id: string): __Observable<__StrictHttpResponse<{deleted?: VirtualDataPointType & Uuid}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/vdps/${encodeURIComponent(String(id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{deleted?: VirtualDataPointType & Uuid}>;
      })
    );
  }
  /**
   * @param id Id of the virtual datapoint to operate on
   * @return Delete virtual datapoint with given id.
   */
  vdpDelete(id: string): __Observable<{deleted?: VirtualDataPointType & Uuid}> {
    return this.vdpDeleteResponse(id).pipe(
      __map(_r => _r.body as {deleted?: VirtualDataPointType & Uuid})
    );
  }

  /**
   * @param params The `VirtualDatapointsService.VdpPatchParams` containing the following parameters:
   *
   * - `patched virtual datapoint`:
   *
   * - `id`: Id of the virtual datapoint to operate on
   *
   * @return Changed virtual dataPoint
   */
  vdpPatchResponse(params: VirtualDatapointsService.VdpPatchParams): __Observable<__StrictHttpResponse<{changed?: VirtualDataPointType & Uuid, href?: string}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = params.patchedVirtualDatapoint;

    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/vdps/${encodeURIComponent(String(params.id))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{changed?: VirtualDataPointType & Uuid, href?: string}>;
      })
    );
  }
  /**
   * @param params The `VirtualDatapointsService.VdpPatchParams` containing the following parameters:
   *
   * - `patched virtual datapoint`:
   *
   * - `id`: Id of the virtual datapoint to operate on
   *
   * @return Changed virtual dataPoint
   */
  vdpPatch(params: VirtualDatapointsService.VdpPatchParams): __Observable<{changed?: VirtualDataPointType & Uuid, href?: string}> {
    return this.vdpPatchResponse(params).pipe(
      __map(_r => _r.body as {changed?: VirtualDataPointType & Uuid, href?: string})
    );
  }
}

module VirtualDatapointsService {

  /**
   * Parameters for vdpPatch
   */
  export interface VdpPatchParams {
    patchedVirtualDatapoint: VirtualDataPointType;

    /**
     * Id of the virtual datapoint to operate on
     */
    id: string;
  }
}

export { VirtualDatapointsService }
