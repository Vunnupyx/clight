import fs from 'fs';
import child_process, { ChildProcess } from 'child_process';
import { TLSKeyManager } from '..';

jest.mock('child_process');
jest.mock('fs');
jest.mock('path');

function log(m: any) {
  //console.log(m);
}

jest.mock('winston', () => {
  return {
    debug: log,
    warn: log,
    error: log
  };
});

let tlsKeyManager: TLSKeyManager;

describe('TLS Key Manager', () => {
  beforeEach(() => {
    tlsKeyManager = new TLSKeyManager();
    jest.resetAllMocks();
  });

  afterEach(() => {
    tlsKeyManager = new TLSKeyManager();
    jest.restoreAllMocks();
  });

  test('returns when the key already exists', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);

    jest
      .spyOn(child_process, 'spawn')
      .mockImplementationOnce((command, callback) => ({
        on: (type, cb) => (type === 'close' ? cb(0, null) : {}) as ChildProcess,
        //@ts-ignore
        stdout: {
          on: jest.fn()
        },
        //@ts-ignore
        stderr: {
          on: jest.fn()
        }
      }));

    const response = await tlsKeyManager.generateKeys();
    expect(response).toBe(undefined);
  });

  test('generates key if no key exists yet', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);

    jest
      .spyOn(child_process, 'spawn')
      .mockImplementationOnce((command, callback) => ({
        on: (type, cb) => (type === 'close' ? cb(0, null) : {}) as ChildProcess,
        //@ts-ignore
        stdout: {
          on: jest.fn()
        },
        //@ts-ignore
        stderr: {
          on: jest.fn()
        }
      }));

    const response = await tlsKeyManager.generateKeys();
    expect(child_process.spawn).toHaveBeenCalledWith(
      'openssl',
      expect.arrayContaining(['req', '-x509', 'rsa:4096'])
    );
    expect(response).toBe(undefined);
  });

  test('captures error during key generation', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);

    jest
      .spyOn(child_process, 'spawn')
      .mockImplementationOnce((command, callback) => ({
        on: (type, cb) =>
          (type === 'error'
            ? cb(new Error('some error'), null)
            : {}) as ChildProcess,
        //@ts-ignore
        stdout: {
          on: jest.fn()
        },
        //@ts-ignore
        stderr: {
          on: jest.fn()
        }
      }));

    try {
      await tlsKeyManager.generateKeys();
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toMatch('some error');
    }
  });
});
