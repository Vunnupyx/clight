import { CounterManager, ScheduleDescription } from '..';

jest.mock('winston');
jest.mock('fs');

describe('Test CounterManager', () => {
  // no side effects by implementation
  describe(`testing calcNextTrigger()`, () => {
    // Constants no reset;
    const currentTime = new Date(2022, 5, 17, 0, 0, 0); // 17.06.2022 00:00:00
    describe(`with defined date`, () => {
      it('full fixed date', () => {
        const schedule: ScheduleDescription = {
          month: 12, //December
          date: 31,
          hours: 17,
          minutes: 0,
          seconds: 0,
          lastReset: undefined,
          created: Date.now()
        };
        // current time is  17.06.2022 00:00:00
        // @ts-ignore
        const next = CounterManager.calcNextTrigger(schedule, currentTime);
        const compare = new Date(2022, 11, 31, 17, 0, 0); // 31.12.2022 17:00:00

        expect(next.toLocaleString()).toBe(compare.toLocaleString());
      });

      it('fix date every month missed by 2 days', () => {
        const schedule: ScheduleDescription = {
          month: 'Every',
          date: 15,
          hours: 17,
          minutes: 0,
          seconds: 0,
          lastReset: undefined,
          created: Date.now()
        };
        // current time is  17.06.2022 00:00:00
        // @ts-ignore
        const next = CounterManager.calcNextTrigger(schedule, currentTime);
        const compare = new Date(2022, 6, 15, 17, 0, 0);
        expect(next.toLocaleString()).toBe(compare.toLocaleString());
      });

      it('fix date every month next in 1 day', () => {
        const schedule: ScheduleDescription = {
          month: 'Every',
          date: 18,
          hours: 17,
          minutes: 0,
          seconds: 0,
          lastReset: undefined,
          created: Date.now()
        };
        // current time is  17.06.2022 00:00:00
        // @ts-ignore
        const next = CounterManager.calcNextTrigger(schedule, currentTime);
        const compare = new Date(2022, 5, 18, 17, 0, 0);
        expect(next.toISOString()).toBe(compare.toISOString());
      });

      it('every month at 15th and every hour at this days', () => {
        const input: ScheduleDescription = {
          month: 'Every',
          date: 15,
          hours: 'Every',
          minutes: 0,
          seconds: 0,
          lastReset: undefined,
          created: Date.now()
        };
        // Current 17.06.2022 17:00:00
        console.log(`
                Zeitpunkt: ${currentTime.toLocaleString()};
                Erwartet: 15.07.2022 0:0:0
                `);
        //@ts-ignore
        const next = CounterManager.calcNextTrigger(input, currentTime);
        const compare = new Date(2022, 6, 15, 0, 0, 0); // 15.07.2022 0:00:00
        expect(next.toLocaleString()).toBe(compare.toLocaleString());
      });
    });

    describe(`with weekday`, () => {
      it('next Monday', () => {
        const schedule: ScheduleDescription = {
          month: 'Every',
          day: 'Monday',
          hours: 17,
          minutes: 0,
          seconds: 0,
          lastReset: undefined,
          created: Date.now()
        };
        //@ts-ignore
        const next = CounterManager.calcNextTrigger(schedule, currentTime);
        const compare = new Date(2022, 5, 20, 17, 0, 0); // Next Monday
        expect(next.toLocaleString()).toBe(compare.toLocaleString());
      });

      it('next Tuesday', () => {
        const schedule: ScheduleDescription = {
          month: 'Every',
          day: 'Friday',
          hours: 17,
          minutes: 0,
          seconds: 0,
          lastReset: undefined,
          created: Date.now()
        };
        //@ts-ignore
        const next = CounterManager.calcNextTrigger(schedule, currentTime);
        const compare = new Date(2022, 5, 17, 17, 0, 0); // Next Tuesday
        expect(next.toLocaleString()).toBe(compare.toLocaleString());
      });

      it('next Wednesday', () => {
        const schedule: ScheduleDescription = {
          month: 'Every',
          day: 'Wednesday',
          hours: 17,
          minutes: 0,
          seconds: 0,
          lastReset: undefined,
          created: Date.now()
        };
        //@ts-ignore
        const next = CounterManager.calcNextTrigger(schedule, currentTime);
        const compare = new Date(2022, 5, 22, 17, 0, 0); // Next Wednesday
        expect(next.toLocaleString()).toBe(compare.toLocaleString());
      });

      it('next Thursday', () => {
        const schedule: ScheduleDescription = {
          month: 'Every',
          day: 'Thursday',
          hours: 17,
          minutes: 0,
          seconds: 0,
          lastReset: undefined,
          created: Date.now()
        };
        //@ts-ignore
        const next = CounterManager.calcNextTrigger(schedule, currentTime);
        const compare = new Date(2022, 5, 23, 17, 0, 0); // Next Thursday
        expect(next.toLocaleString()).toBe(compare.toLocaleString());
      });

      it('next Friday', () => {
        const schedule: ScheduleDescription = {
          month: 'Every',
          day: 'Friday',
          hours: 17,
          minutes: 0,
          seconds: 0,
          lastReset: undefined,
          created: Date.now()
        };
        //@ts-ignore
        const next = CounterManager.calcNextTrigger(schedule, currentTime);
        const compare = new Date(2022, 5, 17, 17, 0, 0); // Next Friday
        expect(next.toLocaleString()).toBe(compare.toLocaleString());
      });

      it('next Saturday', () => {
        const schedule: ScheduleDescription = {
          month: 'Every',
          day: 'Saturday',
          hours: 17,
          minutes: 0,
          seconds: 0,
          lastReset: undefined,
          created: Date.now()
        };
        //@ts-ignore
        const next = CounterManager.calcNextTrigger(schedule, currentTime);
        const compare = new Date(2022, 5, 18, 17, 0, 0); // Next Saturday
        expect(next.toLocaleString()).toBe(compare.toLocaleString());
      });

      it('next Sunday', () => {
        const schedule: ScheduleDescription = {
          month: 'Every',
          day: 'Sunday',
          hours: 17,
          minutes: 0,
          seconds: 0,
          lastReset: undefined,
          created: Date.now()
        };
        //@ts-ignore
        const next = CounterManager.calcNextTrigger(schedule, currentTime);
        const compare = new Date(2022, 5, 19, 17, 0, 0); // Next Friday
        expect(next.toLocaleString()).toBe(compare.toLocaleString());
      });
    });
    describe(`with every day`, () => {
      it('every day and every month', () => {
        const schedule: ScheduleDescription = {
          month: 'Every',
          day: 'Every',
          hours: 17,
          minutes: 0,
          seconds: 0,
          lastReset: undefined,
          created: Date.now()
        };
        //@ts-ignore
        const next = CounterManager.calcNextTrigger(schedule, currentTime);
        const compare = new Date(2022, 5, 17, 17, 0, 0);
        expect(next.toISOString()).toBe(compare.toISOString());
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
        //@ts-ignore
        const next = CounterManager.calcNextTrigger(schedule, currentTime);
        const compare = new Date(2022, 5, 17, 1, 0, 0);
        expect(next.toISOString()).toBe(compare.toISOString());
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
        //@ts-ignore
        const next = CounterManager.calcNextTrigger(schedule, currentTime);
        const compare = new Date(2022, 5, 17, 0, 0, 5);
        expect(next.toLocaleString()).toBe(compare.toLocaleString());
      });
    });
  });
});
