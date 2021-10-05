jest.mock('winston');
jest.mock('node-opcua-pki');

const configManagerMock = {
  runtimeConfig: {
    opcua: {
      serverInfo: {
        applicationUri: ''
      }
    }
  },
  config: {
    general: {
      serialNumber: '',
      manufacturer: ''
    }
  }
};

const OPCUAServerMock = {
  start: jest.fn().mockImplementation(() => Promise.resolve()),
  stop: jest.fn(),
  initialize: jest.fn().mockImplementation(() => {
    OPCUAServerMock.initialized = true;
    return Promise.resolve();
  }),
  initialized: false
};

const OPCUACertManagerMock = {
  initialize: jest.fn()
};

jest.mock('node-opcua', () => {
  return {
    OPCUAServer: jest.fn(() => {
      return OPCUAServerMock;
    }),
    OPCUACertificateManager: jest.fn(() => {
      return OPCUACertManagerMock;
    })
  };
});

jest.mock('fs-extra', () => {
  return {
    readdir: jest.fn(async () => ['filename']),
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    copy: jest.fn()
  };
});

import winston from 'winston';
import { OPCUAAdapter } from '..';
import { AdapterError } from '../../../../common/errors';

describe(`OPCUAAdapter Test`, () => {
  let testAdapter: OPCUAAdapter;

  afterEach(() => {
    testAdapter = null;
    jest.clearAllMocks();
  });

  describe(`instantiation `, () => {
    describe(`fails `, () => {
      it(`without config data`, () => {
        expect(() => new OPCUAAdapter(null)).toThrow(Error);
      });

      it(`if config object is empty`, () => {
        expect(() => new OPCUAAdapter({} as any)).toThrow(Error);
      });

      it(`if config object has empty runtime data`, () => {
        expect(() => new OPCUAAdapter({} as any)).toThrow(Error);
      });
    });

    describe(`succeeded `, () => {
      it(`with valid configManager `, () => {
        testAdapter = new OPCUAAdapter(configManagerMock as any);
        expect(testAdapter).toBeInstanceOf(OPCUAAdapter);
      });

      describe(`TODO`, () => {
        beforeEach(() => {
          testAdapter = new OPCUAAdapter(configManagerMock as any);
        });

        it(`init returns same object`, async () => {
          testAdapter.init().then((returned) => {
            expect(returned).toBe(testAdapter);
          });
        });
        it(`init invoke OPCUAServer.initialize`, async () => {
          testAdapter.init().then(() => {
            expect(OPCUAServerMock.initialize).toHaveBeenCalled();
          });
        });

        it(`start, without previous init, rejects`, async () => {
          testAdapter
            .start()
            .catch((err) => expect(err).toBeInstanceOf(AdapterError));
        });

        describe(`after init`, () => {
          beforeEach(async () => {
            jest.clearAllMocks();
            await testAdapter.init();
          });

          afterEach(() => {
            jest.clearAllMocks();
          });

          it(`starting adapter`, async () => {
            await testAdapter.start();
          });
          // TODO BUG: FIXME!
          //   it(`starting already running adapter`, async (done) => {
          //     await testAdapter.start();
          //     await testAdapter.start();
          //     expect(winston.info).toHaveBeenCalledWith(
          //       'OPCUAAdapter::start try to start adapter but already running.'
          //     );
          //     done();
          //   });
        });
      });
    });
  });
});
