import { CounterManager } from '..';
import { ScheduleDescription, DateType, DayType } from '../interfaces';
import * as date from 'date-fns';

jest.mock('winston');
jest.mock('fs');

const configManagerMock = {
  //id kann weg
  id: 'kann weg',
  config: {},
  runtimeConfig: {},
  defaultTemplates: {},
  authUsers: {},
  configPath: '',
  dataSourcesManager: {},
  dataSinksManager: {},
  init: jest.fn(),
  setupDefaultDataSources: jest.fn(),
  setupDefaultDataSinks: jest.fn(),
  factoryResetConfiguration: jest.fn(),
  applyTemplate: jest.fn(),
  getFilteredMapping: jest.fn(),
  bulkChangeDataSourceDataPoints: jest.fn(),
  bulkChangeDataSinkDataPoints: jest.fn(),
  updateMessengerConfig: jest.fn(),
  bulkChangeVirtualDataPoints: jest.fn(),
  bulkChangeMapings: jest.fn(),
  changeConfig: jest.fn(),
  saveConfig: jest.fn(),
  getTermsAndConditions: jest.fn(),
  saveAuthConfig: jest.fn(),
  restoreConfigFile: jest.fn(),
  configChangeCompleted: jest.fn(),
  checkJwtKeyPair: jest.fn(),
  generateJwtKeyPair: jest.fn()
};
const datePointCacheMock = {
  resetValue: jest.fn()
};

