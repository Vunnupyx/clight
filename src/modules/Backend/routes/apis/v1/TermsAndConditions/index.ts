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
 * Gets Terms and Conditions
 * @param  {Request} request
 * @param  {Response} response
 */
async function termsAndConditionsGetHandler(
  request: Request,
  response: Response
): Promise<void> {
  response.status(200).json({
    text: await configManager.getTermsAndConditions(
      request.query.lang as string
    ),
    accepted: configManager.config.termsAndConditions.accepted
  });
}

/**
 * Accepts Terms and Conditions
 * @param  {Request} request
 * @param  {Response} response
 */
async function termsAndConditionsPostHandler(
  request: Request,
  response: Response
): Promise<void> {
  await configManager.saveConfig({
    termsAndConditions: { accepted: request.body.accepted }
  });

  await configManager.configChangeCompleted();

  response.status(200).send();
}

export const termsAndConditionsHandlers = {
  termsAndConditionsGet: termsAndConditionsGetHandler,
  termsAndConditionsPost: termsAndConditionsPostHandler
};
