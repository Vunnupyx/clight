import winston from "winston";
import Config from "./modules/Config";
import Logger from "./modules/Logger";
import MTCAdapter from "./modules/MTCAdapter";
import { Event } from "./modules/MTCAdapter/DataItem";

Logger.init();

const config = new Config();

winston.info("MDC light started");

winston.info("Starting mtc adapter...");
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
