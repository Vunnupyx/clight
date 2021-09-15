import { ConfigManager } from "../../../../../ConfigManager";

let configManager;

export function setConfigManger(config: ConfigManager) {
    configManager = config;
}

function backupGetHandle(request, response): void {
    response.status(200).
}

function backupPostHandle(request, response): void {

}

export const backupHandlers = {
    backupGet: backupGetHandle,
    backupPost: backupPostHandle
}