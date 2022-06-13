import { ObjectMap } from '../shared/utils';

export enum VirtualDataPointOperationType {
  AND = 'and',
  OR = 'or',
  NOT = 'not',
  COUNTER = 'counter',
  THRESHOLDS = 'thresholds'
}

export class VirtualDataPoint {
  id!: string;
  operationType?: VirtualDataPointOperationType;
  sources?: string[];
  name?: string;
  thresholds?: ObjectMap<number>;
  resetSchedules?: VirtualDataPointSchedule[];
}

export type ScheduleEvery = 'Every';

export interface VirtualDataPointScheduleCommon {
  name: string;
  month: number|ScheduleEvery;
  hours: number|ScheduleEvery;
  minutes: number|ScheduleEvery;
  seconds: number;
}

export interface VirtualDataPointScheduleWithDate extends VirtualDataPointScheduleCommon {
  date: number|ScheduleEvery;
}

export interface VirtualDataPointScheduleWithDay extends VirtualDataPointScheduleCommon {
  day: string|ScheduleEvery;
}

export type VirtualDataPointSchedule = VirtualDataPointScheduleWithDate | VirtualDataPointScheduleWithDay;