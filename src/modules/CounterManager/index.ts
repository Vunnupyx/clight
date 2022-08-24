import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { ConfigManager } from '../ConfigManager';

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

type ScheduledCounterResetDict = {
  [id: string]: ScheduleDescription[];
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
  private configFolder = '../../../mdclight/config';
  private counterStoragePath = '';
  private schedulerChecker: NodeJS.Timer;
  private startedTimers: timerDict = {};
  private schedulerCheckerInterval = 5000; //1000 * 60; // ms * sec => 1 min

  /**
   * Initializes counter manages and tries to restore old counter states
   */
  constructor(private configManager: ConfigManager) {
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

    // TODO: DIGMDCLGHT-20 Scheduled reset was not finalized by sprint end.
    //this.checkMissedResets();
    //this.checkTimers();
  }

  /**
   * Increments counter and returns new value
   * @param  {string} id
   * @returns number
   */
  public increment(id: string): number {
    const logPrefix = `${this.constructor.name}::increment`;
    winston.debug(`${logPrefix} increment counter for id: ${id}`);
    if (typeof this.counters[id] !== 'undefined') {
      this.counters[id] = this.counters[id] + 1;
    } else {
      winston.debug(`${logPrefix} unknown id ${id} found. Create new counter.`);
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
    this.saveCountersToFile();
  }

  private saveCountersToFile(): void {
    winston.info(`${this.constructor.name}::saveCountersToFile saving.`);
    if (this.persist) {
      fs.writeFileSync(this.counterStoragePath, JSON.stringify(this.counters));
    }
  }

  /**
   * Check at startup if any reset was missed
   */
  private checkMissedResets() {
    const logPrefix = `${this.constructor.name}::checkMissedResets`;
    winston.debug(`${logPrefix} started.`);
    const counterEntries = this.configManager.config.virtualDataPoints.filter(
      (vdp) => {
        return (
          vdp.operationType === 'counter' && vdp.resetSchedules?.length !== 0
        );
      }
    );
    for (const counter of counterEntries) {
      const id = counter.sources[0];
      for (const [index, configEntry] of counter?.resetSchedules?.entries()) {
        const nextDate = this.calcNextTrigger(configEntry, new Date());
        const nextNextDate = this.calcNextTrigger(
          configEntry,
          new Date(nextDate)
        );
        const interval = nextNextDate.getTime() - nextDate.getTime();
        const lastDate = nextDate.getTime() - interval;

        if (lastDate < configEntry.created) {
          // No reset missed because timer is younger
          winston.debug(
            `${logPrefix} ignore reset because timer is younger as last trigger date.`
          );
          continue;
        }
        if (lastDate === configEntry?.lastReset) {
          // last reset correct done
          winston.debug(
            `${logPrefix} ignore reset because last reset was successfully.`
          );
          continue;
        }
        winston.debug(
          `${logPrefix} reset for counter '${id}' because last reset was skipped.`
        );
        this.configManager.config.virtualDataPoints.find(
          (vdp) => vdp.id === counter.id
        ).resetSchedules[index].lastReset = Date.now();
        this.reset(id);
      }
    }
    winston.debug(`${logPrefix} done.`);
  }

  /**
   * Check if timer is in range of this.schedulerCheckerInterval and start
   */
  private checkTimers() {
    const logPrefix = `${this.constructor.name}::checkTimers`;

    winston.debug(`${logPrefix} start check for scheduled resets.`);

    const counterEntries = this.configManager.config.virtualDataPoints.filter(
      (vdp) => {
        return (
          vdp.operationType === 'counter' && vdp.resetSchedules?.length !== 0
        );
      }
    );

    for (const scheduleData of counterEntries) {
      const counterId = scheduleData.sources[0];
      const vdpId = scheduleData.id;
      for (const [index, entry] of scheduleData?.resetSchedules?.entries()) {
        winston.debug(
          `${logPrefix} found scheduling for id: ${counterId} : ${JSON.stringify(
            scheduleData
          )}`
        );
        // There is already a running timer for this id!
        if (this.startedTimers[counterId] !== undefined) {
          winston.debug(`${logPrefix} timer for ${counterId} already started.`);
          continue;
        }

        const now = new Date();
        const nextScheduling = this.calcNextTrigger(entry, now);

        winston.debug(
          `${logPrefix} next trigger time found: ${nextScheduling}`
        );
        winston.debug(
          `${logPrefix} check if trigger time is inside next interval.`
        );
        const timeDiff = now.getTime() - nextScheduling.getTime();
        //Check if diff is in range of interval
        if (timeDiff > this.schedulerCheckerInterval * -1) {
          winston.debug(`${logPrefix} start timer for id: ${counterId}`);
          this.configManager.config.virtualDataPoints.find(
            (vdp) => vdp.id === vdpId
          ).resetSchedules[index].lastReset = Date.now();
          this.startedTimers[counterId] = setTimeout(() => {
            winston.debug(
              `${logPrefix} timer for ${counterId} expired. Start reset.`
            );
            this.reset(counterId);
          }, timeDiff * -1);
        }
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
  // private calcNextTrigger(
  //   scheduleData: ScheduleDescription,
  //   currentDate: Date
  // ): Date {
  //   let diff: number;
  //   let dateFromScheduling: Date = new Date();
  //   const timeData = {
  //     year: currentDate.getFullYear(),
  //     month:
  //       scheduleData.month === 'Every'
  //         ? currentDate.getMonth()
  //         : scheduleData.month,
  //     date:
  //       //@ts-ignore
  //       scheduleData.date
  //         ? //@ts-ignore
  //           scheduleData.date
  //         : currentDate.getDate(),
  //     hours:
  //       scheduleData.hours === 'Every'
  //         ? currentDate.getHours()
  //         : scheduleData.hours,
  //     min:
  //       scheduleData.minutes === 'Every'
  //         ? currentDate.getMinutes()
  //         : scheduleData.minutes,
  //     sec: scheduleData.seconds
  //   };
  //   // Find next day if day is set
  //   // @ts-ignore
  //   if (scheduleData?.day) {
  //     // TODO: FIX EVERY
  //     //@ts-ignore
  //     if (scheduleData?.day !== 'Every') {
  //       dateFromScheduling = new Date(
  //         timeData.year,
  //         timeData.month,
  //         // @ts-ignore
  //         currentDate.getDate() +
  //           // @ts-ignore
  //           ((7 - currentDate.getDay() + Day[scheduleData.day]) % 7 || 0),
  //         timeData.hours,
  //         timeData.min,
  //         timeData.sec
  //       );
  //       // @ts-ignore
  //       diff = currentDate - dateFromScheduling;
  //       if (!(diff < 0)) {
  //         dateFromScheduling = new Date(
  //           timeData.year,
  //           timeData.month,
  //           // @ts-ignore
  //           dateFromScheduling.getDay() + 7,
  //           timeData.hours,
  //           timeData.min,
  //           timeData.sec
  //         );
  //       }
  //     } else {
  //       console.log(`Day auf Every`);
  //       dateFromScheduling = new Date(
  //         timeData.year,
  //         timeData.month,
  //         timeData.date,
  //         timeData.hours,
  //         timeData.min,
  //         timeData.sec
  //       );
  //       // @ts-ignore
  //       diff = currentDate - dateFromScheduling;
  //       if (!(diff < 0)) {
  //         // increase every entries with one and check if new date is in future
  //         for (const entry of ['min', 'hours', 'date', 'month', 'year']) {
  //           // Ignore non 'Every' entries
  //           // @ts-ignore
  //           if (scheduleData[entry] !== 'Every') continue;
  //           // @ts-ignore
  //           timeData[entry] += 1;
  //           dateFromScheduling = new Date(
  //             timeData.year,
  //             timeData.month,
  //             timeData.date,
  //             timeData.hours,
  //             timeData.min,
  //             timeData.sec
  //           );
  //           // @ts-ignore
  //           diff = currentDate - dateFromScheduling;
  //           if (diff < 0) {
  //             // New date is in future, break out for loop
  //             break;
  //           }
  //           // @ts-ignore
  //           currentDate[entry] -= 1;
  //         }
  //       }
  //     }
  //   } else {
  //     dateFromScheduling = new Date(
  //       timeData.year,
  //       timeData.month,
  //       timeData.date,
  //       timeData.hours,
  //       timeData.min,
  //       timeData.sec
  //     );
  //     // @ts-ignore
  //     diff = currentDate - dateFromScheduling;
  //     // generated dateFromScheduling in past search for next event
  //     if (!(diff < 0)) {
  //       // increase every entries with one and check if new date is in future
  //       for (const entry of ['min', 'hours', 'date', 'month', 'year']) {
  //         // Ignore non 'Every' entries
  //         // @ts-ignore
  //         if (scheduleData[entry] !== 'Every') continue;
  //         // @ts-ignore
  //         timeData[entry] += 1;
  //         dateFromScheduling = new Date(
  //           timeData.year,
  //           timeData.month,
  //           timeData.date,
  //           timeData.hours,
  //           timeData.min,
  //           timeData.sec
  //         );
  //         // @ts-ignore
  //         diff = currentDate - dateFromScheduling;
  //         if (diff < 0) {
  //           // New date is in future, break out for loop
  //           break;
  //         }
  //         // @ts-ignore
  //         currentDate[entry] -= 1;
  //       }
  //     }
  //   }
  //   return dateFromScheduling;
  // }

  public calcNextTrigger(input: ScheduleDescription, currentDate: Date) {
    // DATE ist definiert!!!!
    // @ts-ignore
    input = { ...input, year: currentDate.getFullYear() };
    const data = {
      year: currentDate.getFullYear(),
      month: input.month === 'Every' ? currentDate.getMonth() : input.month,
      // @ts-ignore
      date: input.date,
      hours: input.hours === 'Every' ? currentDate.getHours() : input.hours,
      min: input.minutes === 'Every' ? currentDate.getMinutes() : input.minutes,
      second: input.seconds
    };

    let testDate = new Date(
      data.year,
      data.month,
      data.date,
      data.hours,
      data.min,
      data.second
    );
    if (currentDate.getTime() > testDate.getTime()) {
      console.log(`Datum: ${currentDate}`);
      console.log(`Berechnetes Datum liegt in der Vergangenheit: ${testDate}`);
      for (const entry of ['min', 'hours', 'date', 'month', 'year']) {
        if (input[entry] !== 'Every') continue;
        // @ts-ignore
        data[entry] += 1;

        testDate = new Date(
          data.year,
          data.month,
          data.date,
          data.hours,
          data.min,
          data.second
        );
        console.log(`Neuer Versuch: ${testDate}`);
        console.log();
        if (currentDate.getTime() < testDate.getTime()) return testDate;
      }
    } else {
      return testDate;
    }
    // for (const entry of ['min', 'hours', 'date', 'month', 'year']) {
    //   // Ignore non 'Every' entries
    //   // @ts-ignore
    //   if (scheduleData[entry] !== 'Every') continue;
    //   // @ts-ignore
    //   timeData[entry] += 1;
    //   dateFromScheduling = new Date(
    //     timeData.year,
    //     timeData.month,
    //     timeData.date,
    //     timeData.hours,
    //     timeData.min,
    //     timeData.sec
    //   );
    //   // @ts-ignore
    //   diff = currentDate - dateFromScheduling;
    //   if (diff < 0) {
    //     // New date is in future, break out for loop
    //     break;
    //   }
    //   // @ts-ignore
    //   currentDate[entry] -= 1;
    // }
  }
}
