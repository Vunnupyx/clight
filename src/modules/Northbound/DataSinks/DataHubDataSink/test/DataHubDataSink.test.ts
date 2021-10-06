import { DataPointMapper } from '../../../../DataPointMapper';

const dataHubAdapterMock = {
  isRunning: true,
  getDesiredProps: jest.fn(),
  init: jest.fn().mockImplementation(() => Promise.resolve(dataHubAdapterMock)),
  start: jest.fn(),
  stop: jest.fn(),
  sendData: jest.fn()
};

const dataHubAdapterMockConstructor = jest
  .fn()
  .mockImplementation(() => dataHubAdapterMock);

jest.doMock('../../../Adapter/DataHubAdapter', () => {
  return {
    DataHubAdapter: dataHubAdapterMockConstructor
  };
});

const winstonMock = {
  winston: jest.fn(), // Constructor
  debug: jest.fn() // static method
};
jest.doMock('winston', () => {
  return winstonMock;
});

import {
  IDataHubConfig,
  IDataSinkConfig,
  IDataSinkDataPointConfig
} from '../../../../ConfigManager/interfaces';
import { DataHubDataSink, DataHubDataSinkOptions } from '..';
import { IDataSourceMeasurementEvent } from '../../../../DataSource';

/**
 * GLOBAL MOCKS
 */
const configMock: IDataSinkConfig = {
  name: 'UnitTestDataHubDataSink',
  protocol: 'datahub',
  enabled: true,
  dataPoints: []
};

const runTimeConfigMock: IDataHubConfig = {
  serialNumber: 'UTSerialNumber',
  regId: 'UTregId',
  symKey: 'UTKey',
  scopeId: 'UTScopeId',
  groupDevice: false,
  provisioningHost: 'UTHost.test',
  minMsgSize: 500,
  signalGroups: {
    group1: [],
    group2: [],
    group3: []
  },
  dataPointTypesData: {
    probe: {
      bufferSizeBytes: 500,
      intervalHours: 24
    },
    telemetry: {
      bufferSizeBytes: 500,
      intervalHours: 12
    }
  }
};

const dataPointMapperMock = {
  getTargets: jest.fn(),
  mapping: [],
  newConfigHandler: jest.fn()
};
const DataPointMapperGetInstanceSpy = jest
  .spyOn(DataPointMapper, 'getInstance')
  .mockImplementation(() => dataPointMapperMock as any);

/**
 * TESTS
 */
describe('DataHubDataSink test', () => {
  let datasinkUUT: DataHubDataSink;
  let dataHubDataSinkOptions: DataHubDataSinkOptions = {
    config: configMock,
    runTimeConfig: runTimeConfigMock
  };

  describe(`instantiation successfully`, () => {
    beforeAll(() => {
      datasinkUUT = new DataHubDataSink(dataHubDataSinkOptions);
    });
    afterEach(() => {
      jest.clearAllMocks();
      configMock.dataPoints = []
      runTimeConfigMock.signalGroups.group1 = [],
      runTimeConfigMock.signalGroups.group2 = [],
      runTimeConfigMock.signalGroups.group3 = []
    })

    it('initializing successfully', async () => {
      return datasinkUUT.init().then(() => {
        expect(dataHubAdapterMock.init).toBeCalled();
        expect(dataHubAdapterMock.start).toBeCalled();
        expect(winstonMock.debug).toBeCalledWith(expect.stringContaining('initializing'));
        expect(winstonMock.debug).toBeCalledWith(expect.stringContaining('initialized'));
      });
    });

    it('handles measurements and sendData to adapter', async () => {
      const mockedEvents = [{
        measurement: {
          id: 'testID1',
          name: 'testName1',
          value: 15,
        },
        dataSource: {
          name: 'UTSource',
          protocol: 'UTProtocol'
        }
      }];

      const dataPointName = 'dataPoint1';

      configMock.dataPoints = [{
        id: dataPointName,
        type: 'probe',
        address: 'address1',
        name: 'name1'
      }];

      dataPointMapperMock.getTargets.mockImplementation(() => [{
        id: 'mappingID',
        source: 'testID1',
        target: dataPointName
      }]);

      dataHubAdapterMock.getDesiredProps.mockImplementation(() => {
        return {
          services: {
            group1: {
              enabled: true
            }
          }
        }
      });

      
      runTimeConfigMock.signalGroups.group1 = [dataPointName];

      return datasinkUUT.init()
      .then(() => {
        return datasinkUUT.onMeasurements(mockedEvents);
      })
      .then(() => {
        expect(dataPointMapperMock.getTargets).toBeCalled();
        expect(dataHubAdapterMock.sendData).toBeCalledWith('probe', dataPointName, mockedEvents[0].measurement.value);
      })
    })
  });
});
