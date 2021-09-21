import { MTConnectDataSink } from '..';
import {
  DataSourceLifecycleEventTypes,
  EventLevels
} from '../../../../common/interfaces';
import { ConfigManager } from '../../../ConfigManager';
import {
  IDataSinkConfig,
  IDataSourceConfig
} from '../../../ConfigManager/interfaces';
import { DataPointMapper } from '../../../DataPointMapper';
import { IDataSourceMeasurementEvent } from '../../../DataSource';
import { EventBus } from '../../../EventBus';
import { MTConnectAdapter } from '../../../MTConnectAdapter';
import { MTConnectManager } from '../../../MTConnectManager';

jest.mock('fs');
jest.mock('winston');
jest.mock('../../../MTConnectManager');

describe('Test MTConnectDataSink', () => {
  test('should add data item', async () => {
    const config = new ConfigManager({
      errorEventsBus: new EventBus<null>(),
      lifecycleEventsBus: new EventBus<null>()
    });
    const adapter = new MTConnectAdapter(config);

    const mtcManagerMock = jest.spyOn(MTConnectManager, 'getAdapter');
    const addDataItemMock = jest.spyOn(adapter, 'addDataItem');
    mtcManagerMock.mockReturnValue(adapter);

    const dataSinkConfig: IDataSinkConfig = {
      id: '',
      name: '',
      protocol: '',
      enabled: true,
      dataPoints: [
        { id: 'target1', name: '', type: 'event' },
        { id: 'target2', name: '', type: 'event' }
      ]
    };

    const dataSink = new MTConnectDataSink({ config: dataSinkConfig });

    dataSink.init();

    expect(addDataItemMock).toBeCalledTimes(3);

    const firstDataItem = addDataItemMock.mock.calls[0][0];
    const secondDataItem = addDataItemMock.mock.calls[1][0];
    const thirdDataItem = addDataItemMock.mock.calls[2][0];

    expect(firstDataItem.name).toBe('avail');
    expect(secondDataItem.name).toBe('target1');
    expect(thirdDataItem.name).toBe('target2');
  });

  test('should map bool values', async () => {
    const config = new ConfigManager({
      errorEventsBus: new EventBus<null>(),
      lifecycleEventsBus: new EventBus<null>()
    });

    const dataSourceConfig: IDataSourceConfig = {
      id: '',
      name: '',
      protocol: '',
      enabled: true,
      dataPoints: [
        { id: 'source', name: '', address: '', readFrequency: 1000, type: 's7' }
      ]
    };
    const dataSinkConfig: IDataSinkConfig = {
      id: '',
      name: '',
      protocol: '',
      enabled: true,
      dataPoints: [
        {
          id: 'target',
          name: '',
          type: 'event',
          map: { true: 'ARMED', false: 'TRIGGERED' }
        }
      ]
    };
    config.config = {
      general: { serialNumber: '', manufacturer: '', model: '', control: '' },
      dataSinks: [dataSinkConfig],
      dataSources: [dataSourceConfig],
      virtualDataPoints: [],
      mapping: [{ source: 'source', target: 'target', id: '' }]
    };

    const adapter = new MTConnectAdapter(config);
    const mapper = new DataPointMapper(config);

    const mtcManagerMock = jest.spyOn(MTConnectManager, 'getAdapter');
    const getDpMapper = jest.spyOn(DataPointMapper, 'getInstance');
    const addDataItemMock = jest.spyOn(adapter, 'addDataItem');
    getDpMapper.mockReturnValue(mapper);
    mtcManagerMock.mockReturnValue(adapter);

    const dataSink = new MTConnectDataSink({ config: dataSinkConfig });

    dataSink.init();

    const event: IDataSourceMeasurementEvent = {
      measurement: {
        id: 'source',
        name: '',
        value: true
      },
      dataSource: {
        name: '',
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
      errorEventsBus: new EventBus<null>(),
      lifecycleEventsBus: new EventBus<null>()
    });

    const dataSourceConfig: IDataSourceConfig = {
      id: '',
      name: '',
      protocol: '',
      enabled: true,
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
      id: '',
      name: '',
      protocol: '',
      enabled: true,
      dataPoints: [
        {
          id: 'target',
          name: '',
          type: 'event',
          map: { '0': 'ARMED', '1': 'TRIGGERED' }
        }
      ]
    };
    config.config = {
      general: { serialNumber: '', manufacturer: '', model: '', control: '' },
      dataSinks: [dataSinkConfig],
      dataSources: [dataSourceConfig],
      virtualDataPoints: [],
      mapping: [
        { source: 'source1', target: 'target', mapValue: '0', id: '' },
        { source: 'source2', target: 'target', mapValue: '1', id: '' }
      ]
    };

    const adapter = new MTConnectAdapter(config);
    const mapper = new DataPointMapper(config);

    const mtcManagerMock = jest.spyOn(MTConnectManager, 'getAdapter');
    const getDpMapper = jest.spyOn(DataPointMapper, 'getInstance');
    const addDataItemMock = jest.spyOn(adapter, 'addDataItem');
    getDpMapper.mockReturnValue(mapper);
    mtcManagerMock.mockReturnValue(adapter);

    const dataSink = new MTConnectDataSink({ config: dataSinkConfig });

    dataSink.init();

    const event1: IDataSourceMeasurementEvent = {
      measurement: {
        id: 'source1',
        name: '',
        value: false
      },
      dataSource: {
        name: '',
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
        name: '',
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
      errorEventsBus: new EventBus<null>(),
      lifecycleEventsBus: new EventBus<null>()
    });

    const dataSourceConfig: IDataSourceConfig = {
      id: '',
      name: '',
      protocol: '',
      enabled: true,
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
      id: '',
      name: '',
      protocol: '',
      enabled: true,
      dataPoints: [
        {
          id: 'target1',
          name: '',
          type: 'event'
        },
        {
          id: 'target2',
          name: '',
          type: 'event'
        }
      ]
    };
    config.config = {
      general: { serialNumber: '', manufacturer: '', model: '', control: '' },
      dataSinks: [dataSinkConfig],
      dataSources: [dataSourceConfig],
      virtualDataPoints: [],
      mapping: [
        { source: 'source1', target: 'target2', id: '' },
        { source: 'source2', target: 'target1', id: '' }
      ]
    };

    const adapter = new MTConnectAdapter(config);
    const mapper = new DataPointMapper(config);

    const mtcManagerMock = jest.spyOn(MTConnectManager, 'getAdapter');
    const getDpMapper = jest.spyOn(DataPointMapper, 'getInstance');
    const addDataItemMock = jest.spyOn(adapter, 'addDataItem');
    getDpMapper.mockReturnValue(mapper);
    mtcManagerMock.mockReturnValue(adapter);

    const dataSink = new MTConnectDataSink({ config: dataSinkConfig });

    dataSink.init();

    const event1: IDataSourceMeasurementEvent = {
      measurement: {
        id: 'source1',
        name: '',
        value: 'Hello World!'
      },
      dataSource: {
        name: '',
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
        name: '',
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

  test('should handle life cycle events', async () => {
    const config = new ConfigManager({
      errorEventsBus: new EventBus<null>(),
      lifecycleEventsBus: new EventBus<null>()
    });

    const dataSinkConfig: IDataSinkConfig = {
      id: '',
      name: '',
      protocol: '',
      enabled: true,
      dataPoints: []
    };

    const adapter = new MTConnectAdapter(config);

    const mtcManagerMock = jest.spyOn(MTConnectManager, 'getAdapter');
    const addDataItemMock = jest.spyOn(adapter, 'addDataItem');
    mtcManagerMock.mockReturnValue(adapter);

    const dataSink = new MTConnectDataSink({ config: dataSinkConfig });

    dataSink.init();

    const avail = addDataItemMock.mock.calls[0][0];

    expect(avail.isUnavailable).toBeTruthy();

    dataSink.onLifecycleEvent({
      id: '',
      level: EventLevels.DataPoint,
      type: DataSourceLifecycleEventTypes.Connected
    });

    expect(avail.value).toBe('AVAILABLE');

    dataSink.onLifecycleEvent({
      id: '',
      level: EventLevels.DataPoint,
      type: DataSourceLifecycleEventTypes.Disconnected
    });

    expect(avail.isUnavailable).toBeTruthy();
  });
});
