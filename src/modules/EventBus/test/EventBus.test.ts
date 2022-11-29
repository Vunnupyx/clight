import { EventBus } from '..';

describe('Test EventBus', () => {
  test('emit should call all callbacks once with event', async () => {
    type TestEvent = {
      payload: number;
    };

    const event: TestEvent = {
      payload: 123
    };

    const testCb1 = jest.fn();
    const testCb2 = jest.fn();

    const bus = new EventBus();

    bus.addEventListener(testCb1);
    bus.addEventListener(testCb2);
    bus.addEventListener(testCb2);

    await bus.push(event);

    expect(testCb1).toBeCalledTimes(1);
    expect(testCb2).toBeCalledTimes(1);
    expect(testCb1).toBeCalledWith(event);
    expect(testCb2).toBeCalledWith(event);
  });

  test('removed callbacks should not be called', async () => {
    type TestEvent = {
      payload: number;
    };

    const event: TestEvent = {
      payload: 123
    };

    const testCb1 = jest.fn();
    const testCb2 = jest.fn();

    const bus = new EventBus();

    bus.addEventListener(testCb1);
    bus.addEventListener(testCb2);
    bus.removeEventListener(testCb1);
    await bus.push(event);

    expect(testCb1).toBeCalledTimes(0);
    expect(testCb2).toBeCalledTimes(1);
    expect(testCb2).toBeCalledWith(event);

    bus.removeEventListener(testCb2);

    await bus.push(event);
    await bus.push(event);

    expect(testCb2).toBeCalledTimes(1);
  });
});
