import fs from 'fs';
import path from 'path';
import winston from 'winston';
import * as date from 'date-fns';
import { ConfigManager, mdcLightFolder } from '../ConfigManager';
import { IVirtualDataPointConfig } from '../ConfigManager/interfaces';
import { DataPointCache } from '../DatapointCache';
import {
  CounterDict,
  ScheduleDescription,
  ScheduleTimeDataType,
  timerDict
} from './interfaces';
import { SynchronousIntervalScheduler } from '../SyncScheduler';

/**
 * Manages counter (virtual data points)
 */
export class CounterManager {
  private persist = true;
  private counters: CounterDict = {};
  private configFolder = path.join(mdcLightFolder, '/config');
  private counterStoragePath = path.join(this.configFolder, '/counters.json');
  private schedulerChecker: SynchronousIntervalScheduler | null = null;
  private startedTimers: timerDict = {};
  private schedulerCheckerInterval = 1000 * 60 * 5; // 5Min

  /**
   * Initializes counter manages and tries to restore old counter states
   */
  constructor(
    private configManager: ConfigManager,
    private cache: DataPointCache
  ) {
    const logPrefix = `${this.constructor.name}::constructor`;
    if (!fs.existsSync(this.configFolder)) {
      winston.warn(
        `${logPrefix} Configuration folder for storing counter values not found! The counts are not persisted!`
      );
      this.persist = false;
      return;
    }

    if (fs.existsSync(this.counterStoragePath)) {
      // TODO: Update Cache at startup
      this.counters = JSON.parse(
        fs.readFileSync(this.counterStoragePath, 'utf8')
      );
    }

    this.configManager.once(
      'configsLoaded',
      this.handleConfigsLoaded.bind(this)
    );
    this.configManager.on('configChange', this.checkTimers.bind(this));
  }

  private handleConfigsLoaded() {
    this.registerScheduleChecker();
    this.checkMissedResets();
    this.checkTimers();
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
    return this.counters[id] ?? 0;
  }

