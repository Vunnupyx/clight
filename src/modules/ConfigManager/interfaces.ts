import {
  DataSourceProtocols,
  IErrorEvent,
  ILifecycleEvent
} from '../../common/interfaces';
import { EventBus } from '../EventBus';
import { OPCUAServerOptions } from 'node-opcua';
import { ScheduleDescription } from '../CounterManager';

export interface IAuthConfig {
  secret: string;
  public: string;
}

export interface IAuthRuntimeConfig {
  expiresIn: number;
}

type IRegistry = {
  [component in TSoftwareComponents]: {
    tag: string;
  };
} & {
  url: string;
};

type TSoftwareComponents = 'web' | 'mdc' | 'mtc';

interface IRegistries {
  prod: IRegistry;
  dev: IRegistry;
  stag: IRegistry;
}

export interface IRuntimeConfig {
  users: IUser[];
  mtconnect: IMTConnectConfig;
  opcua: IOPCUAConfig;
  restApi: IRestApiConfig;
  auth: IAuthRuntimeConfig;
  datahub: IDataHubConfig;
  systemInfo: ISystemInfo[];
  registries: IRegistries;
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

export interface IAuthUser extends IUser {
  passwordChangeRequired: boolean;
}

export interface IAuthUsersConfig {
  users: IAuthUser[];
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

export type IS7DataSourceConnection = {
  ipAddr: string;
  port: number;
  rack: number;
  slot: number;
};
export type IS7DataSourceTypes =
  | 's7-300/400'
  | 's7-1200/1500'
  | 'nck'
  | 'nck-pl'
  | 'custom';
export type IIoShieldDataSourcesTypes = '10di' | 'ai-100+5di' | 'ai-150+5di';

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
  protocol: DataSourceProtocols;
  connection?: IS7DataSourceConnection;
  enabled: boolean;
  type?: IS7DataSourceTypes | IIoShieldDataSourcesTypes;
}

type IMTConnectDataPointTypes = 'event' | 'condition' | 'sample';

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
export interface IOpcuaAuth {
  type: 'none' | 'userpassword';
  userName: string;
  password: string;
}

export interface IDataHubSettings {
  provisioningHost: string;
  scopeId: string;
  regId: string;
  symKey: string;
}

export interface IDataSinkConfig {
  name: string;
  dataPoints: IDataSinkDataPointConfig[];
  protocol: string;
  enabled: boolean;
  auth?: IOpcuaAuth;
  datahub?: IDataHubSettings;
}

export interface IOpcuaAuth {
  type: 'none' | 'userpassword';
  userName: string;
  password: string;
}

export interface IOpcuaAuth {
  type: 'none' | 'userpassword';
  userName: string;
  password: string;
}

export interface IDataHubConfig {
  groupDevice: boolean;
  signalGroups: ISignalGroups;
  dataPointTypesData: {
    probe: IDataHubDataPointTypesData;
    telemetry: IDataHubDataPointTypesData;
  };
}

interface IDataHubDataPointTypesData {
  intervalHours: number | null;
}

export interface ISignalGroups {
  [key: string]: Array<string>;
}

export interface IProxyConfig {
  ip: string;
  port: number;
  type: 'socks5' | 'http';
  username?: string;
  password?: string;
  enabled: boolean;
}

export interface IOpcuaAuth {
  type: 'none' | 'userpassword';
  userName: string;
  password: string;
}

interface IDataHubDataPointTypesData {
  intervalHours: number | null;
}

export type TDataHubDataPointType = 'event' | 'probe' | 'telemetry';

export interface IProxyConfig {
  ip: string;
  port: number;
  type: 'socks5' | 'http';
  username?: string;
  password?: string;
  enabled: boolean;
}

export interface ITimeConfig {
  useNtp?: boolean;
  ntpHost?: string;
  currentTime?: string;
  timezone?: string;
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
} & {
  time?: ITimeConfig;
};

export interface IDefaultTemplate {
  id?: string;
  name: string;
  description: string;
  dataSources: IDataSourceConfig[];
  dataSinks: IDataSinkConfig[];
  mapping: IDataPointMapping[];
  virtualDataPoints: IVirtualDataPointConfig[];
}

export interface IDefaultTemplates {
  templates: IDefaultTemplate[];
}

export interface QuickStartConfig {
  currentTemplate?: string;
  currentTemplateName?: string;
  completed: boolean;
}

export function isDataPointMapping(obj: any): obj is IDataPointMapping {
  return 'source' in obj && 'target' in obj && !('id' in obj);
}
export interface EnumOperationEntry {
  priority: number;
  source: string;
  returnValueIfTrue: string;
}
export interface IVirtualDataPointConfig {
  id: string;
  sources: string[];
  operationType:
    | 'and'
    | 'or'
    | 'not'
    | 'counter'
    | 'thresholds'
    | 'enumeration'
    | 'greater'
    | 'greaterEqual'
    | 'smaller'
    | 'smallerEqual'
    | 'equal'
    | 'unequal';
  thresholds?: ITargetDataMap;
  enumeration?: {
    defaultValue?: string;
    items: EnumOperationEntry[];
  };
  comparativeValue?: string | number;
  resetSchedules?: ScheduleDescription[];
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

export interface TermsAndConditionsConfig {
  accepted: boolean;
}

type env = {
  [component in TSoftwareComponents]: {
    tag: string;
  };
} & {
  selected: 'prod' | 'dev' | 'stag';
};

export interface IConfig {
  dataSources: IDataSourceConfig[];
  dataSinks: Array<IDataSinkConfig>;
  virtualDataPoints: IVirtualDataPointConfig[];
  mapping: IDataPointMapping[];
  general: IGeneralConfig;
  networkConfig: NetworkConfig;
  quickStart: QuickStartConfig;
  termsAndConditions: TermsAndConditionsConfig;
  env: env;
}

export interface IConfigManagerParams {
  errorEventsBus: EventBus<IErrorEvent>;
  lifecycleEventsBus: EventBus<ILifecycleEvent>;
}
