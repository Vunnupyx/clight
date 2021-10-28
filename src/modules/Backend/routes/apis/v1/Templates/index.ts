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
  const payload = configManager.defaultTemplates.templates.map((x) => ({
    ...x,
    dataSources: x.dataSources.map((y) => y.protocol),
    dataSinks: x.dataSinks.map((y) => y.protocol)
  }));

  response.status(200).json(payload);
}

/**
 * Returns the current status of the templates completion
 */
function templatesGetStatusHandler(request: Request, response: Response) {
  const completed = configManager.config.quickStart.completed;

  response.status(200).json({ completed });
}

/**
 * Handle POST apply templates request
 */
function templatesApplyPostHandler(request: Request, response: Response): void {
  if (
    !request.body.templateId ||
    !request.body.dataSources?.length ||
    !request.body.dataSinks?.length
  ) {
    response.status(400).json({ message: 'Invalid Body' });
    return;
  }

  configManager.applyTemplate(
    request.body.templateId,
    request.body.dataSources,
    request.body.dataSinks
  );

  response.status(200).json(null);
}

/**
 * Handle POST skip templates request
 */
function templatesSkipPostHandler(request: Request, response: Response): void {
  configManager.config = {
    ...configManager.config,
    quickStart: {
      completed: true
    }
  };

  response.status(200).json(null);
}

export const templatesHandlers = {
  templatesGetHandler,
  templatesGetStatusHandler,
  templatesApplyPostHandler,
  templatesSkipPostHandler
};
