import { DataPoint } from './data-point';

export enum DataSinkProtocol {
  MTConnect = 'mtconnect',
  OPC = 'opcua',
  DH = 'datahub'
}

export class DataSink {
  id?: string;
  name!: string;
  dataPoints!: Array<DataPoint>;
  enabled!: boolean;
  protocol!: DataSinkProtocol;
}
