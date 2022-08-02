import winston from 'winston';
import { Logger } from './modules/Logger';
import { BootstrapManager } from './modules/BootstrapManager';
import { System } from './modules/System';

Logger.init();

winston.error('MDC light starting...');
winston.error(
  `MDC Flex runtime version: ${process.env.MDC_LIGHT_RUNTIME_VERSION}`
);
winston.error(`MDC Flex OS version: ${new System().readOsVersion()}`);

const bootstrapManager = new BootstrapManager();
bootstrapManager.start();

winston.error('MDC light started');