  /**
   * Rest counter to zero
   * @param counterId identifier of the vdp counter
   */
  public reset(
    counterId: string,
    schedulingIndex: number | undefined = undefined
  ): void {
    const logPrefix = `CounterManager::reset`;

    winston.debug(`${logPrefix} started for id: ${counterId}`);
    if (typeof this.counters[counterId] === 'undefined') {
      winston.warn(`${logPrefix} try to reset unknown id: ${counterId} .`);
      return;
    }
    this.counters[counterId] = 0;
    if (typeof schedulingIndex === 'number') {
      const counterVdp = this.configManager.config?.virtualDataPoints?.find(
        (vdp) => vdp.id === counterId
      );
      if (counterVdp?.resetSchedules) {
        counterVdp.resetSchedules[schedulingIndex].lastReset = Date.now();
      }
    }

    this.cache.resetValue(counterId, 0);
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
    try {
      const counterEntries =
        this.configManager.config?.virtualDataPoints?.filter((vdp) => {
          return (
            vdp.operationType === 'counter' && vdp.resetSchedules?.length !== 0
          );
        });
      for (const counter of counterEntries) {
        const id = counter?.sources?.[0];

        if (counter?.resetSchedules?.entries()) {
          for (const [
            index,
            configEntry
          ] of counter?.resetSchedules?.entries()) {
            const nextDate = CounterManager.calcNextTrigger(
              configEntry,
              new Date()
            );
            const nextNextDate = CounterManager.calcNextTrigger(
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
            this.reset(id, index);
          }
        }
      }
      winston.debug(`${logPrefix} done.`);
    } catch (error) {
      winston.error(
        `${logPrefix} Error while checking missed counter resets: ${error}`
      );
    }
  }

  /**
   * Check if timer is in range of this.schedulerCheckerInterval and start
   */
  private async checkTimers() {
    const logPrefix = `${this.constructor.name}::checkTimers`;
    winston.debug(`${logPrefix} looking for scheduled resets.`);

    try {
      for (const scheduleData of this.getScheduledVirtualDataPoints()) {
        const vdpId = scheduleData.id;
        const counterId = vdpId;

        // Double check if there are scheduled resets
        if (typeof scheduleData.resetSchedules === 'undefined') {
          continue;
        }

        // Iterate over all scheduled resets of a virtual counter
        for (const [index, entry] of scheduleData.resetSchedules.entries()) {
          winston.debug(
            `${logPrefix} found scheduling for id: ${counterId} with index: ${index} : ${JSON.stringify(
              entry
            )}`
          );

          // Check if there is a active timer for this reset
          if (
            this.startedTimers[counterId] &&
            this.startedTimers[counterId][index] !== undefined
          ) {
            winston.debug(
              `${logPrefix} timer for ${counterId} already started.`
            );
            continue;
          }

          const now = new Date();

          const nextScheduling = CounterManager.calcNextTrigger(entry, now);

          const timeDiff = now.getTime() - nextScheduling.getTime();
          winston.debug(
            `${logPrefix} local time for next reset found: ${nextScheduling.toLocaleString()}. Current local time is: ${now.toLocaleString()}`
          );
          winston.debug(`Time difference to next trigger: ${timeDiff}`);
          winston.debug(`Used Interval: ${this.schedulerCheckerInterval}`);
          //Check if diff is in range of interval. Only near resets are real scheduled via setTimeout queue
          if (timeDiff > this.schedulerCheckerInterval * -1) {
            winston.debug(
              `${logPrefix} ${nextScheduling.toLocaleString()} reset is inside next timer interval. Start reset timer for virtual data point : ${counterId} with index: ${index}`
            );

            this.startedTimers[counterId] = {
              ...this.startedTimers[counterId],
              [index]: setTimeout(() => {
                try {
                  winston.debug(
                    `${logPrefix} timer for ${counterId} expired. Start reset.`
                  );
                  this.reset(counterId, index);
                  clearTimeout(this.startedTimers[counterId][index]);
                  this.startedTimers[counterId][index] = undefined;
                } catch (error) {
                  winston.error(
                    `${logPrefix} error resetting counter: ${error}`
                  );
                }
              }, timeDiff * -1)
            };
          }
        }
      }
    } catch (error) {
      winston.error(`${logPrefix} Error while checking timers: ${error}`);
    }
  }

  /**
   * Register checktimers to interval queue
   */
  private registerScheduleChecker(): void {
    const logPrefix = `${this.constructor.name}::registerScheduleChecker`;
    if (!this.schedulerChecker) {
      winston.debug(
        `${logPrefix} set interval with timing ${this.schedulerCheckerInterval} for scheduler checker.`
      );
      this.schedulerChecker = SynchronousIntervalScheduler.getInstance();
      this.schedulerChecker.addListener(
        [this.schedulerCheckerInterval],
        this.checkTimers.bind(this)
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
  private static calcNextTrigger(
    scheduleData: ScheduleDescription,
    currentDate: Date
  ): Date {
    // Find next day if day is set
    // @ts-ignore
    if (scheduleData?.day) {
      return CounterManager.calcWithDay(scheduleData, currentDate);
    } else {
      return CounterManager.calcWithDate(scheduleData, currentDate);
    }
  }

  /**
   * Calculate next trigger date with defined day
   */
  private static calcWithDate(
    scheduleData: ScheduleDescription,
    currentDate: Date
  ): Date {
    const logPrefix = `${this.constructor.name}::calcWithDate`;
    const timeData: ScheduleTimeDataType = {
      year: currentDate.getFullYear(),
      month:
        scheduleData.month === 'Every'
          ? currentDate.getMonth()
          : scheduleData.month - 1,
      date:
        //@ts-ignore
        scheduleData.date && scheduleData.date !== 'Every'
          ? //@ts-ignore
            scheduleData.date
          : currentDate.getDate(),
      hours:
        scheduleData.hours === 'Every'
          ? currentDate.getHours()
          : scheduleData.hours,
      minutes:
        scheduleData.minutes === 'Every'
          ? currentDate.getMinutes()
          : scheduleData.minutes,
      sec: scheduleData.seconds
    };
    let dateFromScheduling = new Date(
      timeData.year,
      timeData.month,
      timeData.date,
      timeData.hours,
      timeData.minutes,
      timeData.sec
    );
    let diff = currentDate.getTime() - dateFromScheduling.getTime();
    // generated dateFromScheduling in past search for next event
    if (!(diff < 0)) {
      // increase every entries with one and check if new date is in future
      for (const entry of ['minutes', 'hours', 'date', 'month', 'year']) {
        // Ignore non 'Every' entries but there is no year entry
        //@ts-ignore date does not exists on ScheduleDescription
        if (scheduleData[entry] !== 'Every' && entry !== 'year') continue;
        timeData[entry as Partial<keyof ScheduleTimeDataType>] += 1;
        dateFromScheduling = new Date(
          timeData.year,
          timeData.month,
          timeData.date,
          timeData.hours,
          timeData.minutes,
          timeData.sec
        );

        diff = currentDate.getTime() - dateFromScheduling.getTime();
        if (diff < 0) {
          if (
            ['date', 'month', 'year'].includes(entry) &&
            scheduleData.hours === 'Every'
          ) {
            // If day, month or year is increased, and hour is "Every", then next scheduled hour is 00
            dateFromScheduling = date.setHours(dateFromScheduling, 0);
          }

          // New date is in future, break out for loop
          return dateFromScheduling;
        }
        timeData[entry as Partial<keyof ScheduleTimeDataType>] -= 1;
      }
      winston.error(
        `${logPrefix} no next date found for: ${JSON.stringify(scheduleData)}`
      );
    }
    return dateFromScheduling;
  }

  private static calcWithDay(
    scheduleData: ScheduleDescription,
    currentDate: Date
  ): Date {
    const timeData: ScheduleTimeDataType = {
      year: currentDate.getFullYear(),
      month:
        scheduleData.month === 'Every'
          ? currentDate.getMonth()
          : scheduleData.month - 1,
      date:
        //@ts-ignore
        scheduleData.day !== 'Every'
          ? //@ts-ignore
            scheduleData.day
          : currentDate.getDate(),
      hours:
        scheduleData.hours === 'Every'
          ? currentDate.getHours()
          : scheduleData.hours,
      minutes:
        scheduleData.minutes === 'Every'
          ? currentDate.getMinutes()
          : scheduleData.minutes,
      sec: scheduleData.seconds
    };
    let dateFromScheduling: Date;
    // @ts-ignore
    if (scheduleData?.day !== 'Every') {
      dateFromScheduling = new Date(
        timeData.year,
        timeData.month,
        currentDate.getDate(),
        timeData.hours,
        timeData.minutes,
        timeData.sec
      );

      dateFromScheduling =
        // @ts-ignore
        date[`next${scheduleData?.day}`]?.(dateFromScheduling);

      const diff = currentDate.getTime() - dateFromScheduling.getTime();
      if (!(diff < 0)) {
        dateFromScheduling = new Date(
          timeData.year,
          timeData.month,
          dateFromScheduling.getDay() + 7,
          timeData.hours,
          timeData.minutes,
          timeData.sec
        );
      }
      return dateFromScheduling;
    } else {
      dateFromScheduling = new Date(
        timeData.year,
        timeData.month,
        timeData.date,
        timeData.hours,
        timeData.minutes,
        timeData.sec
      );

      const diff = currentDate.getTime() - dateFromScheduling.getTime();

      if (!(diff < 0)) {
        // increase every entries with one and check if new date is in future
        for (const entry of ['minutes', 'hours', 'date', 'month', 'year']) {
          // Ignore non 'Every' entries
          if (
            //@ts-ignore date does not exists on ScheduleDescription
            ((entry !== 'date' && scheduleData[entry] !== 'Every') ||
              //@ts-ignore day does not exists on ScheduleDescription
              (entry === 'date' && scheduleData.day !== 'Every')) &&
            entry !== 'year'
          ) {
            continue;
          }
          timeData[entry as Partial<keyof ScheduleTimeDataType>] += 1;
          dateFromScheduling = new Date(
            timeData.year,
            timeData.month,
            timeData.date,
            timeData.hours,
            timeData.minutes,
            timeData.sec
          );

          const diff = currentDate.getTime() - dateFromScheduling.getTime();
          if (diff < 0) {
            // New date is in future, break out for loop
            return dateFromScheduling;
          }
          timeData[entry as Partial<keyof ScheduleTimeDataType>] -= 1;
        }
      }
      return dateFromScheduling;
    }
  }

  /**
   * Returns all virtual data point configurations for counters with active scheduled resets.
   */
  private getScheduledVirtualDataPoints(): IVirtualDataPointConfig[] {
    return this.configManager.config?.virtualDataPoints?.filter((vdp) => {
      return (
        vdp.operationType === 'counter' && vdp.resetSchedules?.length !== 0
      );
    });
  }
}
