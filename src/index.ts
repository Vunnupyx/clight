import winston from 'winston';
import { Logger } from './modules/Logger';
import { BootstrapManager } from './modules/BootstrapManager';
import { System } from './modules/System';

Logger.init();

/**
 * Reads CELOS version asynchronously to avoid blocking runtime
 */
async function readCosVersion() {
  const osVersion = await new System().readOsVersion();
  winston.error(`COS version: ${osVersion}`);
}

async function main() {
  winston.error('MDC Flex starting...');
  winston.error(
    `MDC Flex runtime version: ${process.env.MDC_LIGHT_RUNTIME_VERSION}`
  );
  readCosVersion();

  const bootstrapManager = new BootstrapManager();
  bootstrapManager.start();

  winston.error('MDC Flex started');
}
main();
