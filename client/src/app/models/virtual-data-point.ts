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

export enum ScheduleMonth {
  JAN = 'Jan',
  FEB = 'Feb',
  MAR = 'Mar',
  APR = 'Apr',
  MAY = 'May',
  JUN = 'Jun',
  JUL = 'Jul',
  AUG = 'Aug',
  SEP = 'Sep',
  OCT = 'Oct',
  NOV = 'Nov',
  DEC = 'Dec',
}

export enum ScheduleDay {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
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
  day: ScheduleDay|ScheduleEvery;
}

export type VirtualDataPointSchedule = VirtualDataPointScheduleWithDate & VirtualDataPointScheduleWithDay;