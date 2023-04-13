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

import { DataSourceList } from '../models/data-source-list';
import { DataSourceType } from '../models/data-source-type';
import { ChangeDatasource } from '../models/change-datasource';
import { Sourcedatapoint } from '../models/sourcedatapoint';
import { Uuid } from '../models/uuid';

/**
 * Everything about the data source
 */
@Injectable({
  providedIn: 'root'
})
class DatasourceService extends __BaseService {
  static readonly dataSourcesGetPath = '/datasources';
  static readonly dataSourceGetPath = '/datasources/{datasourceProtocol}';
  static readonly dataSourcePatchPath = '/datasources/{datasourceProtocol}';
  static readonly dataSourcesGetDatapointsPath =
    '/datasources/{datasourceProtocol}/dataPoints';
  static readonly dataSourcesPostDatapointPath =
    '/datasources/{datasourceProtocol}/dataPoints';
  static readonly dataSourcesGetDatapointPath =
    '/datasources/{datasourceProtocol}/dataPoints/{datapointId}';
  static readonly dataSourcesDeleteDatapointPath =
    '/datasources/{datasourceProtocol}/dataPoints/{datapointId}';
  static readonly dataSourcesPatchDatapointPath =
    '/datasources/{datasourceProtocol}/dataPoints/{datapointId}';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Returns all available datasources of the runtime
   * @return A list of all available datasources.
   */
  dataSourcesGetResponse(): __Observable<__StrictHttpResponse<DataSourceList>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/datasources`,
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
        return _r as __StrictHttpResponse<DataSourceList>;
      })
    );
  }
  /**
   * Returns all available datasources of the runtime
   * @return A list of all available datasources.
   */
  dataSourcesGet(): __Observable<DataSourceList> {
    return this.dataSourcesGetResponse().pipe(
      __map((_r) => _r.body as DataSourceList)
    );
  }

  /**
   * @param datasourceProtocol id of the datasource
   * @return Request dateSource with given ID
   */
  dataSourceGetResponse(
    datasourceProtocol: string
  ): __Observable<__StrictHttpResponse<DataSourceType>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/datasources/${encodeURIComponent(String(datasourceProtocol))}`,
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
        return _r as __StrictHttpResponse<DataSourceType>;
      })
    );
  }
  /**
   * @param datasourceProtocol id of the datasource
   * @return Request dateSource with given ID
   */
  dataSourceGet(datasourceProtocol: string): __Observable<DataSourceType> {
    return this.dataSourceGetResponse(datasourceProtocol).pipe(
      __map((_r) => _r.body as DataSourceType)
    );
  }

  /**
   * change datasource
   *
   * Only for toggling enabled property and change of connection
   * @param params The `DatasourceService.DataSourcePatchParams` containing the following parameters:
   *
   * - `datasourceProtocol`: id of the datasource
   *
   * - `changeObject`:
   *
   * @return Successfully changed datasource
   */
  dataSourcePatchResponse(
    params: DatasourceService.DataSourcePatchParams
  ): __Observable<__StrictHttpResponse<DataSourceType>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __body = params.changeObject;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl +
        `/datasources/${encodeURIComponent(String(params.datasourceProtocol))}`,
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
        return _r as __StrictHttpResponse<DataSourceType>;
      })
    );
  }
  /**
   * change datasource
   *
   * Only for toggling enabled property and change of connection
   * @param params The `DatasourceService.DataSourcePatchParams` containing the following parameters:
   *
   * - `datasourceProtocol`: id of the datasource
   *
   * - `changeObject`:
   *
   * @return Successfully changed datasource
   */
  dataSourcePatch(
    params: DatasourceService.DataSourcePatchParams
  ): __Observable<DataSourceType> {
    return this.dataSourcePatchResponse(params).pipe(
      __map((_r) => _r.body as DataSourceType)
    );
  }

  /**
   * Returns a list of dataPoints of this datasource
   * @param datasourceProtocol id of the datasource
   */
  dataSourcesGetDatapointsResponse(
    datasourceProtocol: string
  ): __Observable<
    __StrictHttpResponse<{ dataPoints?: Array<Sourcedatapoint & Uuid> }>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/datasources/${encodeURIComponent(
          String(datasourceProtocol)
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
          dataPoints?: Array<Sourcedatapoint & Uuid>;
        }>;
      })
    );
  }
  /**
   * Returns a list of dataPoints of this datasource
   * @param datasourceProtocol id of the datasource
   */
  dataSourcesGetDatapoints(
    datasourceProtocol: string
  ): __Observable<{ dataPoints?: Array<Sourcedatapoint & Uuid> }> {
    return this.dataSourcesGetDatapointsResponse(datasourceProtocol).pipe(
      __map((_r) => _r.body as { dataPoints?: Array<Sourcedatapoint & Uuid> })
    );
  }

  /**
   * Create a new datapoint for the selected datasource.
   * @param params The `DatasourceService.DataSourcesPostDatapointParams` containing the following parameters:
   *
   * - `newDatapoint`: New datapoint to create
   *
   * - `datasourceProtocol`: id of the datasource
   *
   * @return The new created datapoint
   */
  dataSourcesPostDatapointResponse(
    params: DatasourceService.DataSourcesPostDatapointParams
  ): __Observable<
    __StrictHttpResponse<{ created?: Sourcedatapoint & Uuid; href?: string }>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = params.newDatapoint;

    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl +
        `/datasources/${encodeURIComponent(
          String(params.datasourceProtocol)
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
          created?: Sourcedatapoint & Uuid;
          href?: string;
        }>;
      })
    );
  }
  /**
   * Create a new datapoint for the selected datasource.
   * @param params The `DatasourceService.DataSourcesPostDatapointParams` containing the following parameters:
   *
   * - `newDatapoint`: New datapoint to create
   *
   * - `datasourceProtocol`: id of the datasource
   *
   * @return The new created datapoint
   */
  dataSourcesPostDatapoint(
    params: DatasourceService.DataSourcesPostDatapointParams
  ): __Observable<{ created?: Sourcedatapoint & Uuid; href?: string }> {
    return this.dataSourcesPostDatapointResponse(params).pipe(
      __map(
        (_r) => _r.body as { created?: Sourcedatapoint & Uuid; href?: string }
      )
    );
  }

  /**
   * returns a datapoint with given id
   * @param params The `DatasourceService.DataSourcesGetDatapointParams` containing the following parameters:
   *
   * - `datasourceProtocol`: id of the datasource
   *
   * - `datapointId`: id of the datapoint
   *
   * @return returns a datapoint with given id
   */
  dataSourcesGetDatapointResponse(
    params: DatasourceService.DataSourcesGetDatapointParams
  ): __Observable<__StrictHttpResponse<Sourcedatapoint & Uuid>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl +
        `/datasources/${encodeURIComponent(
          String(params.datasourceProtocol)
        )}/dataPoints/${encodeURIComponent(String(params.datapointId))}`,
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
        return _r as __StrictHttpResponse<Sourcedatapoint & Uuid>;
      })
    );
  }
  /**
   * returns a datapoint with given id
   * @param params The `DatasourceService.DataSourcesGetDatapointParams` containing the following parameters:
   *
   * - `datasourceProtocol`: id of the datasource
   *
   * - `datapointId`: id of the datapoint
   *
   * @return returns a datapoint with given id
   */
  dataSourcesGetDatapoint(
    params: DatasourceService.DataSourcesGetDatapointParams
  ): __Observable<Sourcedatapoint & Uuid> {
    return this.dataSourcesGetDatapointResponse(params).pipe(
      __map((_r) => _r.body as Sourcedatapoint & Uuid)
    );
  }

  /**
   * Delete the datapoint selected by id
   * @param params The `DatasourceService.DataSourcesDeleteDatapointParams` containing the following parameters:
   *
   * - `datasourceProtocol`: id of the datasource
   *
   * - `datapointId`: id of the datapoint
   *
   * @return Successfully deleted datapoint
   */
  dataSourcesDeleteDatapointResponse(
    params: DatasourceService.DataSourcesDeleteDatapointParams
  ): __Observable<__StrictHttpResponse<{ deleted?: Sourcedatapoint & Uuid }>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl +
        `/datasources/${encodeURIComponent(
          String(params.datasourceProtocol)
        )}/dataPoints/${encodeURIComponent(String(params.datapointId))}`,
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
        return _r as __StrictHttpResponse<{ deleted?: Sourcedatapoint & Uuid }>;
      })
    );
  }
  /**
   * Delete the datapoint selected by id
   * @param params The `DatasourceService.DataSourcesDeleteDatapointParams` containing the following parameters:
   *
   * - `datasourceProtocol`: id of the datasource
   *
   * - `datapointId`: id of the datapoint
   *
   * @return Successfully deleted datapoint
   */
  dataSourcesDeleteDatapoint(
    params: DatasourceService.DataSourcesDeleteDatapointParams
  ): __Observable<{ deleted?: Sourcedatapoint & Uuid }> {
    return this.dataSourcesDeleteDatapointResponse(params).pipe(
      __map((_r) => _r.body as { deleted?: Sourcedatapoint & Uuid })
    );
  }

  /**
   * overwrite datapoint with selected id
   * @param params The `DatasourceService.DataSourcesPatchDatapointParams` containing the following parameters:
   *
   * - `datasourceProtocol`: id of the datasource
   *
   * - `datapointId`: id of the datapoint
   *
   * - `changedDatapoint`: The new datapoint
   *
   * @return Overwritten datapoint
   */
  dataSourcesPatchDatapointResponse(
    params: DatasourceService.DataSourcesPatchDatapointParams
  ): __Observable<
    __StrictHttpResponse<{ changed?: Sourcedatapoint & Uuid; href?: string }>
  > {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __body = params.changedDatapoint;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl +
        `/datasources/${encodeURIComponent(
          String(params.datasourceProtocol)
        )}/dataPoints/${encodeURIComponent(String(params.datapointId))}`,
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
          changed?: Sourcedatapoint & Uuid;
          href?: string;
        }>;
      })
    );
  }
  /**
   * overwrite datapoint with selected id
   * @param params The `DatasourceService.DataSourcesPatchDatapointParams` containing the following parameters:
   *
   * - `datasourceProtocol`: id of the datasource
   *
   * - `datapointId`: id of the datapoint
   *
   * - `changedDatapoint`: The new datapoint
   *
   * @return Overwritten datapoint
   */
  dataSourcesPatchDatapoint(
    params: DatasourceService.DataSourcesPatchDatapointParams
  ): __Observable<{ changed?: Sourcedatapoint & Uuid; href?: string }> {
    return this.dataSourcesPatchDatapointResponse(params).pipe(
      __map(
        (_r) => _r.body as { changed?: Sourcedatapoint & Uuid; href?: string }
      )
    );
  }
}

module DatasourceService {
  /**
   * Parameters for dataSourcePatch
   */
  export interface DataSourcePatchParams {
    /**
     * id of the datasource
     */
    datasourceProtocol: string;
    changeObject: ChangeDatasource;
  }

  /**
   * Parameters for dataSourcesPostDatapoint
   */
  export interface DataSourcesPostDatapointParams {
    /**
     * New datapoint to create
     */
    newDatapoint: Sourcedatapoint;

    /**
     * id of the datasource
     */
    datasourceProtocol: string;
  }

  /**
   * Parameters for dataSourcesGetDatapoint
   */
  export interface DataSourcesGetDatapointParams {
    /**
     * id of the datasource
     */
    datasourceProtocol: string;

    /**
     * id of the datapoint
     */
    datapointId: string;
  }

  /**
   * Parameters for dataSourcesDeleteDatapoint
   */
  export interface DataSourcesDeleteDatapointParams {
    /**
     * id of the datasource
     */
    datasourceProtocol: string;

    /**
     * id of the datapoint
     */
    datapointId: string;
  }

  /**
   * Parameters for dataSourcesPatchDatapoint
   */
  export interface DataSourcesPatchDatapointParams {
    /**
     * id of the datasource
     */
    datasourceProtocol: string;

    /**
     * id of the datapoint
     */
    datapointId: string;

    /**
     * The new datapoint
     */
    changedDatapoint: Sourcedatapoint;
  }
}

export { DatasourceService };
