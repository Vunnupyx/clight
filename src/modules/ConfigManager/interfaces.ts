import { IErrorEvent, ILifecycleEvent } from "../../common/interfaces";
import { EventBus } from "../EventBus";

export interface IRuntimeConfig {
  mtconnect: IMTConnectConfig;
}

export interface IMTConnectConfig {
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

type MTConnectDataPointTypes = "event";
export interface IDataSinkDataPointConfig {
  id: string;
  name: string;
  type: MTConnectDataPointTypes;
}

export interface IDataSinkConfig {
  id: string;
  name: string;
  dataPoints: IDataSinkDataPointConfig[];
  protocol: string;
}

export interface IDataPointMapping {
  source: string;
  target: string;
}
export interface IConfig {
  dataSources: IDataSourceConfig[];
  dataSinks: IDataSinkConfig[];
  mapping: IDataPointMapping[];
}

export interface IConfigManagerParams {
  errorEventsBus: EventBus<IErrorEvent>;
  lifecycleEventsBus: EventBus<ILifecycleEvent>;
}
