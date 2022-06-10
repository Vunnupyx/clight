import { MTConnectDataSink } from '..';
import {
  DataSinkProtocols,
  DataSourceLifecycleEventTypes,
  EventLevels
} from '../../../../../common/interfaces';
import { ConfigManager, emptyDefaultConfig } from '../../../../ConfigManager';
import {
  IDataSinkConfig,
  IDataSourceConfig
} from '../../../../ConfigManager/interfaces';
import { DataPointMapper } from '../../../../DataPointMapper';
import { IDataSourceMeasurementEvent } from '../../../../Southbound/DataSources/interfaces';
import { EventBus } from '../../../../EventBus';
import { MTConnectAdapter } from '../../../Adapter/MTConnectAdapter';

const licenseCheckerMock = {
  isLicensed: jest.fn().mockImplementation(() => {
    return true
  })
}

jest.mock('fs');
jest.mock('winston');

xdescribe('Test MTConnectDataSink', () => {
  const PORT = 7881;
  const mtConnectConfig = { listenerPort: PORT };
  test('should add data item', async () => {
    const adapter = new MTConnectAdapter({ listenerPort: PORT });
    const addDataItemMock = jest.spyOn(adapter, 'addDataItem');

    const dataSinkConfig: IDataSinkConfig = {
      name: '',
      protocol: DataSinkProtocols.MTCONNECT,
      enabled: true,
      dataPoints: [
        { address: 'target1', id: '2', name: '', type: 'event' },
        { address: 'target2', id: '1', name: '', type: 'event' }
      ]
    };

    const dataSink = new MTConnectDataSink({
      mapping: [],
      dataSinkConfig,
      mtConnectConfig,
      termsAndConditionsAccepted: true,
      licenseChecker: licenseCheckerMock as any
    });

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
      errorEventsBus: new EventBus<null>() as any,
      lifecycleEventsBus: new EventBus<null>() as any,
    });

    const dataSourceConfig: IDataSourceConfig = {
      name: '',
      protocol: '',
      enabled: true,
      dataPoints: [
        { id: 'source', name: '', address: '', readFrequency: 1000, type: 's7' }
      ]
    };
    const dataSinkConfig: IDataSinkConfig = {
      name: '',
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
    };

    const adapter = new MTConnectAdapter(mtConnectConfig);

    const addDataItemMock = jest.spyOn(adapter, 'addDataItem');

    const dataSink = new MTConnectDataSink({
      mapping: config.config.mapping,
      dataSinkConfig,
      mtConnectConfig,
      termsAndConditionsAccepted: true,
      licenseChecker: licenseCheckerMock as any
    });

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
      errorEventsBus: new EventBus<null>() as any,
      lifecycleEventsBus: new EventBus<null>() as any
    });

    const dataSourceConfig: IDataSourceConfig = {
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
      name: '',
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
    };

    const adapter = new MTConnectAdapter(mtConnectConfig);

    const addDataItemMock = jest.spyOn(adapter, 'addDataItem');

    const dataSink = new MTConnectDataSink({
      mapping: config.config.mapping,
      dataSinkConfig,
      mtConnectConfig,
      termsAndConditionsAccepted: true,
      licenseChecker: licenseCheckerMock as any
    });

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
      errorEventsBus: new EventBus<null>() as any,
      lifecycleEventsBus: new EventBus<null>() as any
    });

    const dataSourceConfig: IDataSourceConfig = {
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
      name: '',
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
    };

    const adapter = new MTConnectAdapter(mtConnectConfig);
    const addDataItemMock = jest.spyOn(adapter, 'addDataItem');

    const dataSink = new MTConnectDataSink({
      mapping: config.config.mapping,
      dataSinkConfig,
      mtConnectConfig,
      termsAndConditionsAccepted: true,
      licenseChecker: licenseCheckerMock as any
    });

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
      errorEventsBus: new EventBus<null>() as any,
      lifecycleEventsBus: new EventBus<null>() as any
    });

    const dataSinkConfig: IDataSinkConfig = {
      name: '',
      protocol: '',
      enabled: true,
      dataPoints: []
    };

    const adapter = new MTConnectAdapter(mtConnectConfig);

    const addDataItemMock = jest.spyOn(adapter, 'addDataItem');

    const dataSink = new MTConnectDataSink({
      mapping: [],
      dataSinkConfig,
      mtConnectConfig,
      termsAndConditionsAccepted: true,
      licenseChecker: licenseCheckerMock as any
    });

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
