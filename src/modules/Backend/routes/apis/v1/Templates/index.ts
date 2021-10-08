/**
 * All request handlers for requests to templates endpoints
 */

import { ConfigManager } from '../../../../../ConfigManager';
import { Request, Response } from 'express';
import { DataSourcesManager } from '../../../../../DataSourcesManager';
import { DataSinksManager } from '../../../../../Northbound/DataSinks/DataSinksManager';

let configManager: ConfigManager;
let dataSourcesManager: DataSourcesManager;
let dataSinksManager: DataSinksManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(manager: ConfigManager) {
    configManager = manager;
}

/**
 * Set dataSourcesManager to make accessible for local function
 */
export function setDataSourcesManager(manager: DataSourcesManager) {
    dataSourcesManager = manager;
}

/**
 * Set dataSinksManager to make accessible for local function
 */
export function setDataSinksManager(manager: DataSinksManager) {
    dataSinksManager = manager;
}

/**
 * Handle all requests for the list of templates.
 */
function templatesGetHandler(request: Request, response: Response): void {
    response
        .status(200)
        .json(configManager.defaultTemplates);
}

/**
 * Returns the current status of the templates completion
 */
function templatesGetStatusHandler(request: Request, response: Response) {
    const completed = configManager.config.templates.completed;

    response.status(200).json({ completed });
}

/**
 * Handle POST apply templates request
 */
function templatesApplyPostHandler(request: Request, response: Response): void {
    configManager.setDataSources([request.body.dataSource]);
    configManager.setDataSinks(request.body.dataSinks);

    dataSourcesManager.spawnDataSources(configManager.config.dataSources);
    dataSinksManager.createDataSinks();

    configManager.saveConfig({ templates: { completed: true } });

    response
        .status(200)
        .json(null);
}

export const templatesHandlers = {
    templatesGetHandler,
    templatesGetStatusHandler,
    templatesApplyPostHandler,
};
