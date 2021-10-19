import {Request, Response} from "express";

import {ConfigManager} from "../../../../../../ConfigManager";
import {DataPointCache} from "../../../../../../DatapointCache";

let configManager: ConfigManager;
let dataPointCache: DataPointCache;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(config: ConfigManager) {
    configManager = config;
}

export function setDataPointCache(cache: DataPointCache) {
    dataPointCache = cache;
}

function livedataVirtualDataPointsGetHandler(request: Request, response: Response): void {
    const dataPoints = configManager.config.virtualDataPoints;

    const payload = dataPoints.map(({ id }) => {
        const event = dataPointCache.getLastEvent(id);

        if (!event) {
            return undefined;
        }

        return {
            dataPointId: id,
            value: event.measurement.value,
            timestamp: Math.round(Date.now() / 1000),
        };
    }).filter(Boolean);

    response.status(200).json(payload);
}

function livedataVirtualDataPointGetHandler(request: Request, response: Response): void {
    const event = dataPointCache.getLastEvent(request.params.id);

    if (!event) {
        response.status(404).send();

        return;
    }

    const payload = {
        dataPointId: request.params.id,
        value: event.measurement.value,
        timestamp: Math.round(Date.now() / 1000)
    };

    response.status(200).json(payload);
}

export const livedataVirtualDataPointsHandlers = {
    livedataVirtualDataPointsGet: livedataVirtualDataPointsGetHandler,
    livedataVirtualDataPointGet: livedataVirtualDataPointGetHandler,
}
