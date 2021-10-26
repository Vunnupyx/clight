import { IErrorEvent, ILifecycleEvent } from '../../common/interfaces';
import { EventBus } from '../EventBus';
import { OPCUAServerOptions } from 'node-opcua';

export interface IRuntimeConfig {
  users: IUser[];
  mtconnect: IMTConnectConfig;
  opcua: IOPCUAConfig;
  restApi: IRestApiConfig;
}

export interface IGeneralConfig {
  manufacturer: string;
  serialNumber: string;
  model: string;
  control: string;
}

export interface IUser {
  userName: string;
  password: string;
}

export interface IRestApiConfig {
  port: number;
  maxFileSizeByte: number;
}
export interface IMTConnectConfig {
  listenerPort: number;
}

export interface IOPCUAConfig extends OPCUAServerOptions {
  nodesetDir: string;
}

export interface IDataPointConfig {
  id: string;
  name: string;
  address: string;
  readFrequency: number;
  type: 's7' | 'nck';
}

export interface IDataSourceConfig {
  name: string;
  dataPoints: IDataPointConfig[];
  protocol: string;
  connection?: {
    ipAddr: string;
    port: number;
    rack: number;
    slot: number;
  };
  enabled: boolean;
}

type IMTConnectDataPointTypes = 'event' | 'condition';

// type MapItem = {
//   [key: string]: "string";
// };
export type ITargetDataMap = object;

export interface IDataSinkDataPointConfig {
  id: string;
  address: string;
  name: string;
  type: IMTConnectDataPointTypes;
  map?: ITargetDataMap;
  initialValue?: string | number;
}
export interface IOpcuaAuth {
  type: 'none' | 'userpassword';
  userName: string;
  password: string;
}
export interface IDataSinkConfig {
  name: string;
  dataPoints: IDataSinkDataPointConfig[];
  protocol: string;
  enabled: boolean;
  auth?: IOpcuaAuth;
}

export interface IDataPointMapping {
  id: string;
  source: string;
  target: string;
  mapValue?: string;
  priority?: number;
}

export interface NetworkConfigItem {
  useDhcp?: boolean;
  ipAddr?: string;
  netmask?: string;
  defaultGateway?: string;
  dnsServer?: string;
  useProxy?: boolean;
  port?: number;
  username?: string;
  password?: string;
  configurationState?: boolean;
  serviceState?: boolean;
}

export type NetworkConfig = {
  [key in 'x1' | 'x2' | 'proxy']: NetworkConfigItem;
};


export interface IDefaultTemplates {
  availableDataSources: IDataSourceConfig[];
  availableDataSinks: IDataSinkConfig[];
}

export interface TemplatesConfig {
  completed: boolean;
}

export function isDataPointMapping(obj: any): obj is IDataPointMapping {
  return 'source' in obj && 'target' in obj && !('id' in obj);
}

export interface IVirtualDataPointConfig {
  id: string;
  sources: string[];
  operationType: 'and' | 'or' | 'not' | 'counter';
}

export interface ISystemInfoItem {
  key: string;
  keyDescription: string;
  value: string;
  valueDescription: string;
}

export interface ISystemInfo {
  title: string;
  description: string;
  items: ISystemInfoItem[];
}

export interface IConfig {
  dataSources: IDataSourceConfig[];
  dataSinks: IDataSinkConfig[];
  virtualDataPoints: IVirtualDataPointConfig[];
  // dataPoints: IDataSinkDataPointConfig[]; // TODO ??
  mapping: IDataPointMapping[];
  general: IGeneralConfig;
  networkConfig: NetworkConfig;
  templates: TemplatesConfig;
  systemInfo: ISystemInfo[];
}

export interface IConfigManagerParams {
  errorEventsBus: EventBus<IErrorEvent>;
  lifecycleEventsBus: EventBus<ILifecycleEvent>;
}
