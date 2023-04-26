export enum SourceDataPointType {
  PLC = 's7',
  NCK = 'nck',
  Measurement = 'measurement',
  Meter = 'meter',
  Device = 'device',
  Event = 'event',
  Sample = 'sample',
  Condition = 'condition'
}

export class SourceDataPoint {
  address!: string;
  description?: string;
  id!: string;
  name!: string;
  readFrequency?: number;
  type?: SourceDataPointType;
  enabled?: boolean;
  mandatory?: boolean;
}
