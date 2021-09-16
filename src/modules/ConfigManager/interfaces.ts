import { IErrorEvent, ILifecycleEvent } from '../../common/interfaces';
import { EventBus } from '../EventBus';
import { OPCUAServerOptions } from 'node-opcua';

export interface IRuntimeConfig {
  mtconnect: IMTConnectConfig;
  opcua: IOPCUAConfig;
  restApi: IRestApiConfig;
}

export interface IRestApiConfig {
  port: number;
  maxFileSizeByte: number;
}
export interface IMTConnectConfig {
  listenerPort: number;
}

export interface IOPCUAConfig extends OPCUAServerOptions {}

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

type IMTConnectDataPointTypes = 'event';

// type MapItem = {
//   [key: string]: "string";
// };
export type ITargetDataMap = object;

export interface IDataSinkDataPointConfig {
  id: string;
  name: string;
  type: IMTConnectDataPointTypes;
  map?: ITargetDataMap;
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
  priotity?: number; //TODO: FIX SPELLING
}

export interface IVirtualDataPointConfig {
  id: string;
  sources: string[];
  type: 'and' | 'or' | 'not' | 'counter';
}

export interface IConfig {
  dataSources: IDataSourceConfig[];
  dataSinks: IDataSinkConfig[];
  virtualDataPoints: IVirtualDataPointConfig[];
  dataPoints: IDataSinkDataPointConfig[];
  mapping: IDataPointMapping[];
}

export interface IConfigManagerParams {
  errorEventsBus: EventBus<IErrorEvent>;
  lifecycleEventsBus: EventBus<ILifecycleEvent>;
}
