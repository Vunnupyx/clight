import {
  DataSourceProtocols,
  IErrorEvent,
  ILifecycleEvent
} from '../../common/interfaces';
import { EventBus } from '../EventBus';
import { OPCUAServerOptions } from 'node-opcua';
import { ScheduleDescription } from '../CounterManager/interfaces';

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

export type IEnergyDataSourceConnection = {
  ipAddr: string;
};

export type IS7DataSourceConnection = {
  ipAddr: string;
  port?: number;
  rack?: number;
  slot?: number;
};
export type IMTConnectDataSourceConnection = {
  ipAddr: string;
  port: number;
};
export type IS7DataSourceTypes =
  | 's7-300/400'
  | 's7-1200/1500'
  | 'nck'
  | 'nck-pl'
  | 'custom';
export type IIoShieldDataSourcesTypes = '10di' | 'ai-100+5di' | 'ai-150+5di';
export type IEnergyDataSourcesTypes = 'PhoenixEMpro';
export type IEnergyDatapointTypes = 'meter' | 'measurement' | 'device';
export type IMTConnectDataSourcesTypes = 'Agent' | 'Adapter';
export type IMTConnectDataPointTypes = 'event' | 'sample' | 'condition';

export interface IDataPointConfig {
  id: string;
  name: string;
  address: string;
  readFrequency?: number;
  type: 's7' | 'nck' | IEnergyDatapointTypes | IMTConnectDataPointTypes;
}

export interface IDataSourceConfig {
  dataPoints: IDataPointConfig[];
  protocol: DataSourceProtocols;
  connection?:
    | IS7DataSourceConnection
    | IEnergyDataSourceConnection
    | IMTConnectDataSourceConnection;
  enabled: boolean;
  type:
    | IS7DataSourceTypes
    | IIoShieldDataSourcesTypes
    | IEnergyDataSourcesTypes
    | IMTConnectDataSourcesTypes;
  mtConnectMachineName?: string;
}

export function isValidDataSourceDatapoint(dp: any): dp is IDataPointConfig {
  return 'id' in dp && 'name' in dp && 'address' in dp && 'type' in dp;
}

export function isValidDataSource(obj: any): obj is IDataSourceConfig {
  return (
    'protocol' in obj &&
    'enabled' in obj &&
    'type' in obj &&
    Array.isArray(obj.dataPoints) &&
    obj.dataPoints?.every(isValidDataSourceDatapoint)
  );
}

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
export function isValidDataSinkDatapoint(
  dp: any
): dp is IDataSinkDataPointConfig {
  return 'id' in dp && 'name' in dp && 'address' in dp;
}

export function isValidDataSink(obj: any): obj is IDataSinkConfig {
  return (
    'protocol' in obj &&
    'enabled' in obj &&
    Array.isArray(obj.dataPoints) &&
    obj.dataPoints?.every(isValidDataSinkDatapoint)
  );
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
  return 'source' in obj && 'target' in obj && 'id' in obj;
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
    | 'calculation'
    | 'setTariff';
  thresholds?: ITargetDataMap;
  enumeration?: {
    defaultValue?: string;
    items: EnumOperationEntry[];
  };
  comparativeValue?: string | number;
  resetSchedules?: ScheduleDescription[];
  formula?: string;
  name: string;
  mandatory?: boolean;
}

export function isValidVdp(input: any): input is IVirtualDataPointConfig {
  return (
    'id' in input &&
    'name' in input &&
    'operationType' in input &&
    'sources' in input &&
    Array.isArray(input?.sources)
  );
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
