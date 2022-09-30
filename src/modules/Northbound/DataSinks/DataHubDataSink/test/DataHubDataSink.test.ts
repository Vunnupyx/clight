const dataHubAdapterMock = {
  isRunning: true,
  running: true,
  getDesiredProps: jest.fn(),
  init: jest.fn().mockImplementation(() => Promise.resolve(dataHubAdapterMock)),
  start: jest.fn(),
  stop: jest.fn(),
  sendData: jest.fn(),
  setReportedProps: jest.fn()
};

const dataHubAdapterMockConstructor = jest
  .fn()
  .mockImplementation(() => dataHubAdapterMock);

jest.doMock('../../../Adapter/DataHubAdapter', () => {
  return {
    DataHubAdapter: dataHubAdapterMockConstructor
  };
});

const licenseCheckerMock = {
  isLicensed: jest.fn().mockImplementation(() => {
    return true;
  })
};

const winstonMock = {
  winston: jest.fn(), // Constructor
  debug: jest.fn((msg) => {
    console.log(msg);
  })
};
jest.doMock('winston', () => {
  return winstonMock;
});

const dataPointMapperMock = {
  getTargets: jest.fn(),
  mapping: [],
  newConfigHandler: jest.fn()
};
const dataPointMapperMockConstructor = jest
  .fn()
  .mockImplementation(() => dataPointMapperMock);

jest.doMock('../../../../DataPointMapper', () => {
  return {
    DataPointMapper: dataPointMapperMockConstructor
  };
});

import {
  IDataHubConfig,
  IDataSinkConfig
} from '../../../../ConfigManager/interfaces';
import { DataHubDataSink, DataHubDataSinkOptions } from '..';

/**
 * GLOBAL MOCKS
 */
const configMock: IDataSinkConfig = {
  name: 'UnitTestDataHubDataSink',
  protocol: 'datahub',
  enabled: true,
  dataPoints: [],
  datahub: {
    regId: 'UTregId',
    symKey: 'UTKey',
    scopeId: 'UTScopeId',
    provisioningHost: 'UTHost.test'
  }
};

const runTimeConfigMock: IDataHubConfig = {
  groupDevice: false,
  signalGroups: {
    group1: ['address/1', 'address/2', 'address/3'],
    group2: ['address/4', 'address/5', 'address/6'],
    group3: ['address/7']
  },
  dataPointTypesData: {
    probe: {
      intervalHours: 24
    },
    telemetry: {
      intervalHours: 12
    }
  }
};

/**
 * TESTS
 */
describe('DataHubDataSink', () => {
  let datasinkUUT: DataHubDataSink;
  let dataHubDataSinkOptions: DataHubDataSinkOptions = {
    mapping: [],
    dataSinkConfig: configMock,
    runTimeConfig: runTimeConfigMock,
    termsAndConditionsAccepted: true,
    isLicensed: true,
    proxy: {
      ip: '',
      port: 0,
      type: 'http',
      enabled: true
    }
  };

  describe(`instantiation successfully`, () => {
    afterEach(() => {
      jest.clearAllMocks();
      configMock.dataPoints = [];
    });

    it('initializing successfully', async () => {
      datasinkUUT = new DataHubDataSink(dataHubDataSinkOptions);

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
          address: 'address/1',
          name: 'name'
        },
        {
          id: dataPointName2,
          type: 'probe',
          address: 'address/2',
          name: 'name'
        },
        {
          id: dataPointName3,
          type: 'probe',
          address: 'address/3',
          name: 'name'
        },
        {
          id: dataPointName4,
          type: 'probe',
          address: 'address/4',
          name: 'name'
        },
        {
          id: dataPointName5,
          type: 'probe',
          address: 'address/5',
          name: 'name'
        },
        {
          id: dataPointName6,
          type: 'probe',
          address: 'address/6',
          name: 'name'
        },
        {
          id: dataPointName7,
          type: 'probe',
          address: 'address/7',
          name: 'name'
        }
      ];

      datasinkUUT = new DataHubDataSink(dataHubDataSinkOptions);

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
              enabled: true
            },
            group2: {
              enabled: false
            },
            group3: {
              enabled: true
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
          expect(dataHubAdapterMock.sendData).toBeCalledWith({
            probe: [
              { 'address/1': 15 },
              { 'address/2': 15 },
              { 'address/3': 15 },
              { 'address/7': 15 }
            ],
            event: [],
            telemetry: []
          });
        });
    });
  });
});
