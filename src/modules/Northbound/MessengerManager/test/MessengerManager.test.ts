import fetch from 'node-fetch';

import { MessengerManager } from '..';
import { ConfigManager } from '../../../ConfigManager';
import { EventBus } from '../../../EventBus';

jest.mock('winston', () => {
  return {
    debug: (m) => console.log(m),
    warn: (m) => console.log(m)
  };
});

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');
let mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('MessengerManager', () => {
  let messengerAdapter: MessengerManager;
  let configManager = new ConfigManager({
    errorEventsBus: new EventBus<null>() as any,
    lifecycleEventsBus: new EventBus<null>() as any
  });

  afterEach(() => {
    messengerAdapter = null!;
    jest.clearAllMocks();
    configManager = new ConfigManager({
      errorEventsBus: new EventBus<null>() as any,
      lifecycleEventsBus: new EventBus<null>() as any
    });
  });

  test('initailization without configuration', async () => {
    messengerAdapter = new MessengerManager({
      configManager
    });
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual(undefined);
    expect(messengerAdapter.serverStatus.registration).toEqual('unknown');
    expect(messengerAdapter.serverStatus.server).toEqual('notconfigured');
  });

  test('initailization with empty configuration', async () => {
    messengerAdapter = new MessengerManager({
      configManager,
      messengerConfig: {}
    });
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual({});
    expect(messengerAdapter.serverStatus.registration).toEqual('unknown');
    expect(messengerAdapter.serverStatus.server).toEqual('notconfigured');
  });

  test('initailization with an invalid configuration', async () => {
    mockedFetch.mockResolvedValueOnce(
      Promise.resolve(new Response(JSON.stringify({}), { status: 401 }))
    );
    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
      model: 'string',
      name: 'string',
      organization: 'string',
      timezone: 'number'
    };
    messengerAdapter = new MessengerManager({
      configManager,
      messengerConfig
    });
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual(messengerConfig);
    expect(messengerAdapter.serverStatus.registration).toEqual('unknown');
    expect(messengerAdapter.serverStatus.server).toEqual('invalidauth');
  });

  test('initailization with already set configuration', async () => {
    mockedFetch
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify({ jwt: 'exampletoken' })))
      )
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify([{ SerialNumber: '' }])))
      );
    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
      model: 'string',
      name: 'string',
      organization: 'string',
      timezone: 'number'
    };
    messengerAdapter = new MessengerManager({
      configManager,
      messengerConfig
    });
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual(messengerConfig);
    expect(messengerAdapter.serverStatus.registration).toEqual('registered');
    expect(messengerAdapter.serverStatus.server).toEqual('available');
  });

  test('Successfully register machine with not yet registered configuration', async () => {
    mockedFetch
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify({ jwt: 'exampletoken' })))
      )
      .mockResolvedValueOnce(Promise.resolve(new Response(JSON.stringify([]))))
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({ msg: [{ id: 'machine1' }, { id: 'machine2' }] })
          )
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: { TimeZoneId: '1' } }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ id: 'organizationUnit1' }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({ msg: { 1: 'timezone1', 2: 'timezone2' } })
          )
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify('newMachineID')))
      );

    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
      model: 'string',
      name: 'string',
      organization: 'string',
      timezone: 'number'
    };
    messengerAdapter = new MessengerManager({
      configManager,
      messengerConfig
    });
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual(messengerConfig);
    expect(messengerAdapter.serverStatus.registration).toEqual('registered');
    expect(messengerAdapter.serverStatus.server).toEqual('available');
  });

  test('Unable to successfully register machine with not yet registered configuration', async () => {
    mockedFetch
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify({ jwt: 'exampletoken' })))
      )
      .mockResolvedValueOnce(Promise.resolve(new Response(JSON.stringify([]))))
      .mockResolvedValueOnce(Promise.reject(new Response(JSON.stringify({}))));

    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
      model: 'string',
      name: 'string',
      organization: 'string',
      timezone: 'number'
    };
    messengerAdapter = new MessengerManager({
      configManager,
      messengerConfig
    });
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual(messengerConfig);
    expect(messengerAdapter.serverStatus.registration).toEqual('notregistered');
    expect(messengerAdapter.serverStatus.server).toEqual('available');
  });

  test('Handles config change from already registered to empty config', async () => {
    mockedFetch
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify({ jwt: 'exampletoken' })))
      )
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify([{ SerialNumber: '' }])))
      )
      .mockResolvedValueOnce(Promise.reject(new Response(JSON.stringify({}))));

    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
      model: 'string',
      name: 'string',
      organization: 'string',
      timezone: 'number'
    };
    messengerAdapter = new MessengerManager({
      configManager,
      messengerConfig
    });
    await messengerAdapter.init();
    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual(messengerConfig);
    expect(messengerAdapter.serverStatus.registration).toEqual('registered');
    expect(messengerAdapter.serverStatus.server).toEqual('available');

    configManager.emit('configChange');

    expect(messengerAdapter.serverStatus.registration).toEqual('unknown');
    expect(messengerAdapter.serverStatus.server).toEqual('notconfigured');
  });

  test('Handles config change from empty config to new valid config and registers it', async () => {
    mockedFetch
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify({ jwt: 'exampletoken' })))
      )
      .mockResolvedValueOnce(Promise.resolve(new Response(JSON.stringify([]))))
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({ msg: [{ id: 'machine1' }, { id: 'machine2' }] })
          )
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: { TimeZoneId: '1' } }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ id: 'organizationUnit1' }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({ msg: { 1: 'timezone1', 2: 'timezone2' } })
          )
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify('newMachineID')))
      );

    messengerAdapter = new MessengerManager({
      configManager,
      messengerConfig: {}
    });
    await messengerAdapter.init();
    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual({});
    expect(messengerAdapter.serverStatus.registration).toEqual('unknown');
    expect(messengerAdapter.serverStatus.server).toEqual('notconfigured');

    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
      model: 'string',
      name: 'string',
      organization: 'string',
      timezone: 'number'
    };

    //@ts-ignore
    messengerAdapter.messengerConfig = messengerConfig;
    expect(messengerAdapter.messengerConfig).toEqual(messengerConfig);

    configManager.emit('configChange');
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(messengerAdapter.serverStatus.registration).toEqual('registered');
    expect(messengerAdapter.serverStatus.server).toEqual('available');
  });
});
