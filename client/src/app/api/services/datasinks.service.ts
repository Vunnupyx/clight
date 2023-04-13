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

import { DataSinkType } from '../models/data-sink-type';
import { DataPointList } from '../models/data-point-list';
import { DataPointType } from '../models/data-point-type';
import { Uuid } from '../models/uuid';

/**
 * Everything about the data sinks
 */
@Injectable({
  providedIn: 'root'
})
class DatasinksService extends __BaseService {
  static readonly dataSinksGetPath = '/datasinks';
  static readonly dataSinkGetPath = '/datasinks/{datasinkProtocol}';
  static readonly dataPointsGetPath =
    '/datasinks/{datasinkProtocol}/dataPoints';
  static readonly dataPointsPostPath =
    '/datasinks/{datasinkProtocol}/dataPoints';
  static readonly dataPointGetPath =
    '/datasinks/{datasinkProtocol}/dataPoints/{dataPointId}';
  static readonly dataPointPatchPath =
    '/datasinks/{datasinkProtocol}/dataPoints/{dataPointId}';
  static readonly dataPointDeletePath =
    '/datasinks/{datasinkProtocol}/dataPoints/{dataPointId}';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Returns all available datesinks of the runtime
   * @return Successful request to datasinks
   */
  dataSinksGetResponse(): __Observable<
    __StrictHttpResponse<{ dataSinks?: Array<DataSinkType> }>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `/datasinks`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json'
    });

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{ dataSinks?: Array<DataSinkType> }>;
      })
    );
  }
  /**
   * Returns all available datesinks of the runtime
   * @return Successful request to datasinks
   */
  dataSinksGet(): __Observable<{ dataSinks?: Array<DataSinkType> }> {
    return this.dataSinksGetResponse().pipe(
      __map((_r) => _r.body as { dataSinks?: Array<DataSinkType> })
    );
  }

  /**
   * Get datasink object by id
   * @param datasinkProtocol undefined
   * @return Datasink object
   */
  dataSinkGetResponse(
    datasinkProtocol: string
  ): __Observable<__StrictHttpResponse<DataSinkType>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/datasinks/${encodeURIComponent(String(datasinkProtocol))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DataSinkType>;
      })
    );
  }
  /**
   * Get datasink object by id
   * @param datasinkProtocol undefined
   * @return Datasink object
   */
  dataSinkGet(datasinkProtocol: string): __Observable<DataSinkType> {
    return this.dataSinkGetResponse(datasinkProtocol).pipe(
      __map((_r) => _r.body as DataSinkType)
    );
  }

  /**
   * @param datasinkProtocol undefined
   * @return Return list of dataPoints
   */
  dataPointsGetResponse(
    datasinkProtocol: string
  ): __Observable<__StrictHttpResponse<DataPointList>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/datasinks/${encodeURIComponent(String(datasinkProtocol))}/dataPoints`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DataPointList>;
      })
    );
  }
  /**
   * @param datasinkProtocol undefined
   * @return Return list of dataPoints
   */
  dataPointsGet(datasinkProtocol: string): __Observable<DataPointList> {
    return this.dataPointsGetResponse(datasinkProtocol).pipe(
      __map((_r) => _r.body as DataPointList)
    );
  }

  /**
   * @param params The `DatasinksService.DataPointsPostParams` containing the following parameters:
   *
   * - `datasinkProtocol`:
   *
   * - `dataPoint`: New Datapoint object
   *
   * @return Response of a new created dataPoint
   */
  dataPointsPostResponse(
    params: DatasinksService.DataPointsPostParams
  ): __Observable<
    __StrictHttpResponse<{ created?: DataPointType & Uuid; href?: string }>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __body = params.dataPoint;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl +
        `/datasinks/${encodeURIComponent(
          String(params.datasinkProtocol)
        )}/dataPoints`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{
          created?: DataPointType & Uuid;
          href?: string;
        }>;
      })
    );
  }
  /**
   * @param params The `DatasinksService.DataPointsPostParams` containing the following parameters:
   *
   * - `datasinkProtocol`:
   *
   * - `dataPoint`: New Datapoint object
   *
   * @return Response of a new created dataPoint
   */
  dataPointsPost(
    params: DatasinksService.DataPointsPostParams
  ): __Observable<{ created?: DataPointType & Uuid; href?: string }> {
    return this.dataPointsPostResponse(params).pipe(
      __map(
        (_r) => _r.body as { created?: DataPointType & Uuid; href?: string }
      )
    );
  }

  /**
   * @param params The `DatasinksService.DataPointGetParams` containing the following parameters:
   *
   * - `datasinkProtocol`: id of the datapoint to get
   *
   * - `dataPointId`: id of the datapoint to get
   */
  dataPointGetResponse(
    params: DatasinksService.DataPointGetParams
  ): __Observable<__StrictHttpResponse<DataPointType & Uuid>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/datasinks/${encodeURIComponent(
          String(params.datasinkProtocol)
        )}/dataPoints/${encodeURIComponent(String(params.dataPointId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DataPointType & Uuid>;
      })
    );
  }
  /**
   * @param params The `DatasinksService.DataPointGetParams` containing the following parameters:
   *
   * - `datasinkProtocol`: id of the datapoint to get
   *
   * - `dataPointId`: id of the datapoint to get
   */
  dataPointGet(
    params: DatasinksService.DataPointGetParams
  ): __Observable<DataPointType & Uuid> {
    return this.dataPointGetResponse(params).pipe(
      __map((_r) => _r.body as DataPointType & Uuid)
    );
  }

  /**
   * @param params The `DatasinksService.DataPointPatchParams` containing the following parameters:
   *
   * - `patchData`: DataPoint object with changed properties
   *
   * - `datasinkProtocol`: id of the datapoint to get
   *
   * - `dataPointId`: id of the datapoint to get
   *
   * @return Response of a change request for a datapoint with given id
   */
  dataPointPatchResponse(
    params: DatasinksService.DataPointPatchParams
  ): __Observable<__StrictHttpResponse<DataPointType & Uuid>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = params.patchData;

    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl +
        `/datasinks/${encodeURIComponent(
          String(params.datasinkProtocol)
        )}/dataPoints/${encodeURIComponent(String(params.dataPointId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DataPointType & Uuid>;
      })
    );
  }
  /**
   * @param params The `DatasinksService.DataPointPatchParams` containing the following parameters:
   *
   * - `patchData`: DataPoint object with changed properties
   *
   * - `datasinkProtocol`: id of the datapoint to get
   *
   * - `dataPointId`: id of the datapoint to get
   *
   * @return Response of a change request for a datapoint with given id
   */
  dataPointPatch(
    params: DatasinksService.DataPointPatchParams
  ): __Observable<DataPointType & Uuid> {
    return this.dataPointPatchResponse(params).pipe(
      __map((_r) => _r.body as DataPointType & Uuid)
    );
  }

  /**
   * @param params The `DatasinksService.DataPointDeleteParams` containing the following parameters:
   *
   * - `datasinkProtocol`: id of the datapoint to get
   *
   * - `dataPointId`: id of the datapoint to get
   *
   * @return Delete a datapoint by id and return the deleted item.
   */
  dataPointDeleteResponse(
    params: DatasinksService.DataPointDeleteParams
  ): __Observable<__StrictHttpResponse<{ deleted?: DataPointType & Uuid }>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl +
        `/datasinks/${encodeURIComponent(
          String(params.datasinkProtocol)
        )}/dataPoints/${encodeURIComponent(String(params.dataPointId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      }
    );

    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{ deleted?: DataPointType & Uuid }>;
      })
    );
  }
  /**
   * @param params The `DatasinksService.DataPointDeleteParams` containing the following parameters:
   *
   * - `datasinkProtocol`: id of the datapoint to get
   *
   * - `dataPointId`: id of the datapoint to get
   *
   * @return Delete a datapoint by id and return the deleted item.
   */
  dataPointDelete(
    params: DatasinksService.DataPointDeleteParams
  ): __Observable<{ deleted?: DataPointType & Uuid }> {
    return this.dataPointDeleteResponse(params).pipe(
      __map((_r) => _r.body as { deleted?: DataPointType & Uuid })
    );
  }
}

module DatasinksService {
  /**
   * Parameters for dataPointsPost
   */
  export interface DataPointsPostParams {
    datasinkProtocol: string;

    /**
     * New Datapoint object
     */
    dataPoint?: DataPointType;
  }

  /**
   * Parameters for dataPointGet
   */
  export interface DataPointGetParams {
    /**
     * id of the datapoint to get
     */
    datasinkProtocol: string;

    /**
     * id of the datapoint to get
     */
    dataPointId: string;
  }

  /**
   * Parameters for dataPointPatch
   */
  export interface DataPointPatchParams {
    /**
     * DataPoint object with changed properties
     */
    patchData: DataPointType;

    /**
     * id of the datapoint to get
     */
    datasinkProtocol: string;

    /**
     * id of the datapoint to get
     */
    dataPointId: string;
  }

  /**
   * Parameters for dataPointDelete
   */
  export interface DataPointDeleteParams {
    /**
     * id of the datapoint to get
     */
    datasinkProtocol: string;

    /**
     * id of the datapoint to get
     */
    dataPointId: string;
  }
}

export { DatasinksService };
