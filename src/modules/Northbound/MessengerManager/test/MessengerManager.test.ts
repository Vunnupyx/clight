import fetch from 'node-fetch';
import { MessengerManager } from '..';
import emptyDefaultConfig from '../../../../../_mdclight/runtime-files/templates/empty.json';
import { ConfigManager } from '../../../ConfigManager';
import { EventBus } from '../../../EventBus';
import { DataSinkProtocols } from '../../../../common/interfaces';

function log(m) {
  //console.log(m);
}

jest.mock('winston', () => {
  return {
    debug: log,
    info: log,
    error: log,
    warn: log
  };
});
jest.mock('../../../EventBus');
jest.mock('../../../ConfigManager');

const SERIALNUMBER = '1234';

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');
let mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

let messengerAdapter: MessengerManager;
let configManager = new ConfigManager({
  errorEventsBus: new EventBus(),
  lifecycleEventsBus: new EventBus()
});

describe('MessengerManager', () => {
  beforeEach(() => {
    //@ts-ignore
    configManager._config = {
      ...emptyDefaultConfig,
      general: {
        ...emptyDefaultConfig.general,
        //@ts-ignore
        serialNumber: SERIALNUMBER
      },
      dataSinks: [
        //@ts-ignore
        ...emptyDefaultConfig.dataSinks,
        {
          //@ts-ignore
          protocol: DataSinkProtocols.MTCONNECT,
          enabled: true,
          //@ts-ignore
          dataPoints: []
        }
      ]
    };
    //@ts-ignore
    configManager.config = configManager._config;
  });
  afterEach(() => {
    messengerAdapter = null!;
    configManager.removeAllListeners();
    jest.clearAllMocks();
  });

  test('initialization without configuration', async () => {
    messengerAdapter = new MessengerManager({
      configManager
    });
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual(undefined);
    expect(messengerAdapter.serverStatus.server).toEqual('not_configured');
    expect(messengerAdapter.serverStatus.registration).toEqual('unknown');
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
    expect(messengerAdapter.serverStatus.server).toEqual('not_configured');
    expect(messengerAdapter.serverStatus.registration).toEqual('unknown');
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
    expect(messengerAdapter.serverStatus.server).toEqual('invalid_auth');
    expect(messengerAdapter.serverStatus.registration).toEqual('unknown');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);
  });

  test('Missing serial number', async () => {
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
      );
    //@ts-ignore
    configManager._config = {
      ...emptyDefaultConfig,
      general: {
        ...emptyDefaultConfig.general,
        //@ts-ignore
        serialNumber: undefined
      },
      dataSinks: [
        //@ts-ignore
        ...emptyDefaultConfig.dataSinks,
        {
          //@ts-ignore
          protocol: DataSinkProtocols.MTCONNECT,
          enabled: true,
          //@ts-ignore
          dataPoints: []
        }
      ]
    };
    //@ts-ignore
    configManager.config = configManager._config;
    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
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
    //@ts-ignore
    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual(messengerConfig);
    expect(messengerAdapter.serverStatus.server).toEqual('available');
    expect(messengerAdapter.serverStatus.registration).toEqual('error');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(
      'missing_serial'
    );
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
        Promise.resolve(
          new Response(
            JSON.stringify([
              {
                SerialNumber: SERIALNUMBER,
                IpAddress: 'dm000000000000',
                Port: 7878
              }
            ])
          )
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({
              msg: {
                SerialNumber: SERIALNUMBER,
                IpAddress: 'dm000000000000',
                MTConnectAgentManagementMode: 'NA',
                Port: 7878
              }
            })
          )
        )
      );
    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
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
    expect(messengerAdapter.serverStatus.server).toEqual('available');
    expect(messengerAdapter.serverStatus.registration).toEqual('registered');
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
    expect(messengerAdapter.serverStatus.server).toEqual('available');
    expect(messengerAdapter.serverStatus.registration).toEqual('registered');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);
  });

  test('Duplicated machine: Existing serial', async () => {
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
        Promise.resolve(
          new Response(
            JSON.stringify([
              {
                SerialNumber: SERIALNUMBER,
                IpAddress: 'dm000055550000',
                Port: 7878
              }
            ])
          )
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({
              msg: {
                SerialNumber: SERIALNUMBER,
                IpAddress: 'dm000055550000',
                MTConnectAgentManagementMode: 'NA',
                Port: 7878
              }
            })
          )
        )
      );
    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
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
    expect(messengerAdapter.serverStatus.server).toEqual('available');
    expect(messengerAdapter.serverStatus.registration).toEqual('error');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(
      'duplicated'
    );
  });

  test('Duplicated machine: Different serial but same IP exists', async () => {
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
        Promise.resolve(
          new Response(
            JSON.stringify([
              {
                SerialNumber: '11111',
                IpAddress: 'dm000000000000',
                Port: 7878
              }
            ])
          )
        )
      );
    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
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
    expect(messengerAdapter.serverStatus.server).toEqual('available');
    expect(messengerAdapter.serverStatus.registration).toEqual('error');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(
      'duplicated'
    );
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
    expect(messengerAdapter.serverStatus.server).toEqual('available');
    expect(messengerAdapter.serverStatus.registration).toEqual('error');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(
      'unexpected_error'
    );
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
        Promise.resolve(
          new Response(
            JSON.stringify([
              {
                SerialNumber: SERIALNUMBER,
                IpAddress: 'dm000000000000',
                Port: 7878
              }
            ])
          )
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({
              msg: {
                SerialNumber: SERIALNUMBER,
                IpAddress: 'dm000000000000',
                MTConnectAgentManagementMode: 'NA',
                Port: 7878
              }
            })
          )
        )
      );

    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
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
    expect(messengerAdapter.serverStatus.server).toEqual('available');
    expect(messengerAdapter.serverStatus.registration).toEqual('registered');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);

    //@ts-ignore
    messengerAdapter.configManager.config.messenger = {};
    messengerAdapter.handleConfigChange();

    expect(messengerAdapter.serverStatus.server).toEqual('not_configured');
    expect(messengerAdapter.serverStatus.registration).toEqual('unknown');
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
        Promise.resolve(
          new Response(
            JSON.stringify([
              {
                SerialNumber: SERIALNUMBER,
                IpAddress: 'dm000000000000',
                Port: 7878
              }
            ])
          )
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({
              msg: {
                SerialNumber: SERIALNUMBER,
                IpAddress: 'dm000000000000',
                MTConnectAgentManagementMode: 'NA',
                Port: 7878
              }
            })
          )
        )
      );

    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
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
    expect(messengerAdapter.serverStatus.server).toEqual('available');
    expect(messengerAdapter.serverStatus.registration).toEqual('registered');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);

    configManager.config.messenger = messengerConfig;
    messengerAdapter.handleConfigChange();

    expect(messengerAdapter.serverStatus.server).toEqual('available');
    expect(messengerAdapter.serverStatus.registration).toEqual('registered');
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
    expect(messengerAdapter.serverStatus.server).toEqual('not_configured');
    expect(messengerAdapter.serverStatus.registration).toEqual('unknown');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);

    const messengerConfig = {
      hostname: 'string',
      username: 'string',
      password: 'string',
      model: 103,
      name: 'string',
      organization: 'organizationUnit1',
      timezone: 1
    };

    configManager.config.messenger = messengerConfig;
    expect(configManager.config.messenger).toEqual(messengerConfig);

    messengerAdapter.handleConfigChange();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(messengerAdapter.serverStatus.server).toEqual('available');
    expect(messengerAdapter.serverStatus.registration).toEqual('registered');
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
        Promise.resolve(
          new Response(
            JSON.stringify([
              {
                SerialNumber: SERIALNUMBER,
                IpAddress: 'dm000000000000',
                Port: 7878
              }
            ])
          )
        )
      )
      .mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({
              msg: {
                SerialNumber: SERIALNUMBER,
                IpAddress: 'dm000000000000',
                MTConnectAgentManagementMode: 'NA',
                Port: 7878
              }
            })
          )
        )
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
    expect(messengerAdapter.serverStatus.server).toEqual('available');
    expect(messengerAdapter.serverStatus.registration).toEqual('registered');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(null);
    //Organization unit is removed from Messenger UI and then resubmitted with that organization unit
    //@ts-ignore
    messengerAdapter.configManager.config.messenger = messengerConfig;
    await messengerAdapter.init();

    expect(messengerAdapter.serverStatus.server).toEqual('available');
    expect(messengerAdapter.serverStatus.registration).toEqual('error');
    expect(messengerAdapter.serverStatus.registrationErrorReason).toEqual(
      'invalid_organization'
    );
  });
});
