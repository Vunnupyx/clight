
/**
 * All request handlers for requests to datasource endpoints
 */

import { ConfigManager } from "../../../../../ConfigManager";
import { Request, Response } from 'express';
import winston from "winston";

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(manager: ConfigManager) {
    configManager = manager;
}
 
/**
 * Handle all requests for the list of datasources.
 */
function dataSourcesGetHandler (request: Request, response: Response): void {
    response.status(200).json({dataSources: configManager?.config?.dataSources || []});
}

/**
 * Handle all get requests for a specific datasource.
 */
function dataSourceGetHandler (request: Request, response: Response): void {
    const dataSource = configManager.config.dataSources.find((source) => source.id === request.params.datasourceId);
    response.status(dataSource ? 200 : 404).json(dataSource);
}

/**
 * Handle all patch requests for modifying a specific datasource.
 * Only enabling and disabling is allowed.
 */
function dataSourcePatchHandler (request: Request, response: Response): void {
    const allowed = ['connection', 'enabled'];
    
    const dataSource = configManager.config.dataSources.find((source) => source.id === request.params.datasourceId);
    if(!dataSource) {
        winston.warn(``); // TODO: Define warning;
        response.status(404).send();
    }
    Object.keys(request.body).forEach((entry) => {
        if(!allowed.includes(entry)) {
            winston.warn(`dataSourcePatchHandler tried to change property: ${entry}. Not allowed`)
            response.status(403).json({
                error: `Not allowed to change ${entry}`
            })
        }
    });
    const changedDatasource = {...dataSource, ...request.body};
    configManager.changeConfig('update', 'dataSources', changedDatasource );
    response.status(200).json(changedDatasource);
}

export const dataSourceHandlers = {
    dataSourcesGet: dataSourcesGetHandler,
    dataSourceGet: dataSourceGetHandler,
    dataSourcePatch: dataSourcePatchHandler
}