export enum SourceDataPointType {
  PLC = 's7',
  NCK = 'nck',
  Measurement = 'measurement',
  Meter = 'meter',
  Tariff = 'tariff',
  Device = 'device'
}

export class SourceDataPoint {
  address!: string;
  description?: string;
  id!: string;
  name!: string;
  readFrequency?: number;
  type?: SourceDataPointType;
  enabled?: boolean;
}
