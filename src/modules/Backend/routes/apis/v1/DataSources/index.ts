
/**
 * All request handlers for requests to datasource endpoints
 */

import { ConfigManager } from "../../../../../ConfigManager";
import { Request, Response } from 'express';
import winston from "winston";
import { Console } from "console";
import { config } from "process";
import { DataSource } from "../../../../../DataSource/DataSource";
import { json } from "stream/consumers";

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(manager: ConfigManager) {
    configManager = manager;
}
 
/**
 * Handle all requests for the list of datasources.
 */
function dataSourcesGetHandler (request: Request, response: Response): void {
    response.status(200).json({dataSources: configManager?.config?.dataSources || []});
}

/**
 * Handle all get requests for a specific datasource.
 */
function dataSourceGetHandler (request: Request, response: Response): void {
    const dataSource = configManager.config.dataSources.find((source) => source.id === request.params.datasourceId);
    response.status(dataSource ? 200 : 404).json(dataSource);
}

/**
 * Handle all patch requests for modifying a specific datasource.
 * Only enabling and disabling is allowed.
 */
function dataSourcePatchHandler (request: Request, response: Response): void {
    const allowed = ['connection', 'enabled'];
    
    const dataSource = configManager.config.dataSources.find((source) => source.id === request.params.datasourceId);
    if(!dataSource) {
        winston.warn(``); // TODO: Define warning;
        response.status(404).send();
    }
    Object.keys(request.body).forEach((entry) => {
        if(!allowed.includes(entry)) {
            winston.warn(`dataSourcePatchHandler tried to change property: ${entry}. Not allowed`)
            response.status(403).json({
                error: `Not allowed to change ${entry}`
            })
        }
    });
    const changedDatasource = {...dataSource, ...request.body};
    configManager.changeConfig('update', 'dataSources', changedDatasource );
    response.status(200).json(changedDatasource);
}

function dataSourcesGetDatapointsHandler (request: Request, response: Response): void {
    const dataSource = configManager.config.dataSources.find((source) => source.id === request.params.datasourceId);
    response.status(dataSource ? 200 : 404).json({
        dataPoints: dataSource.dataPoints
    })
}

function dataSourcesPostDatapointHandler (request: Request, response: Response): void {
    //TODO: Inputvaidlation
    const dataSource = configManager.config.dataSources.find((source) => source.id === request.params.datasourceId);
    dataSource.dataPoints.push(request.body)
    configManager.changeConfig('update', 'dataSources', dataSource)
    response.status(200).send();
 }

function dataSourcesGetDatapointHandler (request: Request, response: Response): void {
    const dataSource = configManager.config.dataSources.find((source) => source.id === request.params.datasourceId);
    const point = dataSource?.dataPoints?.find((point) => point.id === request.params.datapointId)
    response.status(dataSource && point ? 200 : 404).json(point);
 }

 function dataSourcesDeleteDatapointHandler (request: Request, response: Response): void {
    const dataSource = configManager.config.dataSources.find((source) => source.id === request.params.datasourceId);
    const index = dataSource?.dataPoints?.findIndex((point) => point.id === request.params.datapointId)
    console.log(index);
    console.log(dataSource);
    const point = dataSource?.dataPoints[index];
    console.log(point);
    if (index >= 0) {
        dataSource.dataPoints.splice(index, 1);
        configManager.changeConfig('update', 'dataSources', dataSource);
    }
    response.status(dataSource && point ? 200 : 404).json(dataSource && index >=0 ? {deleted: point} : null);
 }
 function dataSourcesPatchDatapointHandler (request: Request, response: Response): void { 
     //TODO: Input validation
     console.log(`Markus`);
    const dataSource = configManager.config.dataSources.find((source) => source.id === request.params.datasourceId);
    const index = dataSource?.dataPoints?.findIndex((point) => point.id === request.params.datapointId)
    if(dataSource && index >= 0) {
        dataSource.dataPoints.splice(index, 1);
        dataSource.dataPoints.push(request.body);
        configManager.changeConfig('update', 'dataSources', dataSource)
        response.status(200).json({
            changed: request.body,
            href: `/api/v1/datasources/${request.params.datasourceId}/dataPoints/${request.body.id}`
        })
    }
    response.status(404).send();
 }

export const dataSourceHandlers = {
    dataSourcesGet: dataSourcesGetHandler,
    dataSourceGet: dataSourceGetHandler,
    dataSourcePatch: dataSourcePatchHandler,
    dataSourcesGetDatapoints: dataSourcesGetDatapointsHandler,
    dataSourcesPostDatapoint: dataSourcesPostDatapointHandler,
    dataSourcesGetDatapoint: dataSourcesGetDatapointHandler,
    dataSourcesDeleteDatapoint: dataSourcesDeleteDatapointHandler,
    dataSourcesPatchDatapoint: dataSourcesPatchDatapointHandler
}