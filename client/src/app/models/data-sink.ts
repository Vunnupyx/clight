import { DataPoint } from './data-point';

export enum DataSinkProtocol {
  MTConnect = 'mtconnect',
  OPC = 'opcua',
  DH = 'datahub'
}

export enum DataSinkAuthType {
  Anonymous = 'anonymous',
  UserAndPass = 'user/pass'
}

export class DataSinkAuth {
  type!: DataSinkAuthType;
  userName?: string;
  password?: string;
}

export enum DataSinkConnectionStatus {
  Connected = 'connected',
  Disconnected = 'disconnected',
}

export class DataSinkConnection {
  status!: DataSinkConnectionStatus;
}

export class DataSink {
  id?: string;
  name!: string;
  datapoints!: Array<DataPoint>;
  enabled!: boolean;
  protocol!: DataSinkProtocol;
  auth?: DataSinkAuth;
}