import { ConfigManager } from '../../../../../ConfigManager';
import { Request, Response } from 'express';
import { VirtualDataPointManager } from '../../../../../VirtualDataPointManager';
import {
  isValidVdp,
  IVirtualDataPointConfig
} from '../../../../../ConfigManager/interfaces';

let configManager: ConfigManager;
let vdpManager: VirtualDataPointManager;

/**
 * Set ConfigManager to make accessible for local function
 * @param  {ConfigManager} config
 */
export function setConfigManager(config: ConfigManager) {
  configManager = config;
}

export function setVdpManager(config: VirtualDataPointManager) {
  vdpManager = config;
}

/**
 * Return a list of virtual datapoints
 * @param  {Request} request
 * @param  {Response} response
 */
function getAllVdpsHandler(request: Request, response: Response): void {
  const vdps = configManager?.config?.virtualDataPoints || [];
  response.status(200).json({ vdps });
}

/**
 * Create a new virtual datapoint
 * @param  {Request} request
 * @param  {Response} response
 */
async function postSingleVdpHandler(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const newVdp = request.body as IVirtualDataPointConfig;

    if (!isValidVdp(newVdp)) {
      throw new Error();
    }
    if (
      newVdp.operationType === 'counter' &&
      newVdp.resetSchedules?.length > 0
    ) {
      for (const [index, resetEntry] of newVdp.resetSchedules.entries()) {
        newVdp.resetSchedules[index].created = Date.now();
        newVdp.resetSchedules[index].lastReset = undefined;
      }
    }
    configManager.changeConfig('insert', 'virtualDataPoints', newVdp);
    await configManager.configChangeCompleted();
    response.status(200).json({
      created: newVdp,
      href: `/vdps/${newVdp.id}`
    });
  } catch {
    response.status(400).json({
      error: 'Could not create VDP. Please check your input and try again!'
    });
  }
}

/**
 * Bulk changes vdps
 * @param  {Request} request
 * @param  {Response} response
 */
async function patchAllVdpsHandler(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const newVdpArray = request.body as IVirtualDataPointConfig[];

    if (!newVdpArray.every(isValidVdp)) {
      throw new Error();
    }

    configManager.config = {
      ...configManager.config,
      virtualDataPoints: newVdpArray
    };
    await configManager.configChangeCompleted();

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
function getSingleVdpHandler(request: Request, response: Response): void {
  const vdp = configManager?.config?.virtualDataPoints?.find(
    (point) => point.id === request.params.id
  );
  response.status(vdp ? 200 : 404).json(vdp);
}
/**
 * Delete a vdp by selected id
 * @param  {Request} request
 * @param  {Response} response
 */
async function deleteSingleVdpHandler(
  request: Request,
  response: Response
): Promise<void> {
  const vdp = configManager?.config?.virtualDataPoints?.find(
    (point) => point.id === request.params.id
  );
  configManager.changeConfig('delete', 'virtualDataPoints', vdp.id);
  await configManager.configChangeCompleted();
  response.status(vdp ? 200 : 404).json({
    deleted: vdp
  });
}
/**
 * Overwrites a single virtual datapoint
 * @param  {Request} request
 * @param  {Response} response
 */
async function patchSingleVdpHandler(
  request: Request,
  response: Response
): Promise<void> {
  try {
    if (request.body.reset && request.params.id) {
      vdpManager.resetCounter(request.params.id);
      delete request.body.reset;
    } else {
      const newVdp = request.body as IVirtualDataPointConfig;

      if (!isValidVdp(newVdp)) {
        throw new Error();
      }
      configManager.changeConfig(
        'update',
        'virtualDataPoints',
        newVdp,
        (vdp) => {
          return (vdp.id = newVdp.id);
        }
      );
      await configManager.configChangeCompleted();
    }
    response.status(200).json({
      changed: request.body,
      href: `/vdps/${request.body.id}`
    });
  } catch {
    response.status(400).json({ error: 'Cannot change VDP. Try again!' });
  }
}

export const virtualDatapointHandlers = {
  //Single VDP
  vdpPost: postSingleVdpHandler,
  vdpGet: getSingleVdpHandler,
  vdpDelete: deleteSingleVdpHandler,
  vdpPatch: patchSingleVdpHandler,
  //Multiple VDPs
  vdpsGet: getAllVdpsHandler,
  vdpsPatch: patchAllVdpsHandler
};
