import { IErrorEvent, ILifecycleEvent } from "../../common/interfaces";
import { EventBus } from "../EventBus";

export interface IRuntimeConfig {
  mtconnect: IMTConnectConfig;
  restApi: IRestApiConfig;
}

export interface IRestApiConfig {
  port: number;
  maxFileSizeByte: number;
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
  connection?: {
    ipAddr: string;
    port: number;
    rack: number;
    slot: number;
  };
}

type IMTConnectDataPointTypes = "event";

// type MapItem = {
//   [key: string]: "string";
// };
export type IMTConnectDataMap = object;

export interface IDataSinkDataPointConfig {
  id: string;
  name: string;
  type: IMTConnectDataPointTypes;
  map?: IMTConnectDataMap;
  initialValue?: string | number;
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
  mapValue?: string;
  priotity?: number;
}

export interface IVirtualDataPointConfig {
  id: string;
  sources: string[];
  type: "and" | "or" | "not" | "counter";
}

export interface IConfig {
  dataSources: IDataSourceConfig[];
  dataSinks: IDataSinkConfig[];
  virtualDataPoints: IVirtualDataPointConfig[];
  // dataPoints: IDataSinkDataPointConfig[]; // TODO ??
  mapping: IDataPointMapping[];
}

export interface IConfigManagerParams {
  errorEventsBus: EventBus<IErrorEvent>;
  lifecycleEventsBus: EventBus<ILifecycleEvent>;
}
