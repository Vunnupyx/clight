import { DataSinksManager, IDataSinkManagerParams } from '..';
import { ConfigManager } from '../../../../ConfigManager';
import { IConfig, IRuntimeConfig } from '../../../../ConfigManager/interfaces';
import { DataPointCache } from '../../../../DatapointCache';
import { EventBus, MeasurementEventBus } from '../../../../EventBus';

jest.mock('winston');
jest.mock('events');
jest.mock('typed-emitter');
jest.mock('../../../../ConfigManager');

jest.mock('../../../../DatapointCache');
jest.mock('../../../MessengerManager');

const mockSinkConstructor = {
  init: jest.fn(),
  on: jest.fn(),
  onMeasurements: { bind: jest.fn() },
  onLifecycleEvent: { bind: jest.fn() },
  shutdown: jest.fn().mockResolvedValue([]),
  configEqual: jest.fn().mockReturnValue(false)
};
jest.mock('../../DataHubDataSink', () => {
  return {
    DataHubDataSink: jest.fn().mockImplementation(() => mockSinkConstructor)
  };
});
jest.mock('../../MTConnectDataSink', () => {
  return {
    MTConnectDataSink: jest.fn().mockImplementation(() => mockSinkConstructor)
  };
});
jest.mock('../../OPCUADataSink', () => {
  return {
    OPCUADataSink: jest.fn().mockImplementation(() => mockSinkConstructor)
  };
});

const mockEventBusConstructor = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};
const mockMeasurementEventBusConstructor = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};
jest.mock('../../../../EventBus', () => {
  return {
    EventBus: jest.fn().mockImplementation(() => mockEventBusConstructor),
    MeasurementEventBus: jest
      .fn()
      .mockImplementation(() => mockMeasurementEventBusConstructor)
  };
});

let dataSinksManager: DataSinksManager;
const mockConfigManager = new ConfigManager({
  errorEventsBus: new EventBus(),
  lifecycleEventsBus: new EventBus()
});

const mockParams: IDataSinkManagerParams = {
  configManager: mockConfigManager,
  errorBus: new EventBus(),
  measurementsBus: new MeasurementEventBus(),
  lifecycleBus: new EventBus(),
  dataPointCache: new DataPointCache()
};
describe('DataSinksManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dataSinksManager = new DataSinksManager(mockParams);
    //@ts-ignore
    mockConfigManager.runtimeConfig = {
      mtconnect: {}
    } as IRuntimeConfig;
    mockConfigManager.config = {
      messenger: {},
      dataSinks: [
        { protocol: 'mtconnect' },
        { protocol: 'opcua' },
        { protocol: 'datahub' }
      ],
      termsAndConditions: {
        accepted: true
      }
    } as IConfig;
  });
  test('Spawns data sinks at init', async () => {
    //@ts-ignore
    await dataSinksManager.init();

    expect(mockSinkConstructor.init).toHaveBeenCalledTimes(3);
    expect(mockSinkConstructor.onMeasurements.bind).toHaveBeenCalledTimes(3);
    expect(mockSinkConstructor.onLifecycleEvent.bind).toHaveBeenCalledTimes(3);

    expect(mockEventBusConstructor.addEventListener).toHaveBeenCalledTimes(3);
    expect(
      mockMeasurementEventBusConstructor.addEventListener
    ).toHaveBeenCalledTimes(3);
    expect(mockEventBusConstructor.removeEventListener).not.toHaveBeenCalled();
    expect(mockEventBusConstructor.removeEventListener).not.toHaveBeenCalled();
  });

  test('Restarts data sinks after config change', async () => {
    //@ts-ignore
    await dataSinksManager.init();
    //mockReturnValueOnce is needed as otherwise spyOn calls the original function too!
    const initSpy = jest
      //@ts-ignore
      .spyOn(dataSinksManager, 'init')
      //@ts-ignore
      .mockReturnValueOnce('');
    //mockReturnValueOnce is needed as otherwise spyOn calls the original function too!
    const emitSpy = jest
      .spyOn(dataSinksManager, 'emit')
      //@ts-ignore
      .mockReturnValueOnce('');

    //@ts-ignore
    await dataSinksManager.configChangeHandler();

    expect(mockEventBusConstructor.removeEventListener).toHaveBeenCalledTimes(
      3
    );
    expect(
      mockMeasurementEventBusConstructor.removeEventListener
    ).toHaveBeenCalledTimes(3);
    expect(initSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('dataSinksRestarted', undefined);
  });

  test('Handles second config change request while already restarting', async () => {
    //@ts-ignore
    await dataSinksManager.init();
    //@ts-ignore
    const initSpy = jest.spyOn(dataSinksManager, 'init');
    const emitSpy = jest
      .spyOn(dataSinksManager, 'emit')
      //@ts-ignore
      .mockReturnValueOnce('');

    //@ts-ignore
    const firstCall = dataSinksManager.configChangeHandler();
    //@ts-ignore
    const secondCall = dataSinksManager.configChangeHandler();

    //mockReturnValueOnce is needed as otherwise spyOn calls the original function too!
    const changeHandlerSpy = jest
      //@ts-ignore
      .spyOn(dataSinksManager, 'configChangeHandler')
      //@ts-ignore
      .mockReturnValueOnce('');

    await firstCall;
    const secondCallResult = await secondCall;

    expect(secondCallResult).toBe(undefined);
    expect(mockEventBusConstructor.removeEventListener).toHaveBeenCalledTimes(
      3
    );
    expect(
      mockMeasurementEventBusConstructor.removeEventListener
    ).toHaveBeenCalledTimes(3);
    expect(initSpy).toHaveBeenCalledTimes(1);
    expect(changeHandlerSpy).toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  test('shutdownAllDataSinks works properly', async () => {
    //@ts-ignore
    await dataSinksManager.init();
    await dataSinksManager.shutdownAllDataSinks();

    expect(mockEventBusConstructor.removeEventListener).toHaveBeenCalledTimes(
      3
    );
    expect(
      mockMeasurementEventBusConstructor.removeEventListener
    ).toHaveBeenCalledTimes(3);
    expect(mockSinkConstructor.shutdown).toHaveBeenCalledTimes(3);
  });
});
