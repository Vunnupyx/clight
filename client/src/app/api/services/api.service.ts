/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { DataSourceList } from '../models/data-source-list';
import { DataSourceType } from '../models/data-source-type';
import { ChangeDatasource } from '../models/change-datasource';
import { Sourcedatapoint } from '../models/sourcedatapoint';
import { DataSinkType } from '../models/data-sink-type';
import { DataPointList } from '../models/data-point-list';
import { DataPointType } from '../models/data-point-type';
import { VirtualDataPointType } from '../models/virtual-data-point-type';
import { ConfigFile } from '../models/config-file';
@Injectable({
  providedIn: 'root',
})
class ApiService extends __BaseService {
  static readonly dataSourcesGetPath = '/datasources';
  static readonly dataSourceGetPath = '/datasources/{datasourceId}';
  static readonly dataSourcePatchPath = '/datasources/{datasourceId}';
  static readonly getDatasourcesDatasourceIdDataPointsPath = '/datasources/{datasourceId}/dataPoints';
  static readonly postDatasourcesDatasourceIdDataPointsPath = '/datasources/{datasourceId}/dataPoints';
  static readonly getDatasourcesDatasourceIdDataPointsDatapointIdPath = '/datasources/{datasourceId}/dataPoints/{datapointId}';
  static readonly deleteDatasourcesDatasourceIdDataPointsDatapointIdPath = '/datasources/{datasourceId}/dataPoints/{datapointId}';
  static readonly patchDatasourcesDatasourceIdDataPointsDatapointIdPath = '/datasources/{datasourceId}/dataPoints/{datapointId}';
  static readonly dataSinksGetPath = '/datasinks';
  static readonly dataSinkGetPath = '/datasinks/{datasinkId}';
  static readonly dataPointsGetPath = '/datasinks/{datasinkId}/dataPoints';
  static readonly dataPointsPostPath = '/datasinks/{datasinkId}/dataPoints';
  static readonly dataPointGetPath = '/datasinks/{datasinkId}/dataPoints/{dataPointId}';
  static readonly dataPointPatchPath = '/datasinks/{datasinkId}/dataPoints/{dataPointId}';
  static readonly dataPointDeletePath = '/datasinks/{datasinkId}/dataPoints/{dataPointId}';
  static readonly vdpsGetPath = '/vdps';
  static readonly vdpsPostPath = '/vdps';
  static readonly vdpGetPath = '/vdps/{id}';
  static readonly vdpDeletePath = '/vdps/{id}';
  static readonly vdpPatchPath = '/vdps/{id}';
  static readonly backupGetPath = '/backup';
  static readonly backupPostPath = '/backup';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
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
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
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
      __map(_r => _r.body as DataSourceList)
    );
  }

  /**
   * @param datasourceId id of the datasource
   * @return Request dateSource with given ID
   */
  dataSourceGetResponse(datasourceId: string): __Observable<__StrictHttpResponse<DataSourceType>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/datasources/${encodeURIComponent(String(datasourceId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DataSourceType>;
      })
    );
  }
  /**
   * @param datasourceId id of the datasource
   * @return Request dateSource with given ID
   */
  dataSourceGet(datasourceId: string): __Observable<DataSourceType> {
    return this.dataSourceGetResponse(datasourceId).pipe(
      __map(_r => _r.body as DataSourceType)
    );
  }

  /**
   * change datasource
   *
   * Only for toggling enabled property
   * @param params The `ApiService.DataSourcePatchParams` containing the following parameters:
   *
   * - `datasourceId`: id of the datasource
   *
   * - `changeObject`:
   *
   * @return Successfully changed datasource
   */
  dataSourcePatchResponse(params: ApiService.DataSourcePatchParams): __Observable<__StrictHttpResponse<DataSourceType>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __body = params.changeObject;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/datasources/${encodeURIComponent(String(params.datasourceId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DataSourceType>;
      })
    );
  }
  /**
   * change datasource
   *
   * Only for toggling enabled property
   * @param params The `ApiService.DataSourcePatchParams` containing the following parameters:
   *
   * - `datasourceId`: id of the datasource
   *
   * - `changeObject`:
   *
   * @return Successfully changed datasource
   */
  dataSourcePatch(params: ApiService.DataSourcePatchParams): __Observable<DataSourceType> {
    return this.dataSourcePatchResponse(params).pipe(
      __map(_r => _r.body as DataSourceType)
    );
  }

  /**
   * Returns a list of dataPoints of this datasource
   * @param datasourceId id of the datasource
   */
  getDatasourcesDatasourceIdDataPointsResponse(datasourceId: string): __Observable<__StrictHttpResponse<{dataPoints?: Array<Sourcedatapoint>}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/datasources/${encodeURIComponent(String(datasourceId))}/dataPoints`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{dataPoints?: Array<Sourcedatapoint>}>;
      })
    );
  }
  /**
   * Returns a list of dataPoints of this datasource
   * @param datasourceId id of the datasource
   */
  getDatasourcesDatasourceIdDataPoints(datasourceId: string): __Observable<{dataPoints?: Array<Sourcedatapoint>}> {
    return this.getDatasourcesDatasourceIdDataPointsResponse(datasourceId).pipe(
      __map(_r => _r.body as {dataPoints?: Array<Sourcedatapoint>})
    );
  }

  /**
   * Create a new datapoint for the selected datasource.
   * @param params The `ApiService.PostDatasourcesDatasourceIdDataPointsParams` containing the following parameters:
   *
   * - `newDatapoint`: New datapoint to create
   *
   * - `datasourceId`: id of the datasource
   *
   * @return The new created datapoint
   */
  postDatasourcesDatasourceIdDataPointsResponse(params: ApiService.PostDatasourcesDatasourceIdDataPointsParams): __Observable<__StrictHttpResponse<{created?: Sourcedatapoint}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = params.newDatapoint;

    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/datasources/${encodeURIComponent(String(params.datasourceId))}/dataPoints`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{created?: Sourcedatapoint}>;
      })
    );
  }
  /**
   * Create a new datapoint for the selected datasource.
   * @param params The `ApiService.PostDatasourcesDatasourceIdDataPointsParams` containing the following parameters:
   *
   * - `newDatapoint`: New datapoint to create
   *
   * - `datasourceId`: id of the datasource
   *
   * @return The new created datapoint
   */
  postDatasourcesDatasourceIdDataPoints(params: ApiService.PostDatasourcesDatasourceIdDataPointsParams): __Observable<{created?: Sourcedatapoint}> {
    return this.postDatasourcesDatasourceIdDataPointsResponse(params).pipe(
      __map(_r => _r.body as {created?: Sourcedatapoint})
    );
  }

  /**
   * returns a datapoint with given id
   * @param params The `ApiService.GetDatasourcesDatasourceIdDataPointsDatapointIdParams` containing the following parameters:
   *
   * - `datasourceId`: id of the datasource
   *
   * - `datapointId`: id of the datapoint
   *
   * @return returns a datapoint with given id
   */
  getDatasourcesDatasourceIdDataPointsDatapointIdResponse(params: ApiService.GetDatasourcesDatasourceIdDataPointsDatapointIdParams): __Observable<__StrictHttpResponse<Sourcedatapoint>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/datasources/${encodeURIComponent(String(params.datasourceId))}/dataPoints/${encodeURIComponent(String(params.datapointId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Sourcedatapoint>;
      })
    );
  }
  /**
   * returns a datapoint with given id
   * @param params The `ApiService.GetDatasourcesDatasourceIdDataPointsDatapointIdParams` containing the following parameters:
   *
   * - `datasourceId`: id of the datasource
   *
   * - `datapointId`: id of the datapoint
   *
   * @return returns a datapoint with given id
   */
  getDatasourcesDatasourceIdDataPointsDatapointId(params: ApiService.GetDatasourcesDatasourceIdDataPointsDatapointIdParams): __Observable<Sourcedatapoint> {
    return this.getDatasourcesDatasourceIdDataPointsDatapointIdResponse(params).pipe(
      __map(_r => _r.body as Sourcedatapoint)
    );
  }

  /**
   * Delete the datapoint selected by id
   * @param params The `ApiService.DeleteDatasourcesDatasourceIdDataPointsDatapointIdParams` containing the following parameters:
   *
   * - `datasourceId`: id of the datasource
   *
   * - `datapointId`: id of the datapoint
   *
   * @return Successfully deleted datapoint
   */
  deleteDatasourcesDatasourceIdDataPointsDatapointIdResponse(params: ApiService.DeleteDatasourcesDatasourceIdDataPointsDatapointIdParams): __Observable<__StrictHttpResponse<{deleted?: Sourcedatapoint}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/datasources/${encodeURIComponent(String(params.datasourceId))}/dataPoints/${encodeURIComponent(String(params.datapointId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{deleted?: Sourcedatapoint}>;
      })
    );
  }
  /**
   * Delete the datapoint selected by id
   * @param params The `ApiService.DeleteDatasourcesDatasourceIdDataPointsDatapointIdParams` containing the following parameters:
   *
   * - `datasourceId`: id of the datasource
   *
   * - `datapointId`: id of the datapoint
   *
   * @return Successfully deleted datapoint
   */
  deleteDatasourcesDatasourceIdDataPointsDatapointId(params: ApiService.DeleteDatasourcesDatasourceIdDataPointsDatapointIdParams): __Observable<{deleted?: Sourcedatapoint}> {
    return this.deleteDatasourcesDatasourceIdDataPointsDatapointIdResponse(params).pipe(
      __map(_r => _r.body as {deleted?: Sourcedatapoint})
    );
  }

  /**
   * overwrite datapoint with selected id
   * @param params The `ApiService.PatchDatasourcesDatasourceIdDataPointsDatapointIdParams` containing the following parameters:
   *
   * - `datasourceId`: id of the datasource
   *
   * - `datapointId`: id of the datapoint
   *
   * - `changedDatapoint`: The new datapoint
   *
   * @return Overwritten datapoint
   */
  patchDatasourcesDatasourceIdDataPointsDatapointIdResponse(params: ApiService.PatchDatasourcesDatasourceIdDataPointsDatapointIdParams): __Observable<__StrictHttpResponse<{changed?: Sourcedatapoint, href?: string}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    __body = params.changedDatapoint;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/datasources/${encodeURIComponent(String(params.datasourceId))}/dataPoints/${encodeURIComponent(String(params.datapointId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{changed?: Sourcedatapoint, href?: string}>;
      })
    );
  }
  /**
   * overwrite datapoint with selected id
   * @param params The `ApiService.PatchDatasourcesDatasourceIdDataPointsDatapointIdParams` containing the following parameters:
   *
   * - `datasourceId`: id of the datasource
   *
   * - `datapointId`: id of the datapoint
   *
   * - `changedDatapoint`: The new datapoint
   *
   * @return Overwritten datapoint
   */
  patchDatasourcesDatasourceIdDataPointsDatapointId(params: ApiService.PatchDatasourcesDatasourceIdDataPointsDatapointIdParams): __Observable<{changed?: Sourcedatapoint, href?: string}> {
    return this.patchDatasourcesDatasourceIdDataPointsDatapointIdResponse(params).pipe(
      __map(_r => _r.body as {changed?: Sourcedatapoint, href?: string})
    );
  }

  /**
   * Returns all available datesinks of the runtime
   * @return Successful request to datasinks
   */
  dataSinksGetResponse(): __Observable<__StrictHttpResponse<{dataSinks?: Array<DataSinkType>}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/datasinks`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{dataSinks?: Array<DataSinkType>}>;
      })
    );
  }
  /**
   * Returns all available datesinks of the runtime
   * @return Successful request to datasinks
   */
  dataSinksGet(): __Observable<{dataSinks?: Array<DataSinkType>}> {
    return this.dataSinksGetResponse().pipe(
      __map(_r => _r.body as {dataSinks?: Array<DataSinkType>})
    );
  }

  /**
   * Get datasink object by id
   * @param datasinkId undefined
   * @return Datasink object
   */
  dataSinkGetResponse(datasinkId: string): __Observable<__StrictHttpResponse<DataSinkType>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/datasinks/${encodeURIComponent(String(datasinkId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DataSinkType>;
      })
    );
  }
  /**
   * Get datasink object by id
   * @param datasinkId undefined
   * @return Datasink object
   */
  dataSinkGet(datasinkId: string): __Observable<DataSinkType> {
    return this.dataSinkGetResponse(datasinkId).pipe(
      __map(_r => _r.body as DataSinkType)
    );
  }

  /**
   * @param datasinkId undefined
   * @return Return list of dataPoints
   */
  dataPointsGetResponse(datasinkId: string): __Observable<__StrictHttpResponse<DataPointList>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/datasinks/${encodeURIComponent(String(datasinkId))}/dataPoints`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DataPointList>;
      })
    );
  }
  /**
   * @param datasinkId undefined
   * @return Return list of dataPoints
   */
  dataPointsGet(datasinkId: string): __Observable<DataPointList> {
    return this.dataPointsGetResponse(datasinkId).pipe(
      __map(_r => _r.body as DataPointList)
    );
  }

  /**
   * @param params The `ApiService.DataPointsPostParams` containing the following parameters:
   *
   * - `datasinkId`:
   *
   * - `dataPoint`: New Datapoint object
   *
   * @return Response of a new created dataPoint
   */
  dataPointsPostResponse(params: ApiService.DataPointsPostParams): __Observable<__StrictHttpResponse<{created?: DataPointType, href?: string}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __body = params.dataPoint;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/datasinks/${encodeURIComponent(String(params.datasinkId))}/dataPoints`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{created?: DataPointType, href?: string}>;
      })
    );
  }
  /**
   * @param params The `ApiService.DataPointsPostParams` containing the following parameters:
   *
   * - `datasinkId`:
   *
   * - `dataPoint`: New Datapoint object
   *
   * @return Response of a new created dataPoint
   */
  dataPointsPost(params: ApiService.DataPointsPostParams): __Observable<{created?: DataPointType, href?: string}> {
    return this.dataPointsPostResponse(params).pipe(
      __map(_r => _r.body as {created?: DataPointType, href?: string})
    );
  }

  /**
   * @param params The `ApiService.DataPointGetParams` containing the following parameters:
   *
   * - `datasinkId`: id of the datapoint to get
   *
   * - `dataPointId`: id of the datapoint to get
   */
  dataPointGetResponse(params: ApiService.DataPointGetParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/datasinks/${encodeURIComponent(String(params.datasinkId))}/dataPoints/${encodeURIComponent(String(params.dataPointId))}`,
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
   * @param params The `ApiService.DataPointGetParams` containing the following parameters:
   *
   * - `datasinkId`: id of the datapoint to get
   *
   * - `dataPointId`: id of the datapoint to get
   */
  dataPointGet(params: ApiService.DataPointGetParams): __Observable<null> {
    return this.dataPointGetResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param params The `ApiService.DataPointPatchParams` containing the following parameters:
   *
   * - `patchData`: DataPoint object with changed properties
   *
   * - `datasinkId`: id of the datapoint to get
   *
   * - `dataPointId`: id of the datapoint to get
   *
   * @return Response of a change request for a datapoint with given id
   */
  dataPointPatchResponse(params: ApiService.DataPointPatchParams): __Observable<__StrictHttpResponse<DataPointType>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = params.patchData;


    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/datasinks/${encodeURIComponent(String(params.datasinkId))}/dataPoints/${encodeURIComponent(String(params.dataPointId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DataPointType>;
      })
    );
  }
  /**
   * @param params The `ApiService.DataPointPatchParams` containing the following parameters:
   *
   * - `patchData`: DataPoint object with changed properties
   *
   * - `datasinkId`: id of the datapoint to get
   *
   * - `dataPointId`: id of the datapoint to get
   *
   * @return Response of a change request for a datapoint with given id
   */
  dataPointPatch(params: ApiService.DataPointPatchParams): __Observable<DataPointType> {
    return this.dataPointPatchResponse(params).pipe(
      __map(_r => _r.body as DataPointType)
    );
  }

  /**
   * @param params The `ApiService.DataPointDeleteParams` containing the following parameters:
   *
   * - `datasinkId`: id of the datapoint to get
   *
   * - `dataPointId`: id of the datapoint to get
   *
   * @return Delete a datapoint by id and return the deleted item.
   */
  dataPointDeleteResponse(params: ApiService.DataPointDeleteParams): __Observable<__StrictHttpResponse<{deleted?: DataPointType}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/datasinks/${encodeURIComponent(String(params.datasinkId))}/dataPoints/${encodeURIComponent(String(params.dataPointId))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{deleted?: DataPointType}>;
      })
    );
  }
  /**
   * @param params The `ApiService.DataPointDeleteParams` containing the following parameters:
   *
   * - `datasinkId`: id of the datapoint to get
   *
   * - `dataPointId`: id of the datapoint to get
   *
   * @return Delete a datapoint by id and return the deleted item.
   */
  dataPointDelete(params: ApiService.DataPointDeleteParams): __Observable<{deleted?: DataPointType}> {
    return this.dataPointDeleteResponse(params).pipe(
      __map(_r => _r.body as {deleted?: DataPointType})
    );
  }

  /**
   * Return a list of virtual datapoints
   * @return List of virtual datapoints.
   */
  vdpsGetResponse(): __Observable<__StrictHttpResponse<{vdps?: Array<VirtualDataPointType>}>> {
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
        return _r as __StrictHttpResponse<{vdps?: Array<VirtualDataPointType>}>;
      })
    );
  }
  /**
   * Return a list of virtual datapoints
   * @return List of virtual datapoints.
   */
  vdpsGet(): __Observable<{vdps?: Array<VirtualDataPointType>}> {
    return this.vdpsGetResponse().pipe(
      __map(_r => _r.body as {vdps?: Array<VirtualDataPointType>})
    );
  }

  /**
   * Add a virtual datapoint to the runtime
   * @param newVDP New virtual datapoint
   * @return Successfully create a virtual datapoint resource
   */
  vdpsPostResponse(newVDP: VirtualDataPointType): __Observable<__StrictHttpResponse<{virtualDataPoint?: VirtualDataPointType, href: string}>> {
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
        return _r as __StrictHttpResponse<{virtualDataPoint?: VirtualDataPointType, href: string}>;
      })
    );
  }
  /**
   * Add a virtual datapoint to the runtime
   * @param newVDP New virtual datapoint
   * @return Successfully create a virtual datapoint resource
   */
  vdpsPost(newVDP: VirtualDataPointType): __Observable<{virtualDataPoint?: VirtualDataPointType, href: string}> {
    return this.vdpsPostResponse(newVDP).pipe(
      __map(_r => _r.body as {virtualDataPoint?: VirtualDataPointType, href: string})
    );
  }

  /**
   * @param id Id of the virtual datapoint to operate on
   * @return Returns a virtual datapoint
   */
  vdpGetResponse(id: string): __Observable<__StrictHttpResponse<VirtualDataPointType>> {
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
        return _r as __StrictHttpResponse<VirtualDataPointType>;
      })
    );
  }
  /**
   * @param id Id of the virtual datapoint to operate on
   * @return Returns a virtual datapoint
   */
  vdpGet(id: string): __Observable<VirtualDataPointType> {
    return this.vdpGetResponse(id).pipe(
      __map(_r => _r.body as VirtualDataPointType)
    );
  }

  /**
   * @param id Id of the virtual datapoint to operate on
   */
  vdpDeleteResponse(id: string): __Observable<__StrictHttpResponse<null>> {
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
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param id Id of the virtual datapoint to operate on
   */
  vdpDelete(id: string): __Observable<null> {
    return this.vdpDeleteResponse(id).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param params The `ApiService.VdpPatchParams` containing the following parameters:
   *
   * - `patched virtual datapoint`:
   *
   * - `id`: Id of the virtual datapoint to operate on
   *
   * @return Changed virtual dataPoint
   */
  vdpPatchResponse(params: ApiService.VdpPatchParams): __Observable<__StrictHttpResponse<{changed?: VirtualDataPointType, href?: string}>> {
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
        return _r as __StrictHttpResponse<{changed?: VirtualDataPointType, href?: string}>;
      })
    );
  }
  /**
   * @param params The `ApiService.VdpPatchParams` containing the following parameters:
   *
   * - `patched virtual datapoint`:
   *
   * - `id`: Id of the virtual datapoint to operate on
   *
   * @return Changed virtual dataPoint
   */
  vdpPatch(params: ApiService.VdpPatchParams): __Observable<{changed?: VirtualDataPointType, href?: string}> {
    return this.vdpPatchResponse(params).pipe(
      __map(_r => _r.body as {changed?: VirtualDataPointType, href?: string})
    );
  }

  /**
   * @return Config file as JSON.
   */
  backupGetResponse(): __Observable<__StrictHttpResponse<Blob>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/backup`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'blob'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Blob>;
      })
    );
  }
  /**
   * @return Config file as JSON.
   */
  backupGet(): __Observable<Blob> {
    return this.backupGetResponse().pipe(
      __map(_r => _r.body as Blob)
    );
  }

  /**
   * @param config New config file to use.
   * @return Config file uploaded to the system.
   */
  backupPostResponse(config: Blob): __Observable<__StrictHttpResponse<ConfigFile>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let __formData = new FormData();
    __body = __formData;
    if (config != null) { __formData.append('config', config as string | Blob);}
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/backup`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
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
      __map(_r => _r.body as ConfigFile)
    );
  }
}

module ApiService {

  /**
   * Parameters for dataSourcePatch
   */
  export interface DataSourcePatchParams {

    /**
     * id of the datasource
     */
    datasourceId: string;
    changeObject: ChangeDatasource;
  }

  /**
   * Parameters for postDatasourcesDatasourceIdDataPoints
   */
  export interface PostDatasourcesDatasourceIdDataPointsParams {

    /**
     * New datapoint to create
     */
    newDatapoint: Sourcedatapoint;

    /**
     * id of the datasource
     */
    datasourceId: string;
  }

  /**
   * Parameters for getDatasourcesDatasourceIdDataPointsDatapointId
   */
  export interface GetDatasourcesDatasourceIdDataPointsDatapointIdParams {

    /**
     * id of the datasource
     */
    datasourceId: string;

    /**
     * id of the datapoint
     */
    datapointId: string;
  }

  /**
   * Parameters for deleteDatasourcesDatasourceIdDataPointsDatapointId
   */
  export interface DeleteDatasourcesDatasourceIdDataPointsDatapointIdParams {

    /**
     * id of the datasource
     */
    datasourceId: string;

    /**
     * id of the datapoint
     */
    datapointId: string;
  }

  /**
   * Parameters for patchDatasourcesDatasourceIdDataPointsDatapointId
   */
  export interface PatchDatasourcesDatasourceIdDataPointsDatapointIdParams {

    /**
     * id of the datasource
     */
    datasourceId: string;

    /**
     * id of the datapoint
     */
    datapointId: string;

    /**
     * The new datapoint
     */
    changedDatapoint: Sourcedatapoint;
  }

  /**
   * Parameters for dataPointsPost
   */
  export interface DataPointsPostParams {
    datasinkId: string;

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
    datasinkId: string;

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
    datasinkId: string;

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
    datasinkId: string;

    /**
     * id of the datapoint to get
     */
    dataPointId: string;
  }

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

export { ApiService }
