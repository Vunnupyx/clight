import net from 'net';
import { MTConnectAdapter } from '..';
import { ConfigManager } from '../../ConfigManager';
import { EventBus } from '../../EventBus';
import { DataItem } from '../DataItem';

jest.mock('winston');

describe('Test MTCAdapter', () => {
  let adapter = null;

  afterEach(async () => {
    await adapter.stop();
    adapter = null;
  });

  test('Server should send data items to new clients', (done) => {
    const PORT = 7879;
    const config = new ConfigManager({
      errorEventsBus: new EventBus<null>(),
      lifecycleEventsBus: new EventBus<null>()
    });
    config.runtimeConfig.mtconnect.listenerPort = PORT;
    adapter = new MTConnectAdapter(config);
    adapter.addDataItem(new DataItem('test'));
    adapter.start();

    const socket = new net.Socket();
    socket.on('data', async (data: String) => {
      const dataParts = data.split('|');

      const currentDate = new Date();
      const dataDate = new Date(dataParts[0]);

      expect(dataParts.length).toBe(3);
      expect(currentDate.getTime() - dataDate.getTime()).toBeLessThan(1000);
      expect(dataParts[1]).toBe('test');
      expect(dataParts[2]).toBe('UNAVAILABLE\n');

      socket.destroy();
      await adapter.stop();
      setTimeout(() => done());
    });
    socket.setEncoding('utf8');
    socket.connect(PORT);
  });

  test('Server should send changes', (done) => {
    const PORT = 7880;
    const config = new ConfigManager({
      errorEventsBus: new EventBus<null>(),
      lifecycleEventsBus: new EventBus<null>()
    });
    config.runtimeConfig.mtconnect.listenerPort = PORT;
    adapter = new MTConnectAdapter(config);
    const item = new DataItem('test1');
    adapter.addDataItem(item);
    adapter.start();

    let dataReceived = 0;

    const socket = new net.Socket();
    socket.on('data', async (data: String) => {
      dataReceived += 1;

      const dataParts = data.split('|');

      const currentDate = new Date();
      const dataDate = new Date(dataParts[0]);

      expect(dataParts.length).toBe(3);
      expect(currentDate.getTime() - dataDate.getTime()).toBeLessThan(1000);
      expect(dataParts[1]).toBe('test1');

      if (dataReceived === 1) {
        expect(dataParts[2]).toBe('UNAVAILABLE\n');
        item.value = 1;
        adapter.sendChanged();
      }

      if (dataReceived > 1) {
        expect(dataParts[2]).toBe('1\n');

        socket.destroy();
        await adapter.stop();
        setTimeout(() => done());
      }
    });
    socket.setEncoding('utf8');
    socket.connect(PORT);
  });
});
