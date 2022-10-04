import { ObjectMap } from '../shared/utils';

export enum DataPointType {
  Event = 'event',
  Condition = 'condition',
  Sample = 'sample'
}

export enum DataPointDataType {
  String = 'string',
  Double = 'double',
  Byte = 'byte',
  UInt16 = 'uint16',
  UInt32 = 'uint32',
  Boolean = 'boolean'
}

export class DataPoint {
  enabled?: boolean;
  id!: string;
  initialValue?: string;
  map?: ObjectMap<string>;
  name?: string;
  type?: DataPointType;
  address?: string;
  mandatory?: boolean;
  dataType?: DataPointDataType;
}

export type PreDefinedDataPoint = Omit<DataPoint, 'id'>;