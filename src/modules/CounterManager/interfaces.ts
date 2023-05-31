export enum Day {
  'Sunday' = 0,
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
}

export type CounterDict = {
  [id: string]: number;
};

export type DayType =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'
  | 'Every';

export type MonthType =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 'Every';

export type DateType =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 'Every';
type HoursType = number | 'Every';
type MinuteType = HoursType;
type SecondsType = number;

type ScheduleDescriptionBase = {
  month: MonthType;
  hours: HoursType;
  minutes: MinuteType;
  seconds: SecondsType;
  created: number;
  lastReset: number | undefined;
};
type ScheduleDescriptionDay = ScheduleDescriptionBase & {
  day: DayType;
};

type ScheduleDescriptionDate = ScheduleDescriptionBase & {
  date: DateType;
};

// TODO Fix TYPE
export type ScheduleDescription =
  | ScheduleDescriptionDay
  | ScheduleDescriptionDate;

export type ScheduledCounterResetDict = {
  [id: string]: ScheduleDescription[];
};

export type timerDict = {
  [counterId: string]: {
    [scheduleIndex: number]: NodeJS.Timer | undefined;
  };
};
