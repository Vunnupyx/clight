export enum SourceDataPointType {
  PLC = 's7',
  NCK = 'nck',
  PMC = 'pmc',
  CNC = 'cnc',
  CNCParameter = 'cncParameter'
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
  fanucAddressType?: string;
  fanucSNumber?: string;
  fanucENumber?: string;
  fanucLength?: string;
  enabled?: boolean;
}
