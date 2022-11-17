import winston from 'winston';
import { Logger } from './modules/Logger';
import { BootstrapManager } from './modules/BootstrapManager';
import { System } from './modules/System';

Logger.init();

async function main() {
  winston.error('MDC Flex starting...');
  winston.error(
    `MDC Flex runtime version: ${process.env.MDC_LIGHT_RUNTIME_VERSION}`
  );
  const osVersion = await new System().readOsVersion();

  const bootstrapManager = new BootstrapManager();
  bootstrapManager.start();

  winston.error('MDC Flex started');
}
main();
