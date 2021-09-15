import { ConfigManager } from "../../../../../ConfigManager"

let configManager: ConfigManager;

export function setConfigManger(config: ConfigManager) {
    configManager = config;
}

//TODO: Refactor -> One Handler for all Get calls !!!
function dataPointsGetHandler (request, response) {
    response.status(200).json({dataPoints: configManager?.config?.dataPoints});
}

function dataPointGetHandler (request, response) {
    const dataPoint = configManager?.config?.dataPoints.find((datapoint) => datapoint.id === request.params.id)
    response.status(dataPoint ? 200 : 404).json(dataPoint);
}

function dataPointsPostHandler (request, response) {
    configManager?.updateConfig('dataPoints', request.body);
    response.status(200).json();
}
function dataPointPatchHandler (request, response) {}
function dataPointDeleteHandler (request, response) {
    configManager?.updateConfig('dataPoints', request.params.id);
    response.status(200).json();
}

export const dataPointsHandlers = {
    dataPointsGet: dataPointsGetHandler,
    dataPointsPost: dataPointsPostHandler,
    dataPointPatch: dataPointPatchHandler,
    dataPointDelete: dataPointDeleteHandler,
    dataPointGet: dataPointGetHandler,
}