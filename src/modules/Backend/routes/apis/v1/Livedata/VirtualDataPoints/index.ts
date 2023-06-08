import { Request, Response } from 'express';

import { ConfigManager } from '../../../../../../ConfigManager';
import { DataPointCache } from '../../../../../../DatapointCache';

let configManager: ConfigManager;
let dataPointCache: DataPointCache;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(config: ConfigManager) {
  configManager = config;
}

/**
 * Set DataPointCache to make accessible for local function
 */
export function setDataPointCache(cache: DataPointCache) {
  dataPointCache = cache;
}

/**
 * Get livedata for VDPs
 */
function livedataVirtualDataPointsGetHandler(
  request: Request,
  response: Response
): void {
  const dataPoints = configManager.config.virtualDataPoints;
  const timeseriesIncluded = request.query.timeseries === 'true';

  const payload = dataPoints
    .map(({ id }) => {
      const value = dataPointCache.getLastestValue(id);

      if (!value) {
        return undefined;
      }

      const obj: any = {
        dataPointId: id,
        value: value.value,
        timestamp: Math.round(new Date(value.ts).getTime() / 1000)
      };

      if (timeseriesIncluded) {
        obj.timeseries = dataPointCache.getTimeSeries(id);
      }

      return obj;
    })
    .filter(Boolean);

  response.status(200).json(payload);
}

export const livedataVirtualDataPointsHandlers = {
  livedataVirtualDataPointsGetHandler
};
