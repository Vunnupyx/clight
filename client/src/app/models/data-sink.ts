import { DataPoint, PreDefinedDataPoint } from './data-point';

export enum DataSinkProtocol {
  MTConnect = 'mtconnect',
  OPC = 'opcua',
  DH = 'datahub'
}

export enum DataSinkAuthType {
  Anonymous = 'anonymous',
  UserAndPass = 'userpassword'
}

export class DataSinkAuth {
  type!: DataSinkAuthType;
  userName?: string;
  password?: string;
}

export enum DataSinkConnectionStatus {
  Disabled = 'disabled',
  NotConfigured = 'notconfigured',
  Provisioning = 'provisioning',
  ProvisioningFailed = 'provisioningfailed',
  TimeError = 'clienttimedeviation',
  NoNetwork = 'nonetwork',
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnected = 'disconnected',
  Reconnecting = 'reconnecting',
  ConnectionError = 'failedtoconnect',
  Unavailable = 'unavailable', // in case of status can't be loaded,
  TermsAndConditionsNotAccepted = 'termsandconditionsnotaccepted'
}

export class DataSinkConnection {
  status!: DataSinkConnectionStatus;
}

export class DataSink {
  id?: string;
  name!: string;
  dataPoints!: Array<DataPoint>;
  enabled!: boolean;
  protocol!: DataSinkProtocol;
  auth?: DataSinkAuth;
  desired?: {
    services?: {
      [key: string]: {
        enabled: boolean;
      };
    };
  };
  customDataPoints?: Array<PreDefinedDataPoint>;
}
