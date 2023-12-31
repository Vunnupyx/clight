import { DataHubAdapter } from '../';
import { LifecycleEventStatus } from '../../../../../common/interfaces';

let UUT: DataHubAdapter;
const proxyMock = {
  enabled: true
};
const signalGroupsMock = {};
const dataHubAdapterOptionsMock = {
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
  shutdown: jest.fn(),
  properties: {
    desired: {
      services: {
        key1: 'value1'
      }
    },
    reported: {
      update: jest.fn((payload, callback) => callback())
    }
  }
};

const deviceRegistrationStateMock = {
  deviceId: dataHubAdapterOptionsMock['regId'],
  assignedHub: 'dummy assignedHub',
  status: 'assigned'
};

const dataHubClientMock: {
  [key: string]: jest.Mock;
} = {
  on: jest.fn().mockImplementation(() => {
    return dataHubClientMock;
  }),
  close: jest.fn().mockImplementation(() => {
    return Promise.resolve({});
  }),
  setOptions: jest.fn(),
  sendEvent: jest.fn(),
  open: jest.fn().mockImplementation(() => {
    return Promise.resolve({});
  }),
  getTwin: jest.fn().mockReturnValue(twinMock)
};

function log(m: any) {
  // console.log(m);
}

jest.mock('../../../../ConfigurationAgentManager', () => {
  return {
    ConfigurationAgentManager: {
      getMachineInfo: () => ({ Serial: '12345678901' })
    }
  };
});

jest.mock('winston', () => {
  return {
    debug: log,
    info: log,
    error: log,
    warn: log
  };
});

jest.doMock('url');
jest.doMock('crypto');
jest.createMockFromModule('azure-iot-device');
jest.mock('azure-iot-device', () => {
  return {
    Message: jest.fn(() => ({ properties: { add: jest.fn() } })),
    Twin: jest.fn(),
    ModuleClient: {
      fromEnvironment: jest.fn(() => dataHubClientMock)
    }
  };
});
jest.doMock('azure-iot-device-mqtt');
jest.doMock('https-proxy-agent');

jest.doMock('azure-iot-security-symmetric-key');
jest.doMock('azure-iot-provisioning-device-amqp');
jest.doMock('azure-iot-provisioning-device/dist/interfaces');

const onStateChange = jest.fn();

jest.useFakeTimers();

// All tests in this block depends on each other. Not single runnable.
describe('DataHubAdapter', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    UUT = new DataHubAdapter(dataHubAdapterOptionsMock, onStateChange);
    await UUT.init().then((adapter) => adapter.start());
  });
  test('setReportedProps reports properties', async () => {
    const obj = {
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
    };
    await UUT.setReportedProps(obj);
    expect(UUT.running).toBe(true);
    expect(onStateChange).toHaveBeenCalledWith(LifecycleEventStatus.Connected);
    expect(twinMock.properties.reported.update).toHaveBeenCalled();
    expect(twinMock.properties.reported.update.mock.calls[0][0]).toStrictEqual({
      services: obj
    });
  });

  test('getReportedProps gets desired properties', async () => {
    let response = await UUT.getDesiredProps();
    expect(UUT.running).toBe(true);
    expect(response).toStrictEqual({
      services: { key1: 'value1' }
    });
  });

  test('sends data correctly with no measurements', async () => {
    const measurement = {
      event: [],
      probe: [],
      telemetry: []
    };
    await UUT.sendData(measurement);
    expect(UUT.running).toBe(true);
    expect(dataHubClientMock.sendEvent).not.toHaveBeenCalled();
  });

  test('sends data correctly with all measurements', async () => {
    const measurement = {
      event: [
        {
          example: ''
        }
      ],
      probe: [
        {
          example: ''
        }
      ],
      telemetry: [
        {
          example: ''
        }
      ]
    };
    await UUT.sendData(measurement);
    expect(UUT.running).toBe(true);
    expect(dataHubClientMock.sendEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ properties: { add: expect.any(Function) } }),
      expect.any(Function)
    );
    expect(dataHubClientMock.sendEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ properties: { add: expect.any(Function) } }),
      expect.any(Function)
    );
    expect(dataHubClientMock.sendEvent).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ properties: { add: expect.any(Function) } }),
      expect.any(Function)
    );
  });

  test('stopping works correctly', async () => {
    await UUT.stop();
    expect(UUT.running).toBe(undefined); //not false, because this.isRunning is deleted in stop process
    expect(onStateChange).toHaveBeenCalledWith(
      LifecycleEventStatus.Disconnected
    );
  });
  test('shutdown works correctly', async () => {
    await UUT.shutdown();
    expect(twinMock.shutdown).toHaveBeenCalled();
    expect(dataHubClientMock.close).toHaveBeenCalled();
  });
});
