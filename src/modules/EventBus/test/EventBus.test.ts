import { EventBus } from '..';
jest.mock('winston');

describe('Test EventBus', () => {
  test('emit should call all callbacks once with event', async () => {
    const event = {
      payload: 123
    };

    const testCb1 = jest.fn();
    const testCb2 = jest.fn();

    const bus = new EventBus();

    bus.addEventListener(testCb1, 'id1');
    bus.addEventListener(testCb2, 'id2');
    bus.addEventListener(testCb2, 'id2');

    await bus.push(event);

    expect(testCb1).toBeCalledTimes(1);
    expect(testCb2).toBeCalledTimes(1);
    expect(testCb1).toBeCalledWith(event);
    expect(testCb2).toBeCalledWith(event);
  });

  test('multiple registration with same id is saved once', async () => {
    const event = {
      payload: 123
    };

    const testCb1 = jest.fn();
    const testCb2 = jest.fn();

    const bus = new EventBus();

    bus.addEventListener(testCb1, 'id1');
    bus.addEventListener(testCb2, 'id2');
    bus.addEventListener(testCb1, 'id1');
    bus.addEventListener(testCb1, 'id1');
    bus.addEventListener(testCb2, 'id2');
    bus.addEventListener(testCb2, 'id2');

    await bus.push(event);

    expect(testCb1).toBeCalledTimes(1);
    expect(testCb2).toBeCalledTimes(1);
    expect(testCb1).toBeCalledWith(event);
    expect(testCb2).toBeCalledWith(event);
  });

  test('different callbacks with same id are overwritten', async () => {
    const event = {
      payload: 123
    };

    const testCb1 = jest.fn();
    const testCb2 = jest.fn();

    const bus = new EventBus();

    bus.addEventListener(testCb1, 'id1');
    bus.addEventListener(testCb2, 'id1');

    await bus.push(event);

    expect(testCb1).toBeCalledTimes(0);
    expect(testCb2).toBeCalledTimes(1);
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

    bus.addEventListener(testCb1, 'id1');
    bus.addEventListener(testCb2, 'id2');
    bus.removeEventListener('id1');
    await bus.push(event);

    expect(testCb1).toBeCalledTimes(0);
    expect(testCb2).toBeCalledTimes(1);
    expect(testCb2).toBeCalledWith(event);

    bus.removeEventListener('id2');

    await bus.push(event);
    await bus.push(event);

    expect(testCb2).toBeCalledTimes(1);
  });

  test('removing multiple registration is successful as only one registration happens', async () => {
    type TestEvent = {
      payload: number;
    };

    const event: TestEvent = {
      payload: 123
    };

    const testCb1 = jest.fn();
    const testCb2 = jest.fn();

    const bus = new EventBus();

    bus.addEventListener(testCb1, 'id1');
    bus.addEventListener(testCb2, 'id2');
    bus.addEventListener(testCb1, 'id1');
    bus.addEventListener(testCb1, 'id1');
    bus.addEventListener(testCb2, 'id2');

    bus.removeEventListener('id1');
    bus.removeEventListener('id2');

    await bus.push(event);

    expect(testCb1).toBeCalledTimes(0);
    expect(testCb2).toBeCalledTimes(0);
  });

  test('removing non existing listener does not throw error', async () => {
    type TestEvent = {
      payload: number;
    };

    const event: TestEvent = {
      payload: 123
    };

    const testCb1 = jest.fn();
    const testCb2 = jest.fn();

    const bus = new EventBus();

    bus.addEventListener(testCb1, 'id1');
    bus.addEventListener(testCb2, 'id2');

    bus.removeEventListener('id3');
    bus.removeEventListener('id1');
    bus.removeEventListener('id2');

    await bus.push(event);

    expect(testCb1).toBeCalledTimes(0);
    expect(testCb2).toBeCalledTimes(0);
  });
});
