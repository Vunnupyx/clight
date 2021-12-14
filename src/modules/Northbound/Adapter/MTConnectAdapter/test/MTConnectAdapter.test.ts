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
  stop: jest.fn()
};

const mockNet = {
  createServer: () => {
    return mockServer;
  }
};

jest.mock('winston');
jest.mock('net', () => {
  return mockNet;
});

import { MTConnectAdapter } from '..';

describe('Test MTCAdapter', () => {
  afterEach(() => {
    jest.clearAllMocks();
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

    console.log(listenForClients);
    // Mock socket connect
    await listenForClients(mockSocket);
    console.log('send changes');
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

    console.log('send changes');
    await adapter.sendChanged();

    data = mockSocket.write.mock.calls[2][0];
    dataParts = data.split('|');
    expect(dataParts[2]).toBe('1\n');
  });
});
