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
  CALCULATION = 'calculation',
  SET_TARIFF = 'setTariff',
  BLINK_DETECTION = 'blink-detection'
}

export class VirtualDataPoint {
  id!: string;
  operationType?: VirtualDataPointOperationType;
  sources?: string[];
  name?: string;
  thresholds?: ObjectMap<number>;
  enumeration?: VirtualDataPointEnumeration;
  formula?: string;
  comparativeValue?: string;
  enabled?: boolean;
  resetSchedules?: VirtualDataPointSchedule[];
  blinkSettings?: VirtualDataPointBlinkSettings;
}

export enum VirtualDataPointErrorType {
  WrongVdpsOrder = 'wrongVdpsOrder',
  WrongFormat = 'wrongFormat',
  UnexpectedError = 'unexpectedError'
}

export interface VirtualDataPointReorderValidityStatus {
  isValid: boolean;
  error?: 'wrongVdpsOrder' | 'wrongFormat' | 'unexpectedError';
  vdpIdWithError?: string;
  notYetDefinedSourceVdpId?: string;
}

export interface VirtualDataPointErrorReason {
  error?: VirtualDataPointErrorType;
  vdpIdWithError?: string;
  notYetDefinedSourceVdpId?: string;
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

export enum ScheduleMonth {
  JAN = 1,
  FEB = 2,
  MAR = 3,
  APR = 4,
  MAY = 5,
  JUN = 6,
  JUL = 7,
  AUG = 8,
  SEP = 9,
  OCT = 10,
  NOV = 11,
  DEC = 12
}

export enum ScheduleDay {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday'
}

export type ScheduleEvery = 'Every';

export interface VirtualDataPointScheduleCommon {
  name: string;
  month: number | ScheduleEvery;
  hours: number | ScheduleEvery;
  minutes: number | ScheduleEvery;
  seconds: number;
}

export interface VirtualDataPointScheduleWithDate
  extends VirtualDataPointScheduleCommon {
  date: number | ScheduleEvery;
}

export interface VirtualDataPointScheduleWithDay
  extends VirtualDataPointScheduleCommon {
  day: ScheduleDay | ScheduleEvery;
}

export type VirtualDataPointSchedule = VirtualDataPointScheduleWithDate &
  VirtualDataPointScheduleWithDay;

export interface VirtualDataPointBlinkSettings {
  timeframe: number;
  risingEdges: number;
  linkedBlinkDetections: string[];
}
