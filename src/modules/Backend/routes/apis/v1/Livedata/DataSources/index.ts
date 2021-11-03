import { Request, Response } from 'express';
import { ConfigManager } from '../../../../../../ConfigManager';
import { DataPointCache } from '../../../../../../DatapointCache';
import { DataSourceProtocols } from '../../../../../../../common/interfaces';

let configManager: ConfigManager;
let dataPointCache: DataPointCache;

/**
 * Set ConfigManager to make accessible for local function
 * @param {ConfigManager} config
 */
export function setConfigManager(config: ConfigManager) {
  configManager = config;
}

/**
 * Set DataPointCache to make accessible for local function
 * @param {DataPointCache} cache
 */
export function setDataPointCache(cache: DataPointCache) {
  dataPointCache = cache;
}

/**
 * Get Livedata for DataSource DataPoints
 * @param  {Request} request
 * @param  {Response} response
 */
function livedataDataSourceDataPointsGetHandler(
  request: Request,
  response: Response
): void {
  const dataSource = configManager.config.dataSources.find(
    (ds) => ds.protocol === request.params.datasourceProtocol
  );

  if (!dataSource) {
    response.status(404).send();

    return;
  }

  const dataPointIds = dataSource.dataPoints.map((dp) => dp.id);

  const timeseriesIncluded = request.query.timeseries === 'true';

  const payload = dataPointIds
    .map((dataPointId) => {
      const event = dataPointCache.getLastEvent(dataPointId);

      if (!event) {
        return undefined;
      }

      const obj: any = {
        dataPointId,
        value: event.measurement.value,
        timestamp: Math.round(Date.now() / 1000)
      };

      if (timeseriesIncluded) {
        obj.timeseries = dataPointCache.getTimeSeries(dataPointId);
      }

      return obj;
    })
    .filter(Boolean);

  response.status(200).json(payload);
}

/**
 * Get Livedata for DataSource DataPoint by dataPointId
 * @param  {Request} request
 * @param  {Response} response
 */
function livedataDataSourceDataPointGetHandler(
  request: Request,
  response: Response
): void {
  const event = dataPointCache.getLastEvent(request.params.dataPointId);

  if (!event) {
    response.status(404).send();

    return;
  }

  const timeseriesIncluded = request.query.timeseries === 'true';

  const payload: any = {
    dataPointId: request.params.dataPointId,
    value: event.measurement.value,
    timestamp: Math.round(Date.now() / 1000)
  };

  if (timeseriesIncluded) {
    payload.timeseries = dataPointCache.getTimeSeries(
      request.params.dataPointId
    );
  }

  response.status(200).json(payload);
}

export const livedataDataSourcesHandlers = {
  livedataDataSourceDataPointsGet: livedataDataSourceDataPointsGetHandler,
  livedataDataSourceDataPointGet: livedataDataSourceDataPointGetHandler
};
