export enum SourceDataPointType {
  PLC = 's7',
  NCK = 'nck',
  Measurement = 'measurement',
  Meter = 'meter'
}

export enum SourceDataPointDescription {
  ActivePower = 'activePower',
  TotalEnergy = 'totalEnergy'
}

export class SourceDataPoint {
  address!: string;
  description?: SourceDataPointDescription;
  id!: string;
  name!: string;
  readFrequency!: number;
  type?: SourceDataPointType;
  enabled?: boolean;
}
