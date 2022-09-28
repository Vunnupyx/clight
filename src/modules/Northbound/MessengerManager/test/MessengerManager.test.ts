import { MessengerManager } from '..';
import axios from 'axios';

jest.mock('winston', () => {
  return {
    debug: (m) => console.log(m),
    warn: (m) => console.log(m)
  };
});
//jest.mock('winston');
jest.mock('axios');
let mockedAxios = axios as jest.Mocked<typeof axios>;

/*jest.mock('axios', () => {
  return {
    request: (m) => console.log(m)
  };
});*/

describe('MessengerManager', () => {
  let messengerAdapter: MessengerManager;

  afterEach(() => {
    messengerAdapter = null!;
    jest.clearAllMocks();
  });

  test('initailization without configuration', async () => {
    messengerAdapter = new MessengerManager({});
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual(undefined);
    expect(messengerAdapter.isMachineRegistered).toBeFalsy();
  });

  test('initailization with empty configuration', async () => {
    messengerAdapter = new MessengerManager({
      messengerConfig: {}
    });
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual({});
    expect(messengerAdapter.isMachineRegistered).toBeFalsy();
  });

  test('initailization with a configuration but Messenger not giving login token', async () => {
    mockedAxios.request.mockImplementation(async (callParams) => {
      if (callParams.url?.includes('login') && callParams.method === 'POST') {
        return {
          data: undefined
        };
      }
    });
    const messengerConfig = {
      host: 'string',
      username: 'string',
      password: 'string',
      model: 'string',
      name: 'string',
      organization: 'string',
      timezone: 'number'
    };
    messengerAdapter = new MessengerManager({
      messengerConfig
    });
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual(messengerConfig);
    expect(messengerAdapter.isMachineRegistered).toBeFalsy();
  });

  test('initailization with already set configuration', async () => {
    mockedAxios.request.mockImplementation(async (callParams) => {
      if (callParams.url?.includes('login') && callParams.method === 'POST') {
        return {
          data: 'exampletoken'
        };
      } else if (
        callParams.url === '/machines' &&
        callParams.method === 'GET' &&
        callParams.headers?.Authorization === 'Bearer exampletoken'
      ) {
        return {
          data: 'success'
        };
      }
    });
    const messengerConfig = {
      host: 'string',
      username: 'string',
      password: 'string',
      model: 'string',
      name: 'string',
      organization: 'string',
      timezone: 'number'
    };
    messengerAdapter = new MessengerManager({
      messengerConfig
    });
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual(messengerConfig);
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { User: messengerConfig.username, Pass: messengerConfig.password }
      })
    );
    expect(messengerAdapter.isMachineRegistered).toBeTruthy();
  });

  test('Successfully register machine with not yet registered configuration', async () => {
    mockedAxios.request.mockImplementation(async (callParams) => {
      if (callParams.url?.includes('login') && callParams.method === 'POST') {
        return {
          data: 'exampletoken'
        };
      } else if (callParams.headers?.Authorization !== 'Bearer exampletoken') {
        return;
      } else {
        if (callParams.url === '/machines' && callParams.method === 'GET') {
          return {
            data: false
          };
        } else if (callParams.url === '/machinecatalog') {
          return {
            data: 'machineCatalog'
          };
        } else if (
          callParams.url === '/machines/new' &&
          callParams.method === 'POST'
        ) {
          return {
            data: 'machineObject'
          };
        } else if (callParams.url === '/orgunits') {
          return {
            data: ['orgunit1', 'orgunit2']
          };
        } else if (callParams.url === '/classifiers/timezones') {
          return {
            data: ['timezone1', 'timezone2']
          };
        } else if (
          callParams.url === '/machines' &&
          callParams.method === 'POST'
        ) {
          return {
            data: 'success'
          };
        }
      }
    });
    const messengerConfig = {
      host: 'string',
      username: 'string',
      password: 'string',
      model: 'string',
      name: 'string',
      organization: 'string',
      timezone: 'number'
    };
    messengerAdapter = new MessengerManager({
      messengerConfig
    });
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual(messengerConfig);
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { User: messengerConfig.username, Pass: messengerConfig.password }
      })
    );
    expect(messengerAdapter.isMachineRegistered).toBeTruthy();
  });

  test('Unable to successfully Register machine with not yet registered configuration', async () => {
    mockedAxios.request.mockImplementation(async (callParams) => {
      if (callParams.url?.includes('login') && callParams.method === 'POST') {
        return {
          data: 'exampletoken'
        };
      } else if (callParams.headers?.Authorization !== 'Bearer exampletoken') {
        return;
      } else {
        if (callParams.url === '/machines' && callParams.method === 'GET') {
          return {
            data: false
          };
        } else if (callParams.url === '/machinecatalog') {
          return {
            data: 'machineCatalog'
          };
        } else if (
          callParams.url === '/machines/new' &&
          callParams.method === 'POST'
        ) {
          return {
            data: 'machineObject'
          };
        } else if (callParams.url === '/orgunits') {
          return {
            data: ['orgunit1', 'orgunit2']
          };
        } else if (callParams.url === '/classifiers/timezones') {
          return {
            data: ['timezone1', 'timezone2']
          };
        } else if (
          callParams.url === '/machines' &&
          callParams.method === 'POST'
        ) {
          return {
            data: false
          };
        }
      }
    });
    const messengerConfig = {
      host: 'string',
      username: 'string',
      password: 'string',
      model: 'string',
      name: 'string',
      organization: 'string',
      timezone: 'number'
    };
    messengerAdapter = new MessengerManager({
      messengerConfig
    });
    await messengerAdapter.init();

    expect(messengerAdapter).toBeInstanceOf(MessengerManager);
    expect(messengerAdapter.messengerConfig).toEqual(messengerConfig);
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { User: messengerConfig.username, Pass: messengerConfig.password }
      })
    );
    expect(messengerAdapter.isMachineRegistered).toBeFalsy();
  });
});
