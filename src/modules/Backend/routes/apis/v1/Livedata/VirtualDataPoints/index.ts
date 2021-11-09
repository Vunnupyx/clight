import { Request, Response } from 'express';

import { ConfigManager } from '../../../../../../ConfigManager';
import { DataPointCache } from '../../../../../../DatapointCache';

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
 * Get livedata for VDPs
 * @param  {Request} request
 * @param  {Response} response
 */
function livedataVirtualDataPointsGetHandler(
  request: Request,
  response: Response
): void {
  const dataPoints = configManager.config.virtualDataPoints;
  const timeseriesIncluded = request.query.timeseries === 'true';

  const payload = dataPoints
    .map(({ id }) => {
      const event = dataPointCache.getLastEvent(id);

      if (!event) {
        return undefined;
      }

      const obj: any = {
        dataPointId: id,
        value: event.measurement.value,
        timestamp: Math.round(Date.now() / 1000)
      };

      if (timeseriesIncluded) {
        obj.timeseries = dataPointCache.getTimeSeries(id);
      }

      return obj;
    })
    .filter(Boolean);

  response.status(200).json(payload);
}

/**
 * Get livedata for VDPs by VDP id
 * @param  {Request} request
 * @param  {Response} response
 */
function livedataVirtualDataPointGetHandler(
  request: Request,
  response: Response
): void {
  const event = dataPointCache.getLastEvent(request.params.id);
  const timeseriesIncluded = request.query.timeseries === 'true';

  if (!event) {
    response.status(404).send();

    return;
  }

  const payload: any = {
    dataPointId: request.params.id,
    value: event.measurement.value,
    timestamp: Math.round(Date.now() / 1000)
  };

  if (timeseriesIncluded) {
    payload.timeseries = dataPointCache.getTimeSeries(request.params.id);
  }

  response.status(200).json(payload);
}

export const livedataVirtualDataPointsHandlers = {
  livedataVirtualDataPointsGet: livedataVirtualDataPointsGetHandler,
  livedataVirtualDataPointGet: livedataVirtualDataPointGetHandler
};
