import { ConfigManager } from '../../../../../ConfigManager';
import { Response, Request } from 'express';
import {
  IDataPointMapping,
  isDataPointMapping
} from '../../../../../ConfigManager/interfaces';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 * @param {ConfigManager} config
 */
export function setConfigManager(config: ConfigManager) {
  configManager = config;
}

/**
 * Returns list of mapping
 * @param  {Request} request
 * @param  {Response} response
 */
function getAllMappingsHandler(request: Request, response: Response): void {
  response.status(200).json({
    //should already not have orphan mappings but just in case use checkAndCleanupMappings
    mapping: configManager.getConfigWithCleanedMappings(configManager.config)
      ?.mapping
  });
}

/**
 * Creates single mapping
 * @param  {Request} request
 * @param  {Response} response
 */
async function postSingleMappingHandler(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const newMapping = request.body as IDataPointMapping;

    if (!isDataPointMapping(newMapping)) {
      throw new Error();
    }

    configManager.config = {
      ...(configManager.config ?? {}),
      mapping: [...configManager.config?.mapping, newMapping]
    };
    await configManager.configChangeCompleted();

    response.status(200).json(newMapping);
  } catch {
    response
      .status(400)
      .json({ error: 'Cannot create new mapping. Try again!' });
  }
}

/**
 * Replaces all mappings
 * @param  {Request} request
 * @param  {Response} response
 */
async function patchAllMappingsHandler(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const newMappings = request.body as IDataPointMapping[];

    if (!newMappings.every(isDataPointMapping)) {
      throw new Error();
    }

    configManager.config = {
      ...(configManager.config ?? {}),
      mapping: newMappings
    };
    await configManager.configChangeCompleted();

    response.status(200).send();
  } catch {
    response.status(400).json({ error: 'Cannot change mappings. Try again!' });
  }
}

/**
 * Updates single mapping
 * @param  {Request} request
 * @param  {Response} response
 */
async function patchSingleMappingHandler(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const mapping = configManager.config?.mapping?.find(
      (x) => x.id === request.params.mapId
    );

    if (!mapping) {
      response.status(404).json(null);
      return;
    }
    const newMapping = request.body as IDataPointMapping;

    if (!isDataPointMapping(newMapping)) {
      throw new Error();
    }
    const updatedMapping: IDataPointMapping = {
      ...mapping,
      ...newMapping,
      id: request.params.mapId
    };

    configManager.changeConfig<'mapping', IDataPointMapping>(
      'update',
      'mapping',
      updatedMapping,
      (item) => item.id
    );
    await configManager.configChangeCompleted();

    response.status(200).json({
      changed: mapping
    });
  } catch {
    response.status(400).json({ error: 'Cannot change mapping. Try again!' });
  }
}

/**
 * Deletes single mapping
 * @param  {Request} request
 * @param  {Response} response
 */
async function deleteSingleMappingHandler(
  request: Request,
  response: Response
): Promise<void> {
  const config = configManager.config;

  const index = config?.mapping?.findIndex(
    (map) => map.id === request.params.mapId
  );

  if (index >= 0) {
    const dataPoint = config.mapping.find(
      (map) => map.id === request.params.mapId
    );
    config.mapping.splice(index, 1);
    configManager.config = config;
    await configManager.configChangeCompleted();

    response.status(200).json({
      deleted: dataPoint
    });

    return;
  }

  response.status(404).json(null);
}

/**
 * Returns single mapping
 * @param  {Request} request
 * @param  {Response} response
 */
function getSingleMappingHandler(
  request: Request,
  response: Response
): Promise<void> {
  const map = configManager.config?.mapping?.find(
    (map) => map.id === request.params.mapId
  );
  response.status(map ? 200 : 404).json(map);

  return Promise.resolve();
}

export const mappingHandlers = {
  //Single mapping
  mapPost: postSingleMappingHandler,
  mapPatch: patchSingleMappingHandler,
  mapDelete: deleteSingleMappingHandler,
  mapGet: getSingleMappingHandler,
  //Multiple mappings
  mappingsGet: getAllMappingsHandler,
  patchMappings: patchAllMappingsHandler
};
