import { DataItem } from '../DataItem';

const mockSocket = {
  write: jest.fn((line, cb) => {
    cb();
  }),
  setEncoding: jest.fn(),
  on: jest.fn(),
  setTimeout: jest.fn()
};

const mockServer = {
  listen: jest.fn(),
  on: jest.fn(),
  stop: jest.fn(),
  shutdown: jest.fn(),
  close: jest.fn().mockImplementation((cb) => cb?.())
};

const mockNet = {
  createServer: () => {
    return mockServer;
  }
};

function log(m) {
  //console.log(m);
}

const winstonMock = {
  winston: jest.fn(), // Constructor
  info: jest.fn(log),
  debug: jest.fn(log),
  warn: jest.fn(log)
};
jest.doMock('winston', () => {
  return winstonMock;
});

jest.mock('net', () => {
  return mockNet;
});

import { MTConnectAdapter } from '..';

describe('Test MTCAdapter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('Server starts correctly', async () => {
    const adapter = new MTConnectAdapter({ listenerPort: 0 });
    adapter.addDataItem(new DataItem('test'));
    adapter.start();

    expect(adapter.isRunning).toBeTruthy();

    const listenForClients = mockServer.on.mock.calls[0][1];

    await listenForClients(mockSocket);
  });

  test('Server stops and shuts down correctly', async () => {
    const adapter = new MTConnectAdapter({ listenerPort: 0 });
    adapter.addDataItem(new DataItem('test'));
    adapter.start();

    expect(adapter.isRunning).toBeTruthy();
    await adapter.stop();
    expect(adapter.isRunning).toBeFalsy();
    await adapter.shutdown();
    expect(winstonMock.info).toBeCalledWith(
      expect.stringContaining('shutdown successful')
    );
  });

  test('Server should send data items to new clients', async () => {
    const adapter = new MTConnectAdapter({ listenerPort: 0 });
    adapter.addDataItem(new DataItem('test'));
    adapter.start();

    const listenForClients = mockServer.on.mock.calls[0][1];

    await listenForClients(mockSocket);

    const data = mockSocket.write.mock.calls[0][0];

    const dataParts = data.split('|');

    const currentDate = new Date();
    const dataDate = new Date(dataParts[0]);

    expect(dataParts.length).toBe(3);
    expect(currentDate.getTime() - dataDate.getTime()).toBeLessThan(1000);
    expect(dataParts[1]).toBe('test');
    expect(dataParts[2]).toBe('UNAVAILABLE\n');
  });

  test('Server should send changes', async () => {
    const adapter = new MTConnectAdapter({ listenerPort: 0 });
    const item = new DataItem('test1');
    adapter.addDataItem(item);
    adapter.start();

    const listenForClients = mockServer.on.mock.calls[0][1];

    // Mock socket connect
    await listenForClients(mockSocket);
    await adapter.sendChanged();

    let data = mockSocket.write.mock.calls[1][0];
    let dataParts = data.split('|');

    expect(dataParts.length).toBe(3);

    const currentDate = new Date();
    const dataDate = new Date(dataParts[0]);
    expect(currentDate.getTime() - dataDate.getTime()).toBeLessThan(1000);

    expect(dataParts[1]).toBe('test1');
    expect(dataParts[2]).toBe('UNAVAILABLE\n');
    item.value = 1;

    await adapter.sendChanged();

    data = mockSocket.write.mock.calls[2][0];
    dataParts = data.split('|');
    expect(dataParts[2]).toBe('1\n');
  });
});
