import { ConfigManager } from "../../../../../ConfigManager";
import {Request, Response } from 'express';
import { ConsoleTransportOptions } from "winston/lib/winston/transports";

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManger(config: ConfigManager) {
    configManager = config;
}

/**
 * Returns all data from config.general section
 */
function deviceInfosGetHandler (request: Request, response: Response): void {
    response.status(200).json(configManager?.config?.general);
}

/**
 * Update all properties provided by the request body.
 */
function deviceInfosPatchHandler (request: Request, response: Response): void {
    console.log(`MARKUS`);
    const newData = {...configManager.config.general, ...request.body};
    console.log(newData);
    configManager.changeConfig('update', 'general', newData);
    response.status(200).json(newData);
}

export const deviceInfosHandlers = {
    deviceInfosGet: deviceInfosGetHandler,
    deviceInfosPatch: deviceInfosPatchHandler
}