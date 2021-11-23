let UUT: DataHubAdapter;
const proxyMock = {
  enabled: true
};
const signalGroupsMock = {};
const dataHubSettingsMock = {
  provisioningHost: 'dummy.host.codestryke',
  scopeId: 'dummy scopeId',
  regId: 'dummy regid',
  symKey: 'dummy key'
};
const dataHubAdapterOptionsMock = {
  serialNumber: 'dummy serialnumber',
  groupDevice: false,
  signalGroups: signalGroupsMock,
  dataPointTypesData: {
    probe: {
      intervalHours: 1
    },
    telemetry: {
      intervalHours: 1
    }
  },
  proxy: proxyMock
} as any;

const twinMock = {
  on: jest.fn(),
  properties: {
    desired: {
      services: {
        reported1: {
          enabled: true
        },
        reported2: {
          enabled: true
        },
        reported3: {
          enabled: true
        },
        reported4: {
          enabled: true
        },
        reported5: {
          enabled: true
        }
      }
    },
    reported: {
      update: jest.fn()
    }
  }
};

const deviceRegistrationStateMock = {
  deviceId: dataHubAdapterOptionsMock['regId'],
  assignedHub: 'dummy assignedHub',
  status: 'assigned'
};

const dataHubClientMock = {
  on: jest.fn().mockImplementation(() => {
    return dataHubClientMock;
  }),
  setOptions: jest.fn(),
  sendEvent: jest.fn(),
  open: jest.fn().mockImplementation(() => {
    return Promise.resolve({});
  }),
  getTwin: jest.fn().mockReturnValue(twinMock)
};

jest.doMock('url');
jest.doMock('winston');
jest.doMock('crypto');
jest.doMock('azure-iot-device');
jest.doMock('https-proxy-agent');
jest.doMock('socks-proxy-agent');

jest.doMock('azure-iot-security-symmetric-key');
jest.doMock('azure-iot-provisioning-device-amqp');
jest.doMock('azure-iot-provisioning-device/dist/interfaces');

import { DataHubAdapter } from '../';
import { ProvisioningDeviceClient } from 'azure-iot-provisioning-device';
import { Client } from 'azure-iot-device';

const clientSpy = jest
  .spyOn(Client, 'fromConnectionString')
  .mockImplementation(() => {
    return dataHubClientMock as any;
  });

const ProvisioningDeviceClientSpy = jest
  .spyOn(ProvisioningDeviceClient, 'create')
  .mockImplementation(() => ({
    register: jest.fn().mockImplementation((cb) => {
      cb(null, deviceRegistrationStateMock);
    }),
    cancel: jest.fn(),
    setProvisioningPayload: jest.fn()
  }));

jest.useFakeTimers();

// All tests in this block depends on each other. Not single runnable.
describe('DataHubAdapter', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  beforeAll(async () => {
    UUT = new DataHubAdapter(dataHubAdapterOptionsMock, dataHubSettingsMock);
    await UUT.init().then((adapter) => adapter.start());
  });
  it('reported properties are reported', () => {
    UUT.setReportedProps();
    expect(twinMock.properties.reported.update).toHaveBeenCalled();
    expect(twinMock.properties.reported.update.mock.calls[0][0]).toStrictEqual({
      services: {
        reported1: {
          enabled: true
        },
        reported2: {
          enabled: true
        },
        reported3: {
          enabled: true
        },
        reported4: {
          enabled: true
        },
        reported5: {
          enabled: true
        }
      }
    });
  });

  it('already reported properties are not updated again', () => {
    UUT.setReportedProps();
    UUT.setReportedProps();
    expect(twinMock.properties.reported.update).not.toHaveBeenCalledTimes(1);
  });
});
