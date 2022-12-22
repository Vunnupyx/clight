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
  port?: number;
  rack?: number;
  slot?: number;
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
  type?: IMTConnectDataPointTypes | TDataHubDataPointType;
  map?: ITargetDataMap;
  initialValue?: string | number;
  mandatory?: true; //only used inside frontend
}
export interface IOpcuaAuth {
  type: 'none' | 'userpassword';
  userName?: string;
  password?: string;
}

export interface IMessengerServerConfig {
  hostname: string | null;
  username: string | null;
  password: string | null;
  name: string | null;
  model: number | null;
  organization: string | null;
  timezone: number | null;
}
export interface IMessengerServerStatus {
  server: 'not_configured' | 'invalid_host' | 'invalid_auth' | 'available';
  registration: 'unknown' | 'not_registered' | 'registered' | 'error';
  registrationErrorReason:
    | null
    | 'unexpected_error'
    | 'invalid_organization'
    | 'invalid_timezone'
    | 'invalid_model'
    | 'missing_serial'
    | 'duplicated';
}
export enum ICustomDataPointDataType {
  string = 'String',
  double = 'Double',
  byte = 'Byte',
  uint16 = 'UInt16',
  uint32 = 'UInt32',
  boolean = 'Boolean'
}
export interface IOpcuaCustomDataPoint {
  address: string;
  name: string;
  dataType: ICustomDataPointDataType;
}
export interface IMessengerMetadata {
  organizations: Array<{ name: string; id: string }>;
  timezones: Array<{ name: string; id: number }>;
  models: Array<{ name: string; id: number }>;
}

export interface IDataSinkConfig {
  dataPoints: IDataSinkDataPointConfig[];
  protocol: string;
  enabled: boolean;
  auth?: IOpcuaAuth;
  customDataPoints?: IOpcuaCustomDataPoint[];
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
    | 'unequal'
    | 'calculation';
  thresholds?: ITargetDataMap;
  enumeration?: {
    defaultValue?: string;
    items: EnumOperationEntry[];
  };
  comparativeValue?: string | number;
  resetSchedules?: ScheduleDescription[];
  formula?: string;
  name: string;
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

export interface IConfig {
  dataSources: IDataSourceConfig[];
  dataSinks: Array<IDataSinkConfig>;
  virtualDataPoints: IVirtualDataPointConfig[];
  messenger: IMessengerServerConfig;
  mapping: IDataPointMapping[];
  general: IGeneralConfig;
  quickStart: QuickStartConfig;
  termsAndConditions: TermsAndConditionsConfig;
}

export interface IConfigManagerParams {
  errorEventsBus: EventBus<IErrorEvent>;
  lifecycleEventsBus: EventBus<ILifecycleEvent>;
}
