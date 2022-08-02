import { ObjectMap } from '../shared/utils';

export enum VirtualDataPointOperationType {
  AND = 'and',
  OR = 'or',
  NOT = 'not',
  COUNTER = 'counter',
  THRESHOLDS = 'thresholds',
  ENUMERATION = 'enumeration',
  GREATER = 'greater',
  GREATER_EQUAL = 'greaterEqual',
  SMALLER = 'smaller',
  SMALLER_EQUAL = 'smallerEqual',
  EQUAL = 'equal',
  UNEQUAL = 'unequal',
  SUM = 'sum'
}

export class VirtualDataPoint {
  id!: string;
  operationType?: VirtualDataPointOperationType;
  sources?: string[];
  name?: string;
  thresholds?: ObjectMap<number>;
  enumeration?: VirtualDataPointEnumeration;
  comparativeValue?: string;
}

export interface VirtualDataPointEnumeration {
  defaultValue?: string;
  items: VirtualDataPointEnumerationItem[];
}

export interface VirtualDataPointEnumerationItem {
  priority: number;
  source: string;
  returnValueIfTrue: string;
}
