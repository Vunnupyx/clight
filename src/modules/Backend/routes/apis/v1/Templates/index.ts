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
export function setConfigManager(manager: ConfigManager): void {
  configManager = manager;
}

/**
 * Set dataSourcesManager to make accessible for local function
 */
export function setDataSourcesManager(manager: DataSourcesManager): void {
  dataSourcesManager = manager;
}

/**
 * Set dataSinksManager to make accessible for local function
 */
export function setDataSinksManager(manager: DataSinksManager): void {
  dataSinksManager = manager;
}

/**
 * Handle all requests for the list of templates.
 */
function templatesGetHandler(request: Request, response: Response): void {
  const payload = {
    templates: configManager.defaultTemplates?.templates,
    currentTemplate: configManager.config?.quickStart?.currentTemplate,
    currentTemplateName: configManager.config?.quickStart?.currentTemplateName
  };

  response.status(200).json(payload);
}

/**
 * Returns the current status of the templates completion
 */
function templatesGetStatusHandler(request: Request, response: Response) {
  const { completed, currentTemplate, currentTemplateName } =
    configManager.config?.quickStart;

  response
    .status(200)
    .json({ completed, currentTemplate, currentTemplateName });
}

/**
 * Handle POST apply templates request
 */
async function templatesApplyPostHandler(
  request: Request,
  response: Response
): Promise<void> {
  if (!request.body.templateId) {
    response.status(400).json({ message: 'Invalid Body' });
    return;
  }

  configManager.applyTemplate(request.body.templateId);
  await configManager.configChangeCompleted();

  response.status(200).json(null);
}

/**
 * Handle POST skip templates request
 */
async function templatesSkipPostHandler(
  request: Request,
  response: Response
): Promise<void> {
  configManager.config = {
    ...(configManager.config ?? {}),
    quickStart: {
      completed: true,
      currentTemplate: configManager.config?.quickStart?.currentTemplate,
      currentTemplateName: configManager.config?.quickStart?.currentTemplateName
    }
  };

  await configManager.configChangeCompleted();

  response.status(200).json(null);
}

export const templatesHandlers = {
  templatesGetHandler,
  templatesGetStatusHandler,
  templatesApplyPostHandler,
  templatesSkipPostHandler
};
