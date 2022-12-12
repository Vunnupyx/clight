export enum SourceDataPointType {
  PLC = 's7',
  NCK = 'nck',
  FANUC = 'plc'
}

export enum SourceDataPointFanucDataType {
  Bit = 'bit',
  Byte = 'byte',
  Word = 'word',
  DoubleWord = 'double_word',
  Real = 'real'
}

export class SourceDataPoint {
  address!: string;
  description?: string;
  id!: string;
  name!: string;
  readFrequency!: number;
  type?: SourceDataPointType;
  fanucDataType?: SourceDataPointFanucDataType;
  enabled?: boolean;
}
