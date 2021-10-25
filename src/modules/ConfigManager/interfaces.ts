import { IErrorEvent, ILifecycleEvent } from '../../common/interfaces';
import { EventBus } from '../EventBus';
import { OPCUAServerOptions } from 'node-opcua';

export interface IRuntimeConfig {
  users: IUser[];
  mtconnect: IMTConnectConfig;
  opcua: IOPCUAConfig;
  restApi: IRestApiConfig;
  datahub: IDataHubConfig;
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
  type: IMTConnectDataPointTypes | TDataHubDataPointType;
  map?: ITargetDataMap;
  initialValue?: string | number;
}
export interface IDataSinkConfig {
  name: string;
  dataPoints: IDataSinkDataPointConfig[];
  protocol: string;
  enabled: boolean;
  auth?: IOpcuaAuth;
}

export interface IDataHubDataSinkConfig extends IDataSinkConfig {}

export interface IOpcuaAuth {
  type: "none" | "userpassword",
  userName: string,
  password: string
}

export interface IOpcuaDataSinkConfig extends IDataSinkConfig {
  auth?: IOpcuaAuth
}

export interface IDataHubConfig {
    provisioningHost: string,
    serialNumber: string,
    scopeId: string,
    regId: string,
    symKey: string
    groupDevice: boolean,
    signalGroups: ISignalGroups
    dataPointTypesData: {
      probe: IDataHubDataPointTypesData,
      telemetry: IDataHubDataPointTypesData
    }
}

interface IDataHubDataPointTypesData {
  intervalHours: number | null,
}

export interface ISignalGroups {
  [key: string]: Array<string>
}

export type TDataHubDataPointType = 'event' | 'probe' | 'telemetry';

export interface IProxyConfig {
  ip: string;
  port: number;
  type: 'socks5' | 'http',
  username?: string;
  password?: string;
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
  [key in 'x1' | 'x2']: NetworkConfigItem;
} & {
  proxy?: IProxyConfig;
}

export interface ITemplateDataSource {
  id: string;
  name: string;
  description?: string;
}

export interface ITemplateDataSink {
  id: string;
  name: string;
  description?: string;
  dataSources: string[];
}

export interface IDefaultTemplates {
  availableDataSources: ITemplateDataSource[];
  availableDataSinks: ITemplateDataSink[];
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
  dataSinks: Array<IDataSinkConfig | IDataHubDataSinkConfig | IOpcuaDataSinkConfig>;
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
