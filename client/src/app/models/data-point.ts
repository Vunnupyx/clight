import { ObjectMap } from '../shared/utils';

export enum DataPointType {
  Event = 'event',
  Condition = 'condition',
  Sample = 'sample'
}

export enum DataPointDataType {
  String = 'String',
  Double = 'Double',
  Byte = 'Byte',
  UInt16 = 'UInt16',
  UInt32 = 'UInt32',
  Boolean = 'Boolean'
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