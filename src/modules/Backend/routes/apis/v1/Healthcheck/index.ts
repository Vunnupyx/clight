import { Request, Response } from 'express';

/**
 * Get System Info
 * @param  {Request} request
 * @param  {Response} response
 */
async function healthCheckGetHandler(request: Request, response: Response) {
  response.status(204).send();
}

export const healthCheckHandlers = {
  healthCheckGet: healthCheckGetHandler
};
