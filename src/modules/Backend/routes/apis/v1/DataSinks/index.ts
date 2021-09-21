import { ConfigManager } from "../../../../../ConfigManager";
import {Response, Request } from 'express';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(config: ConfigManager) {
    configManager = config;
}

/**
 * Returns list of datasinks
 */
function dataSinksGetHandler(request: Request, response: Response): void {
    response.status(200).json({
        dataSinks: configManager.config.dataSinks
    })
}
/**
 * Return single datasink resource selected by id
 */
function dataSinkGetHandler(request, response): void {
    const dataSink = configManager.config.dataSinks.find((sink) => sink.protocol === request.params.datasinkProtocol);
    response.status(dataSink ? 200 : 404).json(dataSink);
}

export const dataSinksHandlers = {
    dataSinksGet: dataSinksGetHandler,
    dataSinkGet: dataSinkGetHandler
}