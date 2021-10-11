import { Request, Response } from 'express';

import { ConfigManager } from '../../../../../ConfigManager';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(config: ConfigManager) {
    configManager = config;
}

function systemInfoGetHandler(request: Request, response: Response) {
    response.status(200).json(configManager.config.systemInfo);
}

export const systemInfoHandlers = {
    systemInfoGet: systemInfoGetHandler,
}
