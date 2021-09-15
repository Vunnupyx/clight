
/**
 * All request handlers for requests to datasource endpoints
 */

import { ConfigManager } from "../../../../../ConfigManager";

let configManager: ConfigManager;

export function setConfigManager(manager: ConfigManager) {
    configManager = manager;
}
 
/**
 * Handle all requests for the list of datasources
 */
function dataSourcesGetHandler (request, response): void {
    response.status(200).json({
        dataSources: configManager?.config?.dataSources
    });
}

/**
 * Handle all get requests for a specific datasource
 */
function dataSourceGetHandler (request, response): void {
    const dataSource = configManager.config.dataSources.find((source) => source.id === request.params.id);
    response.status(dataSource ? 200 : 404).json(dataSource);
}

/**
 * Handle all patch requests for modifying a specific datasource.
 * Only enabling and disabling is allowed.
 */
function dataSourcePatchHandler (request, response): void {
    console.log(`Aufgerufen`)
    response.status(200).json({
        test: "sollte nicht gehen"
    })
}

export const dataSourceHandlers = {
    dataSourcesGet: dataSourcesGetHandler,
    dataSourceGet: dataSourceGetHandler,
    dataSourcePatch: dataSourcePatchHandler
}