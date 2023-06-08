import { Request, Response } from 'express';

const startUpTime = Date.now();

/**
 * Get System Info
 */
function healthCheckGetHandler(request: Request, response: Response): void {
  response.status(200).json({
    startUpTime
  });
}

export const healthCheckHandlers = {
  healthCheckGetHandler
};
