import { Request, Response } from 'express';
import { ConfigManager } from '../../../../../../ConfigManager';
import { DataPointCache } from '../../../../../../DatapointCache';

let configManager: ConfigManager;
let dataPointCache: DataPointCache;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(config: ConfigManager): void {
  configManager = config;
}

/**
 * Set DataPointCache to make accessible for local function
 */
export function setDataPointCache(cache: DataPointCache): void {
  dataPointCache = cache;
}

/**
 * Get Livedata for DataSink DataPoints
 */
function livedataDataSinkDataPointsGetHandler(
  request: Request,
  response: Response
): void {
  const dataSink = configManager.config?.dataSinks?.find(
    (ds) => ds.protocol === request.params.datasinkProtocol
  );

  if (!dataSink) {
    response.status(404).send();

    return;
  }

  const dataPointIds = dataSink.dataPoints.map((dp) => dp.id);

  const timeseriesIncluded = request.query.timeseries === 'true';

  const payload = dataPointIds
    .map((dataPointId) => {
      const value = dataPointCache.getLastestValue(dataPointId);

      if (!value) {
        return undefined;
      }

      const obj: any = {
        dataPointId,
        value: value.value,
        unit: value.unit,
        description: value.description,
        timestamp: Math.round(new Date(value.ts).getTime() / 1000)
      };

      if (timeseriesIncluded) {
        obj.timeseries = dataPointCache.getTimeSeries(dataPointId);
      }

      return obj;
    })
    .filter(Boolean);

  response.status(200).json(payload);
}

export const livedataDataSinksHandlers = {
  livedataDataSinkDataPointsGetHandler
};
