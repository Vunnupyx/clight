export enum SourceDataPointType {
  PLC = 's7',
  NCK = 'nck',
  FANUC = 'fanuc'
}

export class SourceDataPoint {
  address!: string;
  description?: string;
  id!: string;
  name!: string;
  readFrequency!: number;
  type?: SourceDataPointType;
  enabled?: boolean;
}
