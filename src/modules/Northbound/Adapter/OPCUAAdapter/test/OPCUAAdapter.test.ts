import path from 'path';
import fs from 'fs';
jest.mock('winston');
jest.mock('node-opcua-pki');

const configManagerMock = {
  runtimeConfig: {
    port: 7882,
    serverInfo: {
      applicationUri: ''
    },
    nodesetDir: 'mdclight/config/opcua_nodeSet'
  },
  generalConfig: {
    general: {
      serialNumber: '',
      manufacturer: ''
    }
  },
  dataSinkConfig: {
    protocol: 'opcua'
  }
};

const OPCUAServerMock = {
  start: jest.fn().mockImplementation(() => Promise.resolve()),
  stop: jest.fn(),
  initialize: jest.fn().mockImplementation(() => {
    OPCUAServerMock.initialized = true;
    return Promise.resolve();
  }),
  initialized: false,
  engine: {
    addressSpace: {
      findNode: (nodeId) => !nodeId.endsWith('notfound') && { nodeId }
    }
  },
  endpoints: [
    {
      endpointDescriptions: jest
        .fn()
        .mockReturnValue([{ endpointUrl: 'DummeTestUrl' }])
    }
  ]
};

const OPCUACertManagerMock = {
  initialize: jest.fn()
};

enum SecurityPolicies {
  None = '',
  Basic128Rsa15 = '',
  Basic256 = '',
  Basic256Sha256 = ''
}

enum SecurityModes {
  None = '',
  Sign = '',
  SignAndEncrypt = ''
}

jest.mock('node-opcua', () => {
  return {
    OPCUAServer: jest.fn(() => {
      return OPCUAServerMock;
    }),
    OPCUACertificateManager: jest.fn(() => {
      return OPCUACertManagerMock;
    }),
    SecurityPolicy: SecurityPolicies,
    MessageSecurityMode: SecurityModes
  };
});
let writtenXMLFile: string | null = null;

jest.mock('fs-extra', () => {
  return {
    readdir: jest.fn(async () => ['dmgmori-umati.xml']),
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    copy: jest.fn(),
    rm: jest.fn(),
    readFileSync: jest.fn(() =>
      fs.readFileSync(
        path.join(process.cwd(), '/_mdclight/opcua_nodeSet/dmgmori-umati.xml'),
        { encoding: 'utf-8' }
      )
    ),
    writeFileSync: jest.fn(async (name, data) => {
      writtenXMLFile = data;
    })
  };
});

import { OPCUAAdapter } from '..';

describe(`OPCUAAdapter Test`, () => {
  let testAdapter: OPCUAAdapter;

  afterEach(() => {
    testAdapter = null;
    writtenXMLFile = null;
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

      it(`with correct custom data points, if any exists`, async () => {
        const nodeId = 'TEST_NODE_ID';
        const name = 'TEST_DISP_NAME';
        const dataType = 'TEST_DATATYPE';
        testAdapter = new OPCUAAdapter({
          ...configManagerMock,
          dataSinkConfig: {
            ...configManagerMock.dataSinkConfig,
            customDataPoints: [
              {
                nodeId,
                name,
                dataType
              }
            ]
          }
        } as any);
        await testAdapter.init();

        expect(
          writtenXMLFile!.includes(
            `<Reference ReferenceType="Organizes">ns=1;s=${nodeId}</Reference>`
          )
        ).toBeTruthy();
        expect(
          writtenXMLFile!.includes(
            `<UAVariable DataType="${dataType}" NodeId="ns=1;s=${nodeId}" BrowseName="1:${nodeId}">`
          )
        ).toBeTruthy();
        expect(
          writtenXMLFile!.includes(`<DisplayName>${name}</DisplayName>`)
        ).toBeTruthy();
      });

      it(`with correct custom data points, skips if existing node id given`, async () => {
        const nodeId = 'ComponentName';
        const name = 'TEST_DISP_NAME';
        const dataType = 'TEST_DATATYPE';
        testAdapter = new OPCUAAdapter({
          ...configManagerMock,
          dataSinkConfig: {
            ...configManagerMock.dataSinkConfig,
            customDataPoints: [
              {
                nodeId,
                name,
                dataType
              }
            ]
          }
        } as any);
        await testAdapter.init();

        expect(
          writtenXMLFile!.includes(
            `<Reference ReferenceType="Organizes">ns=1;s=${nodeId}</Reference>`
          )
        ).toBeFalsy();
        expect(
          writtenXMLFile!.includes(
            `<UAVariable DataType="${dataType}" NodeId="ns=1;s=${nodeId}" BrowseName="2:${nodeId}">`
          )
        ).toBeFalsy();
        expect(
          writtenXMLFile!.includes(`<DisplayName>${name}</DisplayName>`)
        ).toBeFalsy();
      });

      describe(`TODO`, () => {
        beforeEach(() => {
          testAdapter = new OPCUAAdapter(configManagerMock as any);
        });

        xit(`init returns same object`, async () => {
          testAdapter.init().then((returned) => {
            expect(returned).toBe(testAdapter);
          });
        });
        it(`init invoke OPCUAServer.initialize`, async () => {
          testAdapter.init().then(() => {
            expect(OPCUAServerMock.initialize).toHaveBeenCalled();
          });
        });

        // it(`start, without previous init, rejects`, async () => {
        //   testAdapter
        //     .start()
        //     .catch((err) => expect(err).toBeInstanceOf(AdapterError));
        // });

        describe(`after init`, () => {
          beforeEach(async () => {
            jest.clearAllMocks();
            await testAdapter.init();
          });

          afterEach(() => {
            jest.clearAllMocks();
          });

          it(`starting adapter`, (done) => {
            testAdapter
              .start()
              .then(() => done())
              .catch(() => done.fail());
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
