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

    const bus = new EventBus<TestEvent>();

    bus.onEvent(testCb1);
    bus.onEvent(testCb2);
    bus.onEvent(testCb2);

    await bus.push(event);

    expect(testCb1).toBeCalledTimes(1);
    expect(testCb2).toBeCalledTimes(1);
    expect(testCb1).toBeCalledWith(event);
    expect(testCb2).toBeCalledWith(event);
  });
});
