import winston from "winston";
import Logger from "./modules/Logger";
import MTCAdapter from "./modules/MTCAdapter";
import { Event } from "./modules/MTCAdapter/DataItem";
require("dotenv").config();

Logger.init();

winston.info("MDC light started");

winston.info("Starting mtc adapter...");
const adapter = new MTCAdapter();

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

  setTimeout(updateDataItems, 5000);
};

adapter.start();
updateDataItems();
