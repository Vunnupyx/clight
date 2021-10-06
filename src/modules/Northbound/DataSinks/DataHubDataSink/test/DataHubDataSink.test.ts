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
      configMock.dataPoints = [];
      (runTimeConfigMock.signalGroups.group1 = []),
        (runTimeConfigMock.signalGroups.group2 = []),
        (runTimeConfigMock.signalGroups.group3 = []);
    });

    it('initializing successfully', async () => {
      return datasinkUUT.init().then(() => {
        expect(dataHubAdapterMock.init).toBeCalled();
        expect(dataHubAdapterMock.start).toBeCalled();
        expect(winstonMock.debug).toBeCalledWith(
          expect.stringContaining('initializing')
        );
        expect(winstonMock.debug).toBeCalledWith(
          expect.stringContaining('initialized')
        );
      });
    });

    it('handles measurements and sendData to adapter', async () => {

      //INFO: Only 1,3,5,6 are sendable because of of twin settings.
      const mockedEvents = [
        {
          measurement: {
            id: 'testID1',
            name: 'testName1',
            value: 15
          },
          dataSource: {
            name: 'UTSource',
            protocol: 'UTProtocol'
          }
        }
      ];

      const dataPointName1 = 'datapoint1';
      const dataPointName2 = 'datapoint2';
      const dataPointName3 = 'datapoint3';
      const dataPointName4 = 'datapoint4';
      const dataPointName5 = 'datapoint5';
      const dataPointName6 = 'datapoint6';
      const dataPointName7 = 'datapoint7';

      configMock.dataPoints = [
        {
          id: dataPointName1,
          type: 'probe',
          address: 'address',
          name: 'name'
        },
        {
          id: dataPointName2,
          type: 'probe',
          address: 'address',
          name: 'name'
        }
        ,
        {
          id: dataPointName3,
          type: 'probe',
          address: 'address',
          name: 'name'
        }
        ,
        {
          id: dataPointName4,
          type: 'probe',
          address: 'address',
          name: 'name'
        }
        ,
        {
          id: dataPointName5,
          type: 'probe',
          address: 'address',
          name: 'name'
        }
        ,
        {
          id: dataPointName6,
          type: 'probe',
          address: 'address',
          name: 'name'
        },
        {
          id: dataPointName7,
          type: 'probe',
          address: 'address',
          name: 'name'
        }
      ];

      dataPointMapperMock.getTargets.mockImplementation(() => [
        {
          id: 'mappingID',
          source: 'testID1',
          target: dataPointName1
        },
        {
          id: 'mappingID',
          source: 'testID1',
          target: dataPointName2
        },
        {
          id: 'mappingID',
          source: 'testID1',
          target: dataPointName3
        },
        {
          id: 'mappingID',
          source: 'testID1',
          target: dataPointName4
        },
        {
          id: 'mappingID',
          source: 'testID1',
          target: dataPointName5
        },
        {
          id: 'mappingID',
          source: 'testID1',
          target: dataPointName6
        },
        {
          id: 'mappingID',
          source: 'testID1',
          target: dataPointName7
        }
      ]);

      dataHubAdapterMock.getDesiredProps.mockImplementation(() => {
        return {
          services: {
            group1: {
              enabled: true,
              datapoint1: true,
              datapoint2: false,
              datapoint3: true
            },
            group2: {
              enabled: false,
              datapoint18: true,
            },
            group3: {
              enabled: true,
              datapoint4: true,
              datapoint5: false,
              datapoint6: true
            }
          }
        };
      });

      return datasinkUUT
        .init()
        .then(() => {
          return datasinkUUT.onMeasurements(mockedEvents);
        })
        .then(() => {
          expect(dataPointMapperMock.getTargets).toBeCalled();
          expect(dataHubAdapterMock.sendData).toBeCalledWith(
            'probe',
            dataPointName1,
            mockedEvents[0].measurement.value
          );
          expect(dataHubAdapterMock.sendData).toBeCalledWith(
            'probe',
            dataPointName3,
            mockedEvents[0].measurement.value
          );
          expect(dataHubAdapterMock.sendData).toBeCalledWith(
            'probe',
            dataPointName4,
            mockedEvents[0].measurement.value
          );
          expect(dataHubAdapterMock.sendData).toBeCalledWith(
            'probe',
            dataPointName6,
            mockedEvents[0].measurement.value
          );
        });
    });
  });
});
