import { ConfigManager } from '../../../../../ConfigManager';
import { Request, response, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(config: ConfigManager) {
  configManager = config;
}
/**
 * Return a list of virtual datapoints
 */
function vdpsGetHandler(req: Request, res: Response): void {
  res
    .status(200)
    .json({ vdps: configManager?.config?.virtualDataPoints || [] });
}

/**
 * Create a new virtual datapoint
 */
function vdpsPostHandler(req: Request, res: Response): void {
  //TODO: Input validation
  const newData = { ...req.body, ...{ id: uuidv4() } };
  configManager.changeConfig('insert', 'virtualDataPoints', newData);
  res.status(200).json({
    created: newData,
    href: `/vdps/${newData.id}`
  });
}

/**
 * Get a virtual datapoint selected by id
 */
function vdpGetHandler(req: Request, res: Response): void {
  const vdp = configManager?.config?.virtualDataPoints.find(
    (point) => point.id === req.params.id
  );
  res.status(vdp ? 200 : 404).json(vdp);
}
/**
 * Delete a vdp by selected id
 */
function vdpDeleteHandler(req: Request, res: Response): void {
  const vdp = configManager?.config?.virtualDataPoints.find(
    (point) => point.id === req.params.id
  );
  configManager.changeConfig('delete', 'virtualDataPoints', vdp.id);
  res.status(vdp ? 200 : 404).json({
    deleted: vdp
  });
}
/**
 * Overwrites a virtual datapoint
 */
function vdpPatchHandler(req: Request, res: Response): void {
  const vdp = configManager?.config?.virtualDataPoints.find(
    (point) => point.id === req.params.id
  );
  configManager.changeConfig('delete', 'virtualDataPoints', vdp.id);
  const newData = { ...req.body, ...{ id: uuidv4() } };
  configManager.changeConfig('insert', 'virtualDataPoints', newData);
  res.status(200).json({
    changed: newData,
    href: `/vdps/${newData.id}`
  });
}

export const virtualDatapointHandlers = {
  vdpsGet: vdpsGetHandler,
  vdpsPost: vdpsPostHandler,
  vdpGet: vdpGetHandler,
  vdpDelete: vdpDeleteHandler,
  vdpPatch: vdpPatchHandler
};
