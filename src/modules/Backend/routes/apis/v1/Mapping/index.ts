import { ConfigManager } from '../../../../../ConfigManager';
import { Response, Request } from 'express';
import {
  IDataPointMapping,
  isDataPointMapping
} from '../../../../../ConfigManager/interfaces';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(config: ConfigManager): void {
  configManager = config;
}

/**
 * Returns list of mapping
 */
function getAllMappingsHandler(request: Request, response: Response): void {
  response.status(200).json({
    //should already not have orphan mappings but just in case use checkAndCleanupMappings
    mapping: configManager.getConfigWithCleanedMappings(configManager.config)
      ?.mapping
  });
}

/**
 * Replaces all mappings
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

export const mappingHandlers = {
  //Multiple mappings
  getAllMappingsHandler,
  patchAllMappingsHandler
};
