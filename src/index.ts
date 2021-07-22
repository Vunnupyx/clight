import winston from "winston";
import { Logger } from "./modules/Logger";
import { BootstrapManager } from "./modules/BootstrapManager";

Logger.init();

winston.info("MDC light starting...");

const bootstrapManager = new BootstrapManager();
bootstrapManager.launch();

winston.info("MDC light started");
