import { CounterManager, ScheduleDescription } from '..';


jest.mock('winston');
jest.mock('fs');

describe('testing next time', () => {
    const counterManager = new CounterManager({} as any);
    const currentTime = new Date(2022, 5, 17, 0, 0, 0);
    // fit('', () => {
    //     const schedule: ScheduleDescription = {
    //         month: 'Every',
    //         day: 'Every',
    //         hours: 17,
    //         minutes: 0,
    //         seconds: 0,
    //         lastReset: undefined,
    //         created: Date.now(),
    //     }
    //     //@ts-ignore
    //     const next = counterManager.calcNextTrigger(schedule, currentTime);
    //     const compare = new Date(2022, 5, 17, 17, 0,0);
    //     expect(next.toISOString()).toBe(compare.toISOString());
    // })

    fit('Monat Every aber Wochentag ist definiert', () => {
        const input: ScheduleDescription = {
            month: 'Every',
            date: 15,
            hours: 'Every',
            minutes: 0,
            seconds: 0,
            lastReset: undefined,
            created: Date.now()
        }
        // Erwarte nächsten Februar also 2023 Feb 1 15 Uhr
        //@ts-ignore
        const next = counterManager.calcNextTrigger(input, new Date(2022, 11, 17, 17,0,0));
        console.log(next);
    });
})