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

  test('initialization without configuration', async () => {
    messengerAdapter = new MessengerManager({
      configManager
    });
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual(undefined);
    expect(messengerAdapter.serverStatus.registration).toEqual('unknown');
    expect(messengerAdapter.serverStatus.server).toEqual('not_configured');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);
  });

  test('initialization with empty configuration', async () => {
    messengerAdapter = new MessengerManager({
      configManager,
      messengerConfig: {}
    });
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual({});
    expect(messengerAdapter.serverStatus.registration).toEqual('unknown');
    expect(messengerAdapter.serverStatus.server).toEqual('not_configured');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);
  });

  test('initialization with an invalid configuration', async () => {
    mockedFetch.mockResolvedValueOnce(
      Promise.resolve(new Response(JSON.stringify({}), { status: 401 }))
    );
    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
      license: 'string',
      model: 103,
      name: 'string',
      organization: 'organizationUnit1',
      timezone: 1
    };
    messengerAdapter = new MessengerManager({
      configManager,
      messengerConfig
    });
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual(messengerConfig);
    expect(messengerAdapter.serverStatus.registration).toEqual('unknown');
    expect(messengerAdapter.serverStatus.server).toEqual('invalid_auth');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);
  });

  test('initialization with already set configuration', async () => {
    mockedFetch
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify({ jwt: 'exampletoken' })))
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ Id: 103 }, { Id: 104 }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: { TimeZoneId: '1' } }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ Id: 'organizationUnit1' }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({ msg: { '1': 'timezone1', '2': 'timezone2' } })
          )
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify([{ SerialNumber: '' }])))
      );
    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
      license: 'string',
      model: 103,
      name: 'string',
      organization: 'organizationUnit1',
      timezone: 2
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
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);
  });

  test('Successfully register machine with not yet registered configuration', async () => {
    mockedFetch
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify({ jwt: 'exampletoken' })))
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ Id: 103 }, { Id: 104 }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: { TimeZoneId: '1' } }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ Id: 'organizationUnit1' }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({ msg: { '1': 'timezone1', '2': 'timezone2' } })
          )
        )
      )
      .mockResolvedValueOnce(Promise.resolve(new Response(JSON.stringify([]))))
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify('newMachineID')))
      );

    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
      license: 'string',
      model: 103,
      name: 'string',
      organization: 'organizationUnit1',
      timezone: 1
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
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);
  });

  test('Unable to successfully register machine due to unknown error but server is available', async () => {
    mockedFetch
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify({ jwt: 'exampletoken' })))
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ Id: 103 }, { Id: 104 }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: { TimeZoneId: '1' } }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ Id: 'organizationUnit1' }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({ msg: { '1': 'timezone1', '2': 'timezone2' } })
          )
        )
      )
      .mockResolvedValueOnce(Promise.resolve(new Response(JSON.stringify({}))));

    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
      license: 'string',
      model: 103,
      name: 'string',
      organization: 'organizationUnit1',
      timezone: 2
    };
    messengerAdapter = new MessengerManager({
      configManager,
      messengerConfig
    });
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual(messengerConfig);
    expect(messengerAdapter.serverStatus.registration).toEqual(
      'not_registered'
    );
    expect(messengerAdapter.serverStatus.server).toEqual('available');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);
  });

  test('Handles config change from already registered to empty config', async () => {
    mockedFetch
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify({ jwt: 'exampletoken' })))
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ Id: 103 }, { Id: 104 }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: { TimeZoneId: '1' } }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ Id: 'organizationUnit1' }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({ msg: { '1': 'timezone1', '2': 'timezone2' } })
          )
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify([{ SerialNumber: '' }])))
      );

    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
      license: 'string',
      model: 103,
      name: 'string',
      organization: 'organizationUnit1',
      timezone: 1
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
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);

    configManager.emit('configChange');

    expect(messengerAdapter.serverStatus.registration).toEqual('unknown');
    expect(messengerAdapter.serverStatus.server).toEqual('not_configured');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);
  });

  test('Handles resubmitting already registered config', async () => {
    mockedFetch
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify({ jwt: 'exampletoken' })))
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ Id: 103 }, { Id: 104 }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: { TimeZoneId: '1' } }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ Id: 'organizationUnit1' }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({ msg: { '1': 'timezone1', '2': 'timezone2' } })
          )
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify([{ SerialNumber: '' }])))
      );

    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
      license: 'string',
      model: 103,
      name: 'string',
      organization: 'organizationUnit1',
      timezone: 1
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
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);

    configManager.config.messenger = messengerConfig;
    configManager.emit('configChange');

    expect(messengerAdapter.serverStatus.registration).toEqual('registered');
    expect(messengerAdapter.serverStatus.server).toEqual('available');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);
  });

  test('Handles config change from empty config to new valid config and registers it', async () => {
    mockedFetch
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify({ jwt: 'exampletoken' })))
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ Id: 103 }, { Id: 104 }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: { TimeZoneId: '1' } }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ Id: 'organizationUnit1' }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({ msg: { '1': 'timezone1', '2': 'timezone2' } })
          )
        )
      )
      .mockResolvedValueOnce(Promise.resolve(new Response(JSON.stringify([]))))
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
    expect(messengerAdapter.serverStatus.server).toEqual('not_configured');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);

    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
      license: 'string',
      model: 103,
      name: 'string',
      organization: 'organizationUnit1',
      timezone: 1
    };

    configManager.config.messenger = messengerConfig;
    expect(configManager.config.messenger).toEqual(messengerConfig);

    configManager.emit('configChange');
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(messengerAdapter.serverStatus.registration).toEqual('registered');
    expect(messengerAdapter.serverStatus.server).toEqual('available');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);
  });

  test('Handles removed organization unit to an already registered config', async () => {
    mockedFetch
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify({ jwt: 'exampletoken' })))
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ Id: 103 }, { Id: 104 }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: { TimeZoneId: '1' } }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ Id: 'organizationUnit1' }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({ msg: { '1': 'timezone1', '2': 'timezone2' } })
          )
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify([{ SerialNumber: '' }])))
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ Id: 103 }, { Id: 104 }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: { TimeZoneId: '1' } }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ msg: [{ Id: 'organizationUnit9' }] }))
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({ msg: { '1': 'timezone1', '2': 'timezone2' } })
          )
        )
      );
    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
      license: 'string',
      model: 103,
      name: 'string',
      organization: 'organizationUnit1',
      timezone: 1
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

    //Organization unit is removed from Messenger UI and then resubmitted with that organization unit
    configManager.config.messenger = messengerConfig;
    await messengerAdapter.init();

    expect(messengerAdapter.serverStatus.registration).toEqual('error');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(
      'invalid_organization'
    );
    expect(messengerAdapter.serverStatus.server).toEqual('available');
  });
});
