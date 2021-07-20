import { IErrorEvent, ILifecycleEvent } from "../../common/interfaces";
import { EventBus } from "../EventBus";

export interface IRuntimeConfig {
  mtconnect: IMTCConfig;
}

export interface IMTCConfig {
  listenerPort: number;
}

export interface IDataPointConfig {
  id: string;
  name: string;
  address: string;
  readFrequency: number;
}

export interface IDataSourceConfig {
  id: string;
  name: string;
  dataPoints: IDataPointConfig[];
  protocol: string;
  connection: {
    ipAddr: string;
    port: number;
    rack: number;
    slot: number;
  };
}

export interface IConfig {
  datasources: IDataSourceConfig[];
}

export interface IConfigManagerParams {
  errorEventsBus: EventBus<IErrorEvent>;
  lifecycleEventsBus: EventBus<ILifecycleEvent>;
}
