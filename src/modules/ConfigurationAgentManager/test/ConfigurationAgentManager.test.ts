import fetch from 'node-fetch';
import { ConfigurationAgentManager } from '..';
import {
  ICosNetworkAdapterSetting,
  ICosNetworkAdapterStatus
} from '../interfaces';

function log(m: any) {
  //console.log(m);
}

jest.mock('winston', () => {
  return {
    debug: log,
    warn: log,
    error: log,
    verbose: log
  };
});
jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');
let mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('ConfigurationAgentManager', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // it clears the cache
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('hostname is correct in development', () => {
    process.env.NODE_ENV = 'development';
    let configAgentManager = require('..').ConfigurationAgentManager;
    expect(configAgentManager.hostname).toBe('http://localhost');
  });

  test('hostname is correct in non-development', () => {
    process.env.NODE_ENV = 'test';
    let configAgentManager = require('..').ConfigurationAgentManager;
    expect(configAgentManager.hostname).toBe('http://172.17.0.1');
  });

  test('port and prefix are correct', () => {
    expect(ConfigurationAgentManager.port).toBe('1884');
    expect(ConfigurationAgentManager.pathPrefix).toBe('/api/v1');
  });

  describe('successful cases', () => {
    test('System restart works correctly', async () => {
      mockedFetch.mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify({}), { status: 201 }))
      );
      const result = await ConfigurationAgentManager.systemRestart();
      expect(result).toStrictEqual({});
    });

    test('System versions are read correctly', async () => {
      mockedFetch.mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify([
              { Name: 'name', DisplayName: 'test', Version: '1.4' }
            ])
          )
        )
      );
      const result = await ConfigurationAgentManager.getSystemVersions();
      expect(Array.isArray(result)).toBeTruthy();
      expect(result[0].Version).toBe('1.4');
    });

    test('Networks adapters are read correctly', async () => {
      mockedFetch.mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify([{ id: 'enoX1', enabled: true, ipv4Settings: [] }])
          )
        )
      );
      const result = await ConfigurationAgentManager.getNetworkAdapters();
      expect(Array.isArray(result)).toBeTruthy();
      expect(result[0].id).toBe('enoX1');
      expect(result[0].enabled).toBeTruthy();
      expect(Array.isArray(result[0].ipv4Settings)).toBeTruthy();
    });

    test('Specific network adapter setting is read correctly', async () => {
      mockedFetch.mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({ id: 'enoX1', enabled: true, ipv4Settings: [] })
          )
        )
      );
      const result =
        (await ConfigurationAgentManager.getSingleNetworkAdapterSetting(
          'enoX1'
        )) as ICosNetworkAdapterSetting;
      expect(mockedFetch).toHaveBeenCalledWith(
        expect.stringContaining('enoX1'),
        expect.objectContaining({})
      );
      expect(Array.isArray(result)).toBeFalsy();
      expect(result.id).toBe('enoX1');
      expect(result.enabled).toBeTruthy();
    });

    test('Specific network adapter status is read correctly', async () => {
      mockedFetch.mockResolvedValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({
              linkStatus: 'connected',
              configurationStatus: 'configured',
              message: 'ok'
            })
          )
        )
      );
      const result =
        (await ConfigurationAgentManager.getSingleNetworkAdapterStatus(
          'enoX1'
        )) as ICosNetworkAdapterStatus;
      expect(mockedFetch).toHaveBeenCalledWith(
        expect.stringContaining('enoX1'),
        expect.objectContaining({})
      );
      expect(Array.isArray(result)).toBeFalsy();
      expect(result.linkStatus).toBe('connected');
    });
  });

  describe('fail cases', () => {
    test('System restart returns 500', async () => {
      try {
        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(new Response(JSON.stringify({}), { status: 500 }))
        );

        const result = await ConfigurationAgentManager.systemRestart();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    test('System restart rejects', async () => {
      try {
        mockedFetch.mockResolvedValueOnce(Promise.reject(new Response()));

        const result = await ConfigurationAgentManager.systemRestart();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    test('Get Versions returns 500', async () => {
      try {
        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(new Response(JSON.stringify({}), { status: 500 }))
        );

        const result = await ConfigurationAgentManager.getSystemVersions();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    test('Get Versions rejects', async () => {
      try {
        mockedFetch.mockResolvedValueOnce(Promise.reject(new Response()));

        const result = await ConfigurationAgentManager.getSystemVersions();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    test('Get network adapters returns 500', async () => {
      try {
        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(new Response(JSON.stringify({}), { status: 500 }))
        );

        const result = await ConfigurationAgentManager.getNetworkAdapters();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    test('Get network adapters rejects', async () => {
      try {
        mockedFetch.mockResolvedValueOnce(Promise.reject(new Response()));

        const result = await ConfigurationAgentManager.getNetworkAdapters();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    test('Get single network adapter setting returns 500', async () => {
      try {
        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(new Response(JSON.stringify({}), { status: 500 }))
        );

        const result =
          await ConfigurationAgentManager.getSingleNetworkAdapterSetting(
            'enoX1'
          );
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    test('Get single network adapter setting rejects', async () => {
      try {
        mockedFetch.mockResolvedValueOnce(Promise.reject(new Response()));

        const result =
          await ConfigurationAgentManager.getSingleNetworkAdapterSetting(
            'enoX1'
          );
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    test('no id given to get single network adapter setting', async () => {
      try {
        let id: any;
        const result =
          await ConfigurationAgentManager.getSingleNetworkAdapterSetting(id!);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toBe('Adapter Id not correct');
      }
    });

    test('Get single network adapter status returns 500', async () => {
      try {
        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(new Response(JSON.stringify({}), { status: 500 }))
        );

        const result =
          await ConfigurationAgentManager.getSingleNetworkAdapterStatus(
            'enoX1'
          );
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    test('Get single network adapter status rejects', async () => {
      try {
        mockedFetch.mockResolvedValueOnce(Promise.reject(new Response()));

        const result =
          await ConfigurationAgentManager.getSingleNetworkAdapterStatus(
            'enoX1'
          );
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    test('no id given to get single network adapter status', async () => {
      try {
        let id: any;
        const result =
          await ConfigurationAgentManager.getSingleNetworkAdapterStatus(id!);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toBe('Adapter Id not correct');
      }
    });

    test('Response json is not correctly formed', async () => {
      try {
        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(new Response('{a:5'))
        );

        const result =
          await ConfigurationAgentManager.getSingleNetworkAdapterStatus(
            'enoX1'
          );
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });
});
