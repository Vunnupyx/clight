import { ConfigManager } from "../../../../../ConfigManager";
import {Request, Response } from 'express';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManger(config: ConfigManager) {
    configManager = config;
}
/**
 * Return a list of virtual datapoints
 */
function vdpsGetHandler (req: Request, res: Response): void {
    res.status(200).json({vdps: configManager?.config?.virtualDataPoints || []})
}

/**
 * Create a new virtual datapoint
 */
function vdpsPostHandler (req: Request, res: Response): void {
    //TODO: Input validation
    configManager.changeConfig('insert', 'virtualDataPoints', req.body)
}

/**
 * Get a virtual datapoint selected by id
 */
function vdpGetHandler (req: Request, res: Response): void {
    const vdp = configManager?.config?.virtualDataPoints.find((point) => point.id === req.params.id);
    res.status(vdp ? 200 : 404).json(vdp);
}
/**
 * Delete a vdp by selected id
 */
function vdpDeleteHandler (req: Request, res: Response): void {
    const vdp = configManager?.config?.virtualDataPoints.find((point) => point.id === req.params.id);
    configManager.changeConfig('delete', 'virtualDataPoints', vdp.id);
    res.status(vdp ? 200 : 404).send();
}
/**
 * Overwrites a virtual datapoint
 */
function vdpPatchHandler (req: Request, res: Response): void {
    const vdp = configManager?.config?.virtualDataPoints.find((point) => point.id === req.params.id);
    configManager.changeConfig('delete', 'virtualDataPoints', vdp.id);
    configManager.changeConfig('insert', 'virtualDataPoints', req.params.body);
}

export const virtualDatapointHandlers = {
    vdpsGet: vdpsGetHandler,
    vdpsPost: vdpsPostHandler,
    vdpGet: vdpGetHandler,
    vdpDelete: vdpDeleteHandler,
    vdpPatch: vdpPatchHandler
}