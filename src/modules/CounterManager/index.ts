import fs from 'fs';
import { NumberType } from 'node-opcua';
import path from 'path';
import winston from 'winston';

type CounterDict = {
  [id: string]: number;
};

enum Day {
  'Sunday' = 0,
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
}
type DayType =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'
  | 'Every';
type MonthType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'Every';
type DateType =
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
  lastReset: number;
};
type ScheduleDescriptionDay = ScheduleDescriptionBase & {
  day: DayType;
};

type ScheduleDescriptionDate = ScheduleDescriptionBase & {
  date: DateType;
};

// TODO Fix TYPE
export type ScheduleDescription = ScheduleDescriptionDay | ScheduleDescriptionDate;

type ScheduledCounterResetDict = {
  [id: string]: ScheduleDescription;
};

type timerDict = {
  [id: string]: NodeJS.Timer;
};

/**
 * Manages counter (virtual data points)
 */
export class CounterManager {
  private persist = true;
  private counters: CounterDict = {};
  private scheduledResets: ScheduledCounterResetDict = {};
  private configFolder = '../../../mdclight/config';
  private scheduleStoragePath = path.join(
    __dirname,
    this.configFolder,
    '/resetSchedulers.json'
  );
  private counterStoragePath = '';
  private schedulerChecker: NodeJS.Timer;
  private startedTimers: timerDict = {};
  private schedulerCheckerInterval = 5000; //1000 * 60; // ms * sec => 1 min

  /**
   * Initializes counter manages and tries to restore old counter states
   */
  constructor() {
    if (!fs.existsSync(path.join(__dirname, this.configFolder))) {
      winston.warn(
        'Configuration folder for storing counter values not found! The counts are not persisted!'
      );
      this.persist = false;
      return;
    }

    this.counterStoragePath = path.join(
      __dirname,
      `${this.configFolder}/counters.json`
    );

    if (fs.existsSync(this.counterStoragePath)) {
      this.counters = JSON.parse(
        fs.readFileSync(this.counterStoragePath, 'utf8')
      );
    }

    if (fs.existsSync(this.scheduleStoragePath)) {
      this.scheduledResets = JSON.parse(
        fs.readFileSync(this.scheduleStoragePath, 'utf-8')
      );
      this.checkMissedResets();
    }
    this.checkTimers();
  }

  /**
   * Increments counter and returns new value
   * @param  {string} id
   * @returns number
   */
  public increment(id: string, config?: ScheduleDescription): number {
    const logPrefix = `${this.constructor.name}::increment`;
    winston.debug(`${logPrefix} increment counter for id: ${id}`);
    if (typeof this.counters[id] !== 'undefined') {
      this.counters[id] = this.counters[id] + 1;
    } else {
      winston.debug(`${logPrefix} unknown id ${id} found. Create new counter.`);
      this.setScheduledReset(id, config);
      this.counters[id] = 1;
    }

    this.saveCountersToFile();

    return this.counters[id];
  }

  /**
   * Returns the value of one counter by its id
   * @param  {string} id
   * @returns number
   */
  public getValue(id: string): number {
    return this.counters[id] || 0;
  }

  /**
   * Rest counter to zero
   * @param id identifier of the vdp counter
   */
  public reset(id: string): void {
    const logPrefix = `CounterManager::reset`;

    winston.debug(`${logPrefix} started for id: ${id}`);
    if (typeof this.counters[id] === 'undefined') {
      winston.warn(`${logPrefix} try to reset unknown id: ${id} .`);
      return;
    }
    this.counters[id] = 0;
    this.scheduledResets[id].lastReset = Date.now();
    this.saveCountersToFile();
  }

  private saveCountersToFile(): void {
    winston.info(`${this.constructor.name}::saveCountersToFile saving.`);
    if (this.persist) {
      fs.writeFileSync(this.counterStoragePath, JSON.stringify(this.counters));
    }
  }

  private saveSchedulingToFile() {
    winston.info(`${this.constructor.name}::saveSchedulingToFile saving...`);
    if (this.persist) {
      fs.writeFileSync(
        this.scheduleStoragePath,
        JSON.stringify(this.scheduledResets)
      );
    }
    winston.info(`${this.constructor.name}::saveSchedulingToFile saved.`);
  }

  public setScheduledReset(id: string, resetConfig: ScheduleDescription): void {
    const logPrefix = `CounterManager::setScheduledReset`;
    winston.debug(`${logPrefix} for id ${id} with config: ${resetConfig}`);
    this.scheduledResets[id] = { ...resetConfig, created: Date.now() };
    this.saveSchedulingToFile();
  }

  /**
   * Check at startup if any reset was missed
   */
  private checkMissedResets() {
    const logPrefix = `${this.constructor.name}::checkMissedResets`;
    winston.debug(`${logPrefix} started.`);
    for (const [id, config] of Object.entries(this.scheduledResets)) {
      const nextDate = this.calcNextTrigger(config, new Date());
      const nextNextDate = this.calcNextTrigger(config, new Date(nextDate));
      const interval = nextNextDate.getTime() - nextDate.getTime();
      const lastDate = nextDate.getTime() - interval;

      if(lastDate < config.created) {
        // No reset missed because timer is younger
        winston.debug(`${logPrefix} ignore reset because timer is younger as last trigger date.`);
        continue;
      }
      if(lastDate === config?.lastReset) {
        // last reset correct done
        winston.debug(`${logPrefix} ignore reset because last reset was successfully.`);
        continue;
      }
      winston.debug(`${logPrefix} reset for counter '${id}' because last reset was skipped.`);
      this.reset(id);
    }
    winston.debug(`${logPrefix} done.`);
  }

