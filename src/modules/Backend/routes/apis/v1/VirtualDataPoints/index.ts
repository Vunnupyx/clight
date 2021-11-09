import { ConfigManager } from '../../../../../ConfigManager';
import { Request, response, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 * @param  {ConfigManager} config
 */
export function setConfigManager(config: ConfigManager) {
  configManager = config;
}

/**
 * Return a list of virtual datapoints
 * @param  {Request} request
 * @param  {Response} response
 */
function vdpsGetHandler(request: Request, response: Response): void {
  response
    .status(200)
    .json({ vdps: configManager?.config?.virtualDataPoints || [] });
}

/**
 * Create a new virtual datapoint
 * @param  {Request} request
 * @param  {Response} response
 */
function vdpsPostHandler(request: Request, response: Response): void {
  //TODO: Input validation
  const newData = { ...request.body, ...{ id: uuidv4() } };
  configManager.changeConfig('insert', 'virtualDataPoints', newData);
  response.status(200).json({
    created: newData,
    href: `/vdps/${newData.id}`
  });
}

/**
 * Bulk changes vdps
 * @param  {Request} request
 * @param  {Response} response
 */
async function vdpsPostBulkHandler(
  request: Request,
  response: Response
): Promise<void> {
  try {
    await configManager.bulkChangeVirtualDataPoints(request.body || {});

    response.status(200).send();
  } catch {
    response.status(400).json({ error: 'Cannot change VDPs. Try again!' });
  }
}

/**
 * Get a virtual datapoint selected by id
 * @param  {Request} request
 * @param  {Response} response
 */
function vdpGetHandler(request: Request, response: Response): void {
  const vdp = configManager?.config?.virtualDataPoints.find(
    (point) => point.id === request.params.id
  );
  response.status(vdp ? 200 : 404).json(vdp);
}
/**
 * Delete a vdp by selected id
 * @param  {Request} request
 * @param  {Response} response
 */
function vdpDeleteHandler(request: Request, response: Response): void {
  const vdp = configManager?.config?.virtualDataPoints.find(
    (point) => point.id === request.params.id
  );
  configManager.changeConfig('delete', 'virtualDataPoints', vdp.id);
  response.status(vdp ? 200 : 404).json({
    deleted: vdp
  });
}
/**
 * Overwrites a virtual datapoint
 * @param  {Request} request
 * @param  {Response} response
 */
function vdpPatchHandler(request: Request, response: Response): void {
  const vdp = configManager?.config?.virtualDataPoints.find(
    (point) => point.id === request.params.id
  );
  configManager.changeConfig('delete', 'virtualDataPoints', vdp.id);
  const newData = { ...request.body, ...{ id: uuidv4() } };
  configManager.changeConfig('insert', 'virtualDataPoints', newData);
  response.status(200).json({
    changed: newData,
    href: `/vdps/${newData.id}`
  });
}

export const virtualDatapointHandlers = {
  vdpsGet: vdpsGetHandler,
  vdpsPost: vdpsPostHandler,
  vdpsPostBulk: vdpsPostBulkHandler,
  vdpGet: vdpGetHandler,
  vdpDelete: vdpDeleteHandler,
  vdpPatch: vdpPatchHandler
};
