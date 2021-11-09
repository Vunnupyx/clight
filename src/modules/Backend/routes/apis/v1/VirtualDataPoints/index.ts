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
async function vdpsPostHandler(
  request: Request,
  response: Response
): Promise<void> {
  //TODO: Input validation
  const newData = { ...request.body, ...{ id: uuidv4() } };
  configManager.changeConfig('insert', 'virtualDataPoints', newData);
  await configManager.configChangeCompleted();
  response.status(200).json({
    created: newData,
    href: `/vdps/${newData.id}`
  });
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
async function vdpDeleteHandler(
  request: Request,
  response: Response
): Promise<void> {
  const vdp = configManager?.config?.virtualDataPoints.find(
    (point) => point.id === request.params.id
  );
  configManager.changeConfig('delete', 'virtualDataPoints', vdp.id);
  await configManager.configChangeCompleted();
  response.status(vdp ? 200 : 404).json({
    deleted: vdp
  });
}
/**
 * Overwrites a virtual datapoint
 * @param  {Request} request
 * @param  {Response} response
 */
async function vdpPatchHandler(
  request: Request,
  response: Response
): Promise<void> {
  configManager.changeConfig(
    'update',
    'virtualDataPoints',
    request.body,
    (vdp) => {
      return (vdp.id = request.body.id);
    }
  );
  await configManager.configChangeCompleted();
  response.status(200).json({
    changed: request.body,
    href: `/vdps/${request.body.id}`
  });
}

export const virtualDatapointHandlers = {
  vdpsGet: vdpsGetHandler,
  vdpsPost: vdpsPostHandler,
  vdpGet: vdpGetHandler,
  vdpDelete: vdpDeleteHandler,
  vdpPatch: vdpPatchHandler
};