  /**
   * Check if timer is in range of this.schedulerCheckerInterval and start
   */
  private checkTimers() {
    const logPrefix = `${this.constructor.name}::checkTimers`;

    winston.debug(`${logPrefix} start check for scheduled resets.`);

    for (const [id, scheduleData] of Object.entries(this.scheduledResets)) {
      winston.debug(
        `${logPrefix} found scheduling for id: ${id} : ${JSON.stringify(
          scheduleData
        )}`
      );
      // There is already a running timer for this id!
      if (this.startedTimers[id] !== undefined) {
        winston.debug(`${logPrefix} timer for ${id} already started.`);
        continue;
      }

      const now = new Date();
      const nextScheduling = this.calcNextTrigger(scheduleData, now);

      winston.debug(
        `${logPrefix} next trigger time found: ${nextScheduling.toString()}`
      );
      winston.debug(
        `${logPrefix} check if trigger time is inside next interval.`
      );
      const timeDiff = now.getTime() - nextScheduling.getTime();
      //Check if diff is in range of interval
      if ( timeDiff > this.schedulerCheckerInterval * -1) {
        winston.debug(`${logPrefix} start timer for id: ${id}`);
        this.startedTimers[id] = setTimeout(() => {
          winston.debug(`${logPrefix} timer for ${id} expired. Start reset.`);
          this.reset(id);
        }, timeDiff * -1);
      }
    }
    if (!this.schedulerChecker) {
      winston.debug(
        `${logPrefix} set interval with timing ${this.schedulerCheckerInterval} for scheduler checker.`
      );
      this.schedulerChecker = setInterval(
        this.checkTimers.bind(this),
        this.schedulerCheckerInterval
      );
    }
  }

  /**
   * Calculate calculates the next date
   * 
   * @param scheduleData 
   * @param currentDate date object to compare
   * @returns next calculated date
   */
  private calcNextTrigger(scheduleData: ScheduleDescription, currentDate: Date): Date {
    const logPrefix = `${this.constructor.name}::calcNextTrigger`;
    let diff: number;
    let dateFromScheduling: Date;
    const timeData = {
      year: currentDate.getFullYear(),
      month:
        scheduleData.month === 'Every'
          ? currentDate.getMonth()
          : scheduleData.month,
      date:
      // @ts-ignore
        scheduleData.date === 'Every'
          ? currentDate.getDate()
          // @ts-ignore
          : scheduleData.date,
      hours:
        scheduleData.hours === 'Every'
          ? currentDate.getHours()
          : scheduleData.hours,
      min:
        scheduleData.minutes === 'Every'
          ? currentDate.getMinutes()
          : scheduleData.minutes,
      sec: scheduleData.seconds
    };
    // Find next day if day is set
    // @ts-ignore
    if (scheduleData?.day) {
      winston.debug(
        // @ts-ignore
        `${logPrefix} found entry for day property: ${scheduleData.day}`
      );
      let dateFromScheduling = new Date(
        timeData.year,                  
        timeData.month,
        // @ts-ignore
        currentDate.getDate() +
        // @ts-ignore
          ((7 - currentDate.getDay() + parseInt(Day[scheduleData.day]), 10) % 7 || 0),
        timeData.hours,
        timeData.min,
        timeData.sec
      );
      // @ts-ignore
      diff = currentDate - dateFromScheduling;
      if (!(diff < 0)) {
        dateFromScheduling = new Date(
          timeData.year,
          timeData.month,
          // @ts-ignore
          dateFromScheduling.getDay() + 7,
          timeData.hours,
          timeData.min,
          timeData.sec
        );
        // @ts-ignore
        diff = currentDate - dateFromScheduling;
      }
    } else {
      // @ts-ignore
      winston.debug(`${logPrefix} found date property: ${scheduleData.date}`);
      dateFromScheduling = new Date(
        timeData.year,
        timeData.month,
        timeData.date,
        timeData.hours,
        timeData.min,
        timeData.sec
      );
      // @ts-ignore
      diff = currentDate - dateFromScheduling;
      // generated dateFromScheduling in past search for next event
      if (!(diff < 0)) {
        // increase every entries with one and check if new date is in future
        for (const entry of ['min', 'hours', 'date', 'month', 'year']) {
          // Ignore non 'Every' entries
          if (scheduleData[entry] !== 'Every') continue;
          timeData[entry] += 1;
          dateFromScheduling = new Date(
            timeData.year,
            timeData.month,
            timeData.date,
            timeData.hours,
            timeData.min,
            timeData.sec
          );
          // @ts-ignore
          diff = currentDate - dateFromScheduling;
          if (diff < 0) {
            // New date is in future, break out for loop
            break;
          }
          currentDate[entry] -= 1;
        }
      }
    }
    return dateFromScheduling;
  }
}
