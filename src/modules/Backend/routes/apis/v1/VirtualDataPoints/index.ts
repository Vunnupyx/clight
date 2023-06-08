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
 */
export function setConfigManager(config: ConfigManager): void {
  configManager = config;
}

export function setVdpManager(config: VirtualDataPointManager): void {
  vdpManager = config;
}

/**
 * Return a list of virtual datapoints
 */
function getAllVdpsHandler(request: Request, response: Response): void {
  const vdpsList = configManager?.config?.virtualDataPoints || [];
  const vdpValidityStatus = vdpManager.getVdpValidityStatus(vdpsList);

  response.status(200).json({
    vdps: vdpsList,
    error: vdpValidityStatus.error,
    vdpIdWithError: vdpValidityStatus.vdpIdWithError,
    notYetDefinedSourceVdpId: vdpValidityStatus.notYetDefinedSourceVdpId
  });
}

/**
 * Bulk changes vdps
 */
async function patchAllVdpsHandler(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const newVdpArray = request.body as IVirtualDataPointConfig[];

    const vdpValidityStatus = vdpManager.getVdpValidityStatus(newVdpArray);
    if (!vdpValidityStatus.isValid) {
      response.status(400).json({
        error: vdpValidityStatus.error,
        vdpIdWithError: vdpValidityStatus.vdpIdWithError,
        notYetDefinedSourceVdpId: vdpValidityStatus.notYetDefinedSourceVdpId
      });
    }

    configManager.config = {
      ...configManager.config,
      virtualDataPoints: newVdpArray
    };
    await configManager.configChangeCompleted();

    response.status(200).send();
  } catch (err) {
    response.status(400).json({ error: 'unexpectedError' });
  }
}

/**
 * Overwrites a single virtual datapoint
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
      changed: request.body
    });
  } catch {
    response.status(400).json({ error: 'Cannot change VDP. Try again!' });
  }
}

export const virtualDatapointHandlers = {
  //Single VDP
  patchSingleVdpHandler,
  //Multiple VDPs
  getAllVdpsHandler,
  patchAllVdpsHandler
};
