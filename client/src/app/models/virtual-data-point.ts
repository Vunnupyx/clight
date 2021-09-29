export enum VirtualDataPointOperationType {
  AND = 'and',
  OR = 'or',
  NOT = 'not',
  COUNTER = 'counter',
}

export class VirtualDataPoint {
  id!: string;
  operationType!: VirtualDataPointOperationType;
  sources!: string[];
}
