export enum VirtualDataPointOperationType {
  AND = 'and',
  OR = 'or',
  NOT = 'not',
  COUNTER = 'counter',
  THRESHOLDS = 'THRESHOLDS'
}

export class VirtualDataPoint {
  id?: string;
  operationType?: VirtualDataPointOperationType;
  sources?: string[];
  name?: string;
}
