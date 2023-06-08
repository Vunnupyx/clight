import { ConfigManager } from '../../../../../ConfigManager';
import { Request, Response } from 'express';

let configManager: ConfigManager;

/**
 * Set ConfigManager to make accessible for local function
 */
export function setConfigManager(config: ConfigManager): void {
  configManager = config;
}

/**
 * Gets Terms and Conditions
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
  termsAndConditionsGetHandler,
  termsAndConditionsPostHandler
};
