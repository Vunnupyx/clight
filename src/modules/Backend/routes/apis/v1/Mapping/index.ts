import { ConfigManager } from '../../../../../ConfigManager';
import { Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(config: ConfigManager) {
  configManager = config;
}

/**
 * Returns list of mapping
 */
function mappingGetHandler(request: Request, response: Response): void {
  response.status(200).json({
    mapping: configManager.config.mapping
  });
}

/**
 * Creates mapping
 */
function mapPostHandler(request: Request, response: Response): void {
  const config = configManager.config;
  const mapping = config.mapping;

  const map = { ...request.body, ...{ id: uuidv4() } };
  mapping.push(map);

  configManager.config = config;

  response.status(200).json(map);
}

/**
 * Updates mapping
 */
function mapPatchHandler(request: Request, response: Response): void {
  const mapping = configManager.config.mapping.find(x => x.id === request.params.mapId);

  if (!mapping) {
    response.status(404).json(null);
    return;
  }

  const newMapping = {
    ...mapping,
    ...request.body,
    id: request.params.mapId,
  };

  configManager.changeConfig('update', 'mapping', newMapping, item => item.id);

  response.status(200).json({
    changed: mapping
  });
}

/**
 * Deletes mapping
 */
function mapDeleteHandler(request: Request, response: Response): void {
  const config = configManager.config;

  const index = config.mapping.findIndex(
    (map) => map.id === request.params.mapId
  );

  if (index >= 0) {
    const dataPoint = config.mapping.find(
      (map) => map.id === request.params.mapId
    );
    config.mapping.splice(index, 1);
    configManager.config = config;

    response.status(200).json({
      deleted: dataPoint
    });

    return;
  }

  response.status(404).json(null);
}

/**
 * Returns specific mapping
 */
function mapGetHandler(request: Request, response: Response): void {
  const map = configManager.config.mapping.find(
    (map) => map.id === request.params.mapId
  );

  if (map) {
    response.status(200).json(map);

    return;
  }

  response.status(404).json(null);
}

export const mappingHandlers = {
  mappingsGet: mappingGetHandler,
  mapPost: mapPostHandler,
  mapPatch: mapPatchHandler,
  mapDelete: mapDeleteHandler,
  mapGet: mapGetHandler
};
