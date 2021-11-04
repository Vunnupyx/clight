/**
 * All request handlers for requests to templates endpoints
 */

import { ConfigManager } from '../../../../../ConfigManager';
import { Request, Response } from 'express';
import { DataSourcesManager } from '../../../../../Southbound/DataSources/DataSourcesManager';
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
  const payload = {
    availableDataSources: configManager.defaultTemplates.availableDataSources.map(x => x.protocol),
    availableDataSinks: configManager.defaultTemplates.availableDataSinks.map(x => x.protocol),
  };

  response.status(200).json(payload);
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
  // TODO Dont set default data sinks and sources here
  // configManager.setDataSources([request.body.dataSource]);
  // configManager.setDataSinks(request.body.dataSinks);
  configManager.saveConfig({ templates: { completed: true } });

  response.status(200).json(null);
}

export const templatesHandlers = {
  templatesGetHandler,
  templatesGetStatusHandler,
  templatesApplyPostHandler
};
