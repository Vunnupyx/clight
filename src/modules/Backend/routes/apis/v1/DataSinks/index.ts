import { ConfigManager } from "../../../../../ConfigManager";

let configManager: ConfigManager;

export function setConfigManager(config: ConfigManager) {
    configManager = config;
}

function dataSinksGetHandler(request, response): void {
    response.status(200).json({
        dataSinks: configManager.config.dataSinks
    })
}

function dataSinkGetHandler(request, response): void {
    const dataSink = configManager.config.dataSinks.find((sink) => sink.id === request.params.id);
    response.status(dataSink ? 200 : 404).json(dataSink);
}
export const dataSinksHandlers = {
    dataSinksGet: dataSinksGetHandler,
    dataSinkGet: dataSinkGetHandler
}