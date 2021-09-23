/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { Mapping } from '../models/mapping';
import { Map } from '../models/map';
import { Uuid } from '../models/uuid';

/**
 * Everything about the mappings.
 */
@Injectable({
  providedIn: 'root',
})
class MappingsService extends __BaseService {
  static readonly mappingsGetPath = '/mappings';
  static readonly mapPostPath = '/mappings';
  static readonly getMappingsMapIdPath = '/mappings/{mapId}';
  static readonly mapDeletePath = '/mappings/{mapId}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @return List of all available mappings
   */
  mappingsGetResponse(): __Observable<__StrictHttpResponse<Mapping>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/mappings`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Mapping>;
      })
    );
  }
  /**
   * @return List of all available mappings
   */
  mappingsGet(): __Observable<Mapping> {
    return this.mappingsGetResponse().pipe(
      __map(_r => _r.body as Mapping)
    );
  }

  /**
   * @param newMapping new mapping object
   * @return Successfully created new mapping
   */
  mapPostResponse(newMapping: Map): __Observable<__StrictHttpResponse<Map & Uuid>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = newMapping;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/mappings`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Map & Uuid>;
      })
    );
  }
  /**
   * @param newMapping new mapping object
   * @return Successfully created new mapping
   */
  mapPost(newMapping: Map): __Observable<Map & Uuid> {
    return this.mapPostResponse(newMapping).pipe(
      __map(_r => _r.body as Map & Uuid)
    );
  }

  /**
   * Return a single mapping object
   * @param mapId parameter for selection of the map
   * @return The requested mapping object
   */
  getMappingsMapIdResponse(mapId: string): __Observable<__StrictHttpResponse<Map & Uuid>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/mappings/${encodeURIComponent(String(mapId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Map & Uuid>;
      })
    );
  }
  /**
   * Return a single mapping object
   * @param mapId parameter for selection of the map
   * @return The requested mapping object
   */
  getMappingsMapId(mapId: string): __Observable<Map & Uuid> {
    return this.getMappingsMapIdResponse(mapId).pipe(
      __map(_r => _r.body as Map & Uuid)
    );
  }

  /**
   * Delete the selected map
   * @param mapId parameter for selection of the map
   * @return Successfully delete mapping
   */
  mapDeleteResponse(mapId: string): __Observable<__StrictHttpResponse<{deleted?: Map & Uuid}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/mappings/${encodeURIComponent(String(mapId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{deleted?: Map & Uuid}>;
      })
    );
  }
  /**
   * Delete the selected map
   * @param mapId parameter for selection of the map
   * @return Successfully delete mapping
   */
  mapDelete(mapId: string): __Observable<{deleted?: Map & Uuid}> {
    return this.mapDeleteResponse(mapId).pipe(
      __map(_r => _r.body as {deleted?: Map & Uuid})
    );
  }
}

module MappingsService {
}

export { MappingsService }
