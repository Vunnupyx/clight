import { ObjectMap } from '../shared/utils';

export enum VirtualDataPointOperationType {
  AND = 'and',
  OR = 'or',
  NOT = 'not',
  COUNTER = 'counter',
  THRESHOLDS = 'thresholds',
  ENUMERATION = 'enumeration',
}

export class VirtualDataPoint {
  id!: string;
  operationType?: VirtualDataPointOperationType;
  sources?: string[];
  name?: string;
  thresholds?: ObjectMap<number>;
  enumeration?: VirtualDataPointEnumeration;
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