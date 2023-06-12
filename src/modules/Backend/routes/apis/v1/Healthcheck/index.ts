import { Request, Response } from 'express';
import { ConfigManager } from '../../../../../ConfigManager';

const startUpTime = Date.now();

/**
 * Get System Info
 * @param  {Request} request
 * @param  {Response} response
 */
async function healthCheckGetHandler(request: Request, response: Response) {
  response.status(200).json({
    startUpTime
  });
}

export const healthCheckHandlers = {
  healthCheckGet: healthCheckGetHandler
};