describe('Test CounterManager', () => {
  describe.each([
    {
      currentTime: new Date(2022, 5, 17, 20, 15, 10) // 17.06.2022 20:15:10,
    },
    {
      currentTime: new Date(2022, 11, 31, 23, 59, 0) // 31.12.2022 23:59:00
    },
    {
      currentTime: new Date(2023, 0, 1, 0, 0, 0) // 1.1.2023 00:00:00
    },
    {
      currentTime: new Date(2023, 1, 15, 12, 0, 10) // 15.2.2023 12:00:10
    }
  ])(
    'currentTime=$currentTime.toISOString (shown in local timezone)',
    ({ currentTime }) => {
      describe('testing static methods', () => {
        describe(`calcNextTrigger()`, () => {
          describe(`with defined date`, () => {
            it('full fixed date', () => {
              const schedule: ScheduleDescription = {
                month: 12, //December
                date: 20,
                hours: 8,
                minutes: 0,
                seconds: 0,
                lastReset: undefined,
                created: Date.now()
              }; // 20.12.2022 9:00:00

              //Increase expected year if it is already date behind
              const expectedYear =
                date.getMonth(currentTime) === 11 &&
                date.getDate(currentTime) > schedule.date
                  ? date.getYear(currentTime) + 1
                  : date.getYear(currentTime);

              const scheduleDate = new Date(
                expectedYear,
                (schedule.month as number) - 1, // December = 11 for new Date() function
                schedule.date as number,
                schedule.hours as number,
                schedule.minutes as number,
                schedule.seconds as number
              );

              // @ts-ignore
              const next = CounterManager.calcNextTrigger(
                schedule,
                currentTime
              );
              expect(next.toLocaleString()).toBe(scheduleDate.toLocaleString());
            });

            it('fix date every month missed by 2 days', () => {
              const schedule: ScheduleDescription = {
                month: 'Every',
                date: (date.getDate(currentTime) - 2) as DateType,
                hours: date.getHours(currentTime),
                minutes: date.getMinutes(currentTime),
                seconds: date.getSeconds(currentTime),
                lastReset: undefined,
                created: Date.now()
              };
              const scheduleDate = new Date(
                date.getYear(currentTime),
                date.getMonth(currentTime) + 1,
                schedule.date as number,
                schedule.hours as number,
                schedule.minutes as number,
                schedule.seconds as number
              );

              // @ts-ignore
              const next = CounterManager.calcNextTrigger(
                schedule,
                currentTime
              );
              expect(next.toLocaleString()).toBe(scheduleDate.toLocaleString());
            });

            it('fix date every month next in 1 day', () => {
              const schedule: ScheduleDescription = {
                month: 'Every',
                date: (date.getDate(currentTime) + 1) as DateType,
                hours: date.getHours(currentTime),
                minutes: date.getMinutes(currentTime),
                seconds: date.getSeconds(currentTime),
                lastReset: undefined,
                created: Date.now()
              };
              const scheduleDate = new Date(
                date.getYear(currentTime),
                date.getMonth(currentTime),
                schedule.date as number,
                schedule.hours as number,
                schedule.minutes as number,
                schedule.seconds as number
              );
              // @ts-ignore
              const next = CounterManager.calcNextTrigger(
                schedule,
                currentTime
              );
              expect(next.toISOString()).toBe(scheduleDate.toISOString());
            });

            it('every month on 15th and every hour at this days', () => {
              const schedule: ScheduleDescription = {
                month: 'Every',
                date: 15,
                hours: 'Every',
                minutes: date.getMinutes(currentTime),
                seconds: date.getSeconds(currentTime),
                lastReset: undefined,
                created: Date.now()
              };

              //Increase expected month if it is already date behind
              const expectedMonth =
                date.getDate(currentTime) > schedule.date
                  ? date.getMonth(currentTime) + 1
                  : date.getMonth(currentTime);

              //Expected hour is next hour if we are on the same day, otherwise 00:00:00
              const expectedHour =
                date.getDate(currentTime) === schedule.date
                  ? date.getHours(currentTime) + 1
                  : 0;

              const scheduleDate = new Date(
                date.getYear(currentTime),
                expectedMonth,
                schedule.date as number,
                expectedHour,
                schedule.minutes as number,
                schedule.seconds as number
              );
              //@ts-ignore
              const next = CounterManager.calcNextTrigger(
                schedule,
                currentTime
              );
              expect(next.toLocaleString()).toBe(scheduleDate.toLocaleString());
            });
          });

          describe(`with specific weekday`, () => {
            test.each([
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday'
            ])('next %s', (day) => {
              const schedule: ScheduleDescription = {
                month: 'Every',
                day: day as DayType,
                hours: date.getHours(currentTime),
                minutes: date.getMinutes(currentTime),
                seconds: date.getSeconds(currentTime),
                lastReset: undefined,
                created: Date.now()
              };
              let scheduleDate = date[`next${day}`](currentTime);
              if (date.isBefore(scheduleDate, currentTime)) {
                scheduleDate = date.addMonths(scheduleDate, 1);
              }
              //@ts-ignore
              const next = CounterManager.calcNextTrigger(
                schedule,
                currentTime
              );
              expect(next.toLocaleString()).toBe(scheduleDate.toLocaleString());
            });
          });

          describe(`with every day`, () => {
            it('every day and every month', () => {
              const schedule: ScheduleDescription = {
                month: 'Every',
                day: 'Every',
                hours: 3,
                minutes: 0,
                seconds: 0,
                lastReset: undefined,
                created: Date.now()
              };

              const expectedDate =
                date.getHours(currentTime) >= schedule.hours
                  ? date.getDate(currentTime) + 1
                  : date.getDate(currentTime);

              const scheduleDate = new Date(
                date.getYear(currentTime),
                date.getMonth(currentTime),
                expectedDate,
                schedule.hours as number,
                schedule.minutes as number,
                schedule.seconds as number
              );
              //@ts-ignore
              const next = CounterManager.calcNextTrigger(
                schedule,
                currentTime
              );
              expect(next.toISOString()).toBe(scheduleDate.toISOString());
            });

            it('every DATE and every month', () => {
              const schedule: ScheduleDescription = {
                month: 'Every',
                date: 'Every',
                hours: 3,
                minutes: 0,
                seconds: 0,
                lastReset: undefined,
                created: Date.now()
              };

              const expectedDate =
                date.getHours(currentTime) >= schedule.hours
                  ? date.getDate(currentTime) + 1
                  : date.getDate(currentTime);

              const scheduleDate = new Date(
                date.getYear(currentTime),
                date.getMonth(currentTime),
                expectedDate,
                schedule.hours as number,
                schedule.minutes as number,
                schedule.seconds as number
              );
              //@ts-ignore
              const next = CounterManager.calcNextTrigger(
                schedule,
                currentTime
              );
              expect(next.toISOString()).toBe(scheduleDate.toISOString());
            });

            it('every day & month & hour', () => {
              const schedule: ScheduleDescription = {
                month: 'Every',
                day: 'Every',
                hours: 'Every',
                minutes: 0,
                seconds: 0,
                lastReset: undefined,
                created: Date.now()
              };

              const expectedHour =
                date.getMinutes(currentTime) >= schedule.minutes
                  ? date.getHours(currentTime) + 1
                  : date.getHours(currentTime);

              const scheduleDate = new Date(
                date.getYear(currentTime),
                date.getMonth(currentTime),
                date.getDate(currentTime),
                expectedHour,
                schedule.minutes as number,
                schedule.seconds as number
              );
              //@ts-ignore
              const next = CounterManager.calcNextTrigger(
                schedule,
                currentTime
              );
              expect(next.toISOString()).toBe(scheduleDate.toISOString());
            });

            it('every day & month & hour & minute', () => {
              const schedule: ScheduleDescription = {
                month: 'Every',
                day: 'Every',
                hours: 'Every',
                minutes: 'Every',
                seconds: 5,
                lastReset: undefined,
                created: Date.now()
              };
              const expectedMinutes =
                date.getSeconds(currentTime) >= schedule.seconds
                  ? date.getMinutes(currentTime) + 1
                  : date.getMinutes(currentTime);

              const scheduleDate = new Date(
                date.getYear(currentTime),
                date.getMonth(currentTime),
                date.getDate(currentTime),
                date.getHours(currentTime),
                expectedMinutes,
                schedule.seconds as number
              );
              //@ts-ignore
              const next = CounterManager.calcNextTrigger(
                schedule,
                currentTime
              );
              expect(next.toLocaleString()).toBe(scheduleDate.toLocaleString());
            });
          });
        });
      });
      // no side effects by implementation
    }
  );
  describe('testing instance methods', () => {
    let UUT: CounterManager;
    beforeEach(() => {
      UUT = new CounterManager(
        configManagerMock as any,
        datePointCacheMock as any
      );
    });

    describe('resetting a counter', () => {
      // Counter not available
      it('do not throw an exception if counter is not instanced', () => {
        const unknownCounter = 'unknownCounter';
        expect(() => UUT.reset(unknownCounter)).not.toThrowError();
      });
      // counter available
      it('counter is successfully reset', () => {
        const newId = 'id';
        UUT.increment(newId);
        expect(UUT.getValue(newId)).toBe(1);
        UUT.reset(newId);
        expect(UUT.getValue(newId)).toBe(0);
      });
    });
  });
});
