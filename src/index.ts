import winston from "winston";
import { ConfigManager } from "./modules/ConfigManager";
import { EventBus } from "./modules/EventBus";
import { Logger } from "./modules/Logger";
import { MTCAdapter } from "./modules/MTCAdapter";
import { Event } from "./modules/MTCAdapter/DataItem";
import { BootstrapManager } from "./modules/BootstrapManager";

Logger.init();

winston.info("MDC light starting...");

const bootstrapManager = new BootstrapManager();
bootstrapManager.launch();

winston.info("MDC light started");

winston.info("Starting mtc adapter...");
const mockEventBus = new EventBus<null>();
const config = new ConfigManager({
  errorEventsBus: mockEventBus,
  lifecycleEventsBus: mockEventBus,
});
const adapter = new MTCAdapter(config);

const avail = new Event("avail");
adapter.addDataItem(avail);
avail.value = "AVAILABLE";

const estop = new Event("estop");
adapter.addDataItem(estop);
estop.value === "ARMED";

const updateDataItems = () => {
  if (estop.value === "TRIGGERED") estop.value = "ARMED";
  else estop.value = "TRIGGERED";

  adapter.sendChanged();

  setTimeout(updateDataItems, 60000);
};

adapter.start();
updateDataItems();
