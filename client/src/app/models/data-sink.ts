import { DataPoint } from './data-point';

export enum DataSinkProtocol {
  MTConnect = 'MTConnect',
  OPC = 'OPC UA',
  DH = 'Data Hub'
}

export class DataSink {
  id?: string;
  name: string;
  datapoints: Array<DataPoint>;
  enabled: boolean;
  protocol: DataSinkProtocol;
}
