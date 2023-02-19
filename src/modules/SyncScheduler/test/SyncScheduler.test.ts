import { SynchronousIntervalScheduler } from '../index';

jest.useFakeTimers();

describe('Test SyncScheduler', () => {
  const sis = SynchronousIntervalScheduler.getInstance();

  afterAll(() => {
    sis.shutdown();
  });

  /**
   * NOTE: Advancing times affect following tests as well!
   * Therefore only +1ms in time advancements, so it doesn't accumulate.
   * As SyncScheduler runs every 100ms, for example if two tests use
   * 520 and 220ms advancement, the third test would start at 40th millisecond
   * and resultant counter numbers might differ!
   */

  test('Scheduler should call subscribers with different schedules', () => {
    let counter500 = 0;
    let counter100 = 0;
    sis.addListener([500], () => (counter500 += 1));
    sis.addListener([100], () => (counter100 += 1));

    jest.advanceTimersByTime(501);

    expect(counter500).toEqual(1);
    expect(counter100).toEqual(5);
  });

  test('Multiple subscribers for single schedule', () => {
    let counter1 = 0;
    let counter2 = 0;
    sis.addListener([200], () => (counter1 += 1));

    jest.advanceTimersByTime(601);

    expect(counter1).toEqual(3);

    sis.addListener([200], () => (counter2 += 1));

    jest.advanceTimersByTime(801);

    expect(counter2).toEqual(4);
  });

  test('Subscribers can be removed', () => {
    let counter = 0;
    const id1 = sis.addListener([200], () => (counter += 1));
    const id2 = sis.addListener([200], () => (counter += 1));

    jest.advanceTimersByTime(201);

    expect(counter).toEqual(2);

    sis.removeListener(id1);

    jest.advanceTimersByTime(201);

    expect(counter).toEqual(3);

    sis.removeListener(id2);

    jest.advanceTimersByTime(1000);

    expect(counter).toEqual(3);
  });

  test('Longer time interval works as expected', () => {
    let counter = 0;
    sis.addListener([10000], () => (counter += 1));

    jest.advanceTimersByTime(10001);

    expect(counter).toEqual(1);

    jest.advanceTimersByTime(10001);

    expect(counter).toEqual(2);
  });
});
