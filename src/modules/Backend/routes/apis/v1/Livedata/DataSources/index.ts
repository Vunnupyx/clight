import {Request, Response} from "express";
import {ConfigManager} from "../../../../../../ConfigManager";
import {DataPointCache} from "../../../../../../DatapointCache";
import {DataSourceProtocols} from "../../../../../../../common/interfaces";

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

function livedataDataSourceDataPointsGetHandler(request: Request, response: Response): void {
    const dataSource = configManager.config.dataSources.find((ds) => ds.protocol === DataSourceProtocols.IOSHIELD);

    if (!dataSource) {
        response.status(404).send();

        return;
    }

    const dataPointIds = dataSource.dataPoints.map((dp) => dp.id);

    const payload = dataPointIds.map((dataPointId) => {
        const event = dataPointCache.getLastEvent(dataPointId);

        if (!event) {
            return undefined;
        }

        return {
            dataPointId,
            value: event.measurement.value,
            timestamp: Math.round(Date.now() / 1000),
        };
    }).filter(Boolean);

    response.status(200).json(payload);
}

function livedataDataSourceDataPointGetHandler(request: Request, response: Response): void {
    const event = dataPointCache.getLastEvent(request.params.dataPointId);

    if (!event) {
        response.status(404).send();

        return;
    }

    const payload = {
        dataPointId: request.params.dataPointId,
        value: event.measurement.value,
        timestamp: Math.round(Date.now() / 1000)
    };

    response.status(200).json(payload);
}

export const livedataDataSourcesHandlers = {
    livedataDataSourceDataPointsGet: livedataDataSourceDataPointsGetHandler,
    livedataDataSourceDataPointGet: livedataDataSourceDataPointGetHandler,
}
