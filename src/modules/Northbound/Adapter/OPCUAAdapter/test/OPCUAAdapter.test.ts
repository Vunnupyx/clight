import path from 'path';
import fs from 'fs';

jest.mock('node-opcua-pki');
jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));

const mockOpcuaServerShutdown = jest
  .fn()
  .mockImplementation(() => Promise.resolve());

function log(m) {
  //console.log(m)
}
const winstonMock = {
  winston: jest.fn(), // Constructor
  info: jest.fn(log),
  debug: jest.fn(log),
  warn: jest.fn(log),
  error: jest.fn(log)
};
jest.doMock('winston', () => {
  return winstonMock;
});

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
  shutdown: mockOpcuaServerShutdown,
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

const mockXmlFile = fs.readFileSync(path.join(__dirname, 'mock.xml'), {
  encoding: 'utf-8'
});
jest.mock('fs-extra', () => {
  return {
    readdir: jest.fn(async () => ['dmgmori-umati.xml']),
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    copy: jest.fn(),
    rm: jest.fn(),
    readFileSync: jest.fn(() => mockXmlFile),
    writeFileSync: jest.fn(async (name, data) => {
      writtenXMLFile = data;
    })
  };
});

import { OPCUAAdapter } from '..';
import { System } from '../../../../System';
import { NorthBoundError } from '../../../../../common/errors';

const systemMock = jest.createMockFromModule('../../../../System') as System;

systemMock.getHostname = jest.fn(async () => `dm000000000000`);

describe(`OPCUAAdapter Test`, () => {
  let testAdapter: OPCUAAdapter;

  afterEach(() => {
    testAdapter = null!;
    writtenXMLFile = null;
    jest.clearAllMocks();
  });

  describe(`instantiation `, () => {
    describe(`fails `, () => {
      it(`without config data`, () => {
        expect(() => new OPCUAAdapter(null!)).toThrow(Error);
      });

      it(`if config object is empty`, () => {
        expect(() => new OPCUAAdapter({} as any)).toThrow(Error);
      });

      it(`if config object has empty runtime data`, () => {
        expect(() => new OPCUAAdapter({} as any)).toThrow(Error);
      });
    });

    describe(`succeeds`, () => {
      it(`with valid configManager `, () => {
        testAdapter = new OPCUAAdapter(configManagerMock as any);
        expect(testAdapter).toBeInstanceOf(OPCUAAdapter);
      });

      it(`with correct XML initialization (replacing DummyMachineToolName)`, async () => {
        testAdapter = new OPCUAAdapter(configManagerMock as any);
        await testAdapter.init();
        expect(writtenXMLFile!.includes('DummyMachineToolName')).toBeFalsy();
        expect(writtenXMLFile!.includes('dm000000000000')).toBeTruthy();
        const countOriginalString = (
          (mockXmlFile || '').match(/DummyMachineToolName/g) || []
        ).length;
        const countReplacedString = (
          (writtenXMLFile || '').match(/dm000000000000/g) || []
        ).length;
        expect(countOriginalString).toEqual(countReplacedString);
      });

      it(`with correct custom data points, if any exists`, async () => {
        const hostname = await new System().getHostname();

        const address = 'TEST_NODE_ID';
        const name = 'TEST_DISP_NAME';
        const dataTypeInConfig = 'string';
        const dataType = 'String';
        testAdapter = new OPCUAAdapter({
          ...configManagerMock,
          dataSinkConfig: {
            ...configManagerMock.dataSinkConfig,
            customDataPoints: [
              {
                address,
                name,
                dataType: dataTypeInConfig
              }
            ]
          }
        } as any);
        await testAdapter.init();

        expect(
          writtenXMLFile!.includes(
            `<Reference ReferenceType="Organizes">ns=1;s=IoTflex</Reference>`
          )
        ).toBeTruthy();
        expect(
          writtenXMLFile!.includes(
            `<UAVariable DataType="${dataType}" NodeId="ns=1;s=${hostname}.${address}" BrowseName="2:${address}">`
          )
        ).toBeTruthy();
        expect(
          writtenXMLFile!.includes(`<DisplayName>${name}</DisplayName>`)
        ).toBeTruthy();
      });

      it(`with correct custom data points, skips if existing node id given`, async () => {
        const address = 'Identification.ComponentName';
        const name = 'TEST_DISP_NAME';
        const dataTypeInConfig = 'double';
        const dataType = 'Double';
        testAdapter = new OPCUAAdapter({
          ...configManagerMock,
          dataSinkConfig: {
            ...configManagerMock.dataSinkConfig,
            customDataPoints: [
              {
                address,
                name,
                dataType: dataTypeInConfig
              }
            ]
          }
        } as any);
        await testAdapter.init();

        expect(
          writtenXMLFile!.includes(
            `<Reference ReferenceType="Organizes">ns=1;s=${address}</Reference>`
          )
        ).toBeFalsy();
        expect(
          writtenXMLFile!.includes(
            `<UAVariable DataType="${dataType}" NodeId="ns=1;s=${address}" BrowseName="2:${address}">`
          )
        ).toBeFalsy();
        expect(
          writtenXMLFile!.includes(`<DisplayName>${name}</DisplayName>`)
        ).toBeFalsy();
      });
    });
  });
  describe(`initializing`, () => {
    beforeEach(() => {
      testAdapter = new OPCUAAdapter(configManagerMock as any);
    });

    it(`successful`, async () => {
      await testAdapter.init();
      expect(OPCUAServerMock.initialize).toHaveBeenCalled();
    });
  });
  describe(`starting`, () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      testAdapter = new OPCUAAdapter(configManagerMock as any);
      await testAdapter.init();
    });

    it(`start, without previous init, rejects`, async () => {
      testAdapter = new OPCUAAdapter(configManagerMock as any);

      testAdapter
        .start()
        .catch((err) => expect(err).toBeInstanceOf(NorthBoundError));
    });

    it(`starting adapter`, (done) => {
      testAdapter
        .start()
        .then(() => done())
        .catch(() => done.fail());
    });

    it(`starting already running adapter`, async () => {
      await testAdapter.start();
      expect(testAdapter.isRunning).toBeTruthy();
      expect(winstonMock.info).toHaveBeenCalledWith(
        expect.stringContaining(
          'adapter successfully started. The primary server endpoint url is'
        )
      );
      await testAdapter.start();
      expect(testAdapter.isRunning).toBeTruthy();
      expect(winstonMock.debug).toHaveBeenCalledWith(
        expect.stringContaining('try to start adapter but already running')
      );
    });
  });

  describe(`stopping`, () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      testAdapter = new OPCUAAdapter(configManagerMock as any);
      await testAdapter.init();
    });

    it(`stopping, without starting first`, async () => {
      await testAdapter.stop();
      expect(testAdapter.isRunning).toBeFalsy();
      expect(winstonMock.debug).toHaveBeenCalledWith(
        expect.stringContaining('try to stop a already stopped adapter')
      );
    });

    it(`stopping already running adapter`, async () => {
      await testAdapter.start();
      expect(testAdapter.isRunning).toBeTruthy();
      await testAdapter.stop();
      expect(testAdapter.isRunning).toBeFalsy();
      expect(mockOpcuaServerShutdown).toHaveBeenCalledWith(1000); //1000 is default: shutdownTimeoutMs

      expect(winstonMock.info).toHaveBeenCalledWith(
        expect.stringContaining('adapter stopped')
      );
    });

    it(`stopping already running adapter with a delay`, async () => {
      await testAdapter.start();
      expect(testAdapter.isRunning).toBeTruthy();
      await testAdapter.stop(200);
      expect(mockOpcuaServerShutdown).toHaveBeenCalledWith(200);
      expect(testAdapter.isRunning).toBeFalsy();

      expect(winstonMock.info).toHaveBeenCalledWith(
        expect.stringContaining('adapter stopped')
      );
    });
  });

  describe('findNode', () => {
    it('returns the node by using correct prefix', async () => {
      const hostname = await new System().getHostname();
      testAdapter = new OPCUAAdapter(configManagerMock as any);
      await testAdapter.init();

      let node = await testAdapter.findNode('Variable1');
      expect(node?.nodeId).toBe(`ns=7;s=${hostname}.Variable1`);
    });

    it('returns null if no node is found', async () => {
      testAdapter = new OPCUAAdapter(configManagerMock as any);
      await testAdapter.init();

      let node = await testAdapter.findNode('notfound');
      expect(node).toEqual(null);
    });
  });
});
