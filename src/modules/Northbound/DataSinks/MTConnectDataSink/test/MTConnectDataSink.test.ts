import { MTConnectDataSink } from '..';
import {
  DataSinkProtocols,
  DataSourceProtocols
} from '../../../../../common/interfaces';
import { ConfigManager } from '../../../../ConfigManager';
import emptyDefaultConfig from '../../../../../../_mdclight/runtime-files/templates/empty.json';
import {
  IDataSinkConfig,
  IDataSourceConfig,
  IGeneralConfig
} from '../../../../ConfigManager/interfaces';
import { IDataSourceMeasurementEvent } from '../../../../Southbound/DataSources/interfaces';
import { EventBus } from '../../../../EventBus';
import { MTConnectAdapter } from '../../../Adapter/MTConnectAdapter';
import { MessengerManager } from '../../../MessengerManager';
import { DataPointCache } from '../../../../DatapointCache';

jest.mock('fs');
jest.mock('winston');
jest.mock('../../../MessengerManager');
jest.mock('../../../Adapter/MTConnectAdapter');
jest.mock('../../../../ConfigManager');
jest.mock('../../../../EventBus');
jest.mock('../../../../DatapointCache');

jest.mock('../../../../SyncScheduler', () => ({
  SynchronousIntervalScheduler: {
    getInstance: jest.fn(() => ({
      addListener: jest.fn()
    }))
  }
}));

const generalConfigMock: IGeneralConfig = {
  manufacturer: '',
  serialNumber: '',
  model: '',
  control: ''
};

let addDataItemMock = jest.fn();
(ConfigManager as any).mockImplementation(() => {
  return {
    saveConfigToFile: () => {}
  };
});

beforeEach(() => {
  addDataItemMock = jest.fn();
  (MTConnectAdapter as any).mockImplementation(() => {
    return {
      addDataItem: addDataItemMock,
      start: () => {},
      sendChanged: () => {}
    };
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Test MTConnectDataSink', () => {
  const PORT = 7881;
  const mtConnectConfig = { listenerPort: PORT };
  const messengerManager = new MessengerManager({});
  test('should add data item', async () => {
    const dataSinkConfig: IDataSinkConfig = {
      protocol: DataSinkProtocols.MTCONNECT,
      enabled: true,
      dataPoints: [
        { address: 'target1', id: '2', name: '', type: 'event' },
        { address: 'target2', id: '1', name: '', type: 'event' }
      ]
    };

    const dataSink = new MTConnectDataSink({
      mapping: [],
      generalConfig: generalConfigMock,
      dataSinkConfig,
      mtConnectConfig,
      messengerManager,
      termsAndConditionsAccepted: true,
      dataPointCache: new DataPointCache()
    });

    dataSink.init();

    expect(addDataItemMock).toHaveBeenCalledTimes(3);

    const firstDataItem = addDataItemMock.mock.calls[0][0];
    const secondDataItem = addDataItemMock.mock.calls[1][0];
    const thirdDataItem = addDataItemMock.mock.calls[2][0];

    expect(firstDataItem.name).toBe('runTime'); //TBD: this was avail, but in code it is runTime?
    expect(secondDataItem.name).toBe('target1');
    expect(thirdDataItem.name).toBe('target2');
  });

  test('should map bool values', async () => {
    const config = new ConfigManager({
      errorEventsBus: new EventBus(),
      lifecycleEventsBus: new EventBus()
    });

    const dataSourceConfig: IDataSourceConfig = {
      protocol: DataSourceProtocols.S7,
      enabled: true,
      type: 'nck',
      dataPoints: [
        { id: 'source', name: '', address: '', readFrequency: 1000, type: 's7' }
      ]
    };
    const dataSinkConfig: IDataSinkConfig = {
      protocol: DataSinkProtocols.MTCONNECT,
      enabled: true,
      dataPoints: [
        {
          address: '1',
          id: 'target',
          name: '',
          type: 'event',
          map: { true: 'ARMED', false: 'TRIGGERED' }
        }
      ]
    };
    config.config = {
      ...emptyDefaultConfig,
      dataSinks: [dataSinkConfig],
      dataSources: [dataSourceConfig],
      mapping: [{ source: 'source', target: 'target', id: '' }]
    } as any;

    const dataSink = new MTConnectDataSink({
      mapping: config.config.mapping,
      dataSinkConfig,
      generalConfig: generalConfigMock,
      mtConnectConfig,
      messengerManager,
      termsAndConditionsAccepted: true,
      dataPointCache: new DataPointCache()
    });

    dataSink.init();

    const event: IDataSourceMeasurementEvent = {
      measurement: {
        id: 'source',
        name: '',
        value: true
      },
      dataSource: {
        protocol: 'mtconnect'
      }
    };
    dataSink.onMeasurements([event]);

    // First is always "avail", we need "target" here
    const secondsDataItem = addDataItemMock.mock.calls[1][0];

    expect(secondsDataItem.value).toBe('ARMED');
  });

  test('should map enum values', async () => {
    const config = new ConfigManager({
      errorEventsBus: new EventBus(),
      lifecycleEventsBus: new EventBus()
    });

    const dataSourceConfig: IDataSourceConfig = {
      protocol: DataSourceProtocols.S7,
      enabled: true,
      type: 'nck',
      dataPoints: [
        {
          id: 'source1',
          name: '',
          address: '',
          readFrequency: 1000,
          type: 's7'
        },
        {
          id: 'source2',
          name: '',
          address: '',
          readFrequency: 1000,
          type: 's7'
        }
      ]
    };
    const dataSinkConfig: IDataSinkConfig = {
      protocol: '',
      enabled: true,
      dataPoints: [
        {
          address: '1',
          id: 'target',
          name: '',
          type: 'event',
          map: { '0': 'ARMED', '1': 'TRIGGERED' }
        }
      ]
    };
    config.config = {
      ...emptyDefaultConfig,
      dataSinks: [dataSinkConfig],
      dataSources: [dataSourceConfig],
      mapping: [
        { source: 'source1', target: 'target', mapValue: '0', id: '' },
        { source: 'source2', target: 'target', mapValue: '1', id: '' }
      ]
    } as any;

    const dataSink = new MTConnectDataSink({
      mapping: config.config.mapping,
      dataSinkConfig,
      generalConfig: generalConfigMock,
      mtConnectConfig,
      messengerManager,
      termsAndConditionsAccepted: true,
      dataPointCache: new DataPointCache()
    });

    dataSink.init();

    const event1: IDataSourceMeasurementEvent = {
      measurement: {
        id: 'source1',
        name: '',
        value: false
      },
      dataSource: {
        protocol: 'mtconnect'
      }
    };
    const event2: IDataSourceMeasurementEvent = {
      measurement: {
        id: 'source2',
        name: '',
        value: true
      },
      dataSource: {
        protocol: 'mtconnect'
      }
    };
    dataSink.onMeasurements([event1, event2]);

    // First is always "avail", we need "target" here
    const secondsDataItem = addDataItemMock.mock.calls[1][0];

    expect(secondsDataItem.value).toBe('TRIGGERED');
  });

  test('should not change string or number values', async () => {
    const config = new ConfigManager({
      errorEventsBus: new EventBus(),
      lifecycleEventsBus: new EventBus()
    });

    const dataSourceConfig: IDataSourceConfig = {
      protocol: DataSourceProtocols.S7,
      enabled: true,
      type: 'nck',
      dataPoints: [
        {
          id: 'source1',
          name: '',
          address: '',
          readFrequency: 1000,
          type: 's7'
        },
        {
          id: 'source2',
          name: '',
          address: '',
          readFrequency: 1000,
          type: 's7'
        }
      ]
    };
    const dataSinkConfig: IDataSinkConfig = {
      protocol: '',
      enabled: true,
      dataPoints: [
        {
          address: '1',
          id: 'target1',
          name: '',
          type: 'event'
        },
        {
          address: '1',
          id: 'target2',
          name: '',
          type: 'event'
        }
      ]
    };
    config.config = {
      ...emptyDefaultConfig,
      dataSinks: [dataSinkConfig],
      dataSources: [dataSourceConfig],
      mapping: [
        { source: 'source1', target: 'target2', id: '' },
        { source: 'source2', target: 'target1', id: '' }
      ]
    } as any;

    const dataSink = new MTConnectDataSink({
      mapping: config.config.mapping,
      dataSinkConfig,
      generalConfig: generalConfigMock,
      mtConnectConfig,
      messengerManager,
      termsAndConditionsAccepted: true,
      dataPointCache: new DataPointCache()
    });

    dataSink.init();

    const event1: IDataSourceMeasurementEvent = {
      measurement: {
        id: 'source1',
        name: '',
        value: 'Hello World!'
      },
      dataSource: {
        protocol: 'mtconnect'
      }
    };
    const event2: IDataSourceMeasurementEvent = {
      measurement: {
        id: 'source2',
        name: '',
        value: 102
      },
      dataSource: {
        protocol: 'mtconnect'
      }
    };
    dataSink.onMeasurements([event1, event2]);

    // First is always "avail", we need other targets here
    const secondsDataItem = addDataItemMock.mock.calls[1][0];
    const thirdDataItem = addDataItemMock.mock.calls[2][0];

    expect(secondsDataItem.value).toBe(102);
    expect(thirdDataItem.value).toBe('Hello World!');
  });

  test('with initialization value is set to 0', async () => {
    const config = new ConfigManager({
      errorEventsBus: new EventBus(),
      lifecycleEventsBus: new EventBus()
    });

    const dataSinkConfig: IDataSinkConfig = {
      protocol: '',
      enabled: true,
      dataPoints: []
    };

    const dataSink = new MTConnectDataSink({
      mapping: [],
      dataSinkConfig,
      generalConfig: generalConfigMock,
      mtConnectConfig,
      messengerManager,
      termsAndConditionsAccepted: true,
      dataPointCache: new DataPointCache()
    });

    dataSink.init();

    const avail = addDataItemMock.mock.calls[0][0];

    expect(avail.value).toBe(0);
  });
});
