import { VirtualDataPointManager } from '..';
import { ConfigManager } from '../../ConfigManager';
import { DataPointCache } from '../../DatapointCache';
import { IDataSourceMeasurementEvent } from '../../Southbound/DataSources/interfaces';
import { EventBus } from '../../EventBus';

jest.mock('winston');
jest.mock('fs');

describe('Test VirtualDataPointManager', () => {
  const config = new ConfigManager({
    errorEventsBus: new EventBus<null>(),
    lifecycleEventsBus: new EventBus<null>()
  });

  config.config.virtualDataPoints = [
    {
      id: 'andResult',
      sources: ['inputAnd1', 'inputAnd2'],
      operationType: 'and'
    },
    {
      id: 'orResult',
      sources: ['inputOr1', 'inputOr2'],
      operationType: 'or'
    },
    {
      id: 'notResult',
      sources: ['inputNot1'],
      operationType: 'not'
    },
    {
      id: 'counterResult',
      sources: ['inputCounter1'],
      operationType: 'counter'
    },
    {
      id: 'nested1AndResult',
      sources: ['andResult', 'orResult'],
      operationType: 'and'
    },
    {
      id: 'nested2AndResult',
      sources: ['nested1AndResult', 'notResult'],
      operationType: 'or'
    }
  ];

  const cache = new DataPointCache();
  const virtualDpManager = new VirtualDataPointManager({
    configManager: config,
    cache
  });

  afterEach(() => {
    cache.clearAll();
  });

  test('should calculate and', () => {
    const events: IDataSourceMeasurementEvent[] = [
      {
        dataSource: {
          name: '',
          protocol: ''
        },
        measurement: {
          id: 'inputAnd1',
          name: '',
          value: true
        }
      },
      {
        dataSource: {
          name: '',
          protocol: ''
        },
        measurement: {
          id: 'inputAnd2',
          name: '',
          value: false
        }
      }
    ];

    // true && false => false
    cache.update(events);

    const virtualEvents1 = virtualDpManager.getVirtualEvents(events);
    expect(virtualEvents1.length).toBe(1);
    expect(virtualEvents1[0].measurement.value).toBeFalsy();

    // true && true => true
    events[1].measurement.value = true;
    cache.update(events);

    const virtualEvents2 = virtualDpManager.getVirtualEvents(events);
    expect(virtualEvents2.length).toBe(1);
    expect(virtualEvents2[0].measurement.value).toBeTruthy();
  });

  test('should calculate or', () => {
    const events: IDataSourceMeasurementEvent[] = [
      {
        dataSource: {
          name: '',
          protocol: ''
        },
        measurement: {
          id: 'inputOr1',
          name: '',
          value: false
        }
      },
      {
        dataSource: {
          name: '',
          protocol: ''
        },
        measurement: {
          id: 'inputOr2',
          name: '',
          value: false
        }
      }
    ];

    // false || false => false
    cache.update(events);

    const virtualEvents1 = virtualDpManager.getVirtualEvents(events);
    expect(virtualEvents1.length).toBe(1);
    expect(virtualEvents1[0].measurement.value).toBeFalsy();

    // true || false => true
    events[0].measurement.value = true;
    cache.update(events);

    const virtualEvents2 = virtualDpManager.getVirtualEvents(events);
    expect(virtualEvents2.length).toBe(1);
    expect(virtualEvents2[0].measurement.value).toBeTruthy();
  });

  test('should calculate not', () => {
    const events: IDataSourceMeasurementEvent[] = [
      {
        dataSource: {
          name: '',
          protocol: ''
        },
        measurement: {
          id: 'inputNot1',
          name: '',
          value: false
        }
      }
    ];

    // false => true
    cache.update(events);

    const virtualEvents1 = virtualDpManager.getVirtualEvents(events);
    expect(virtualEvents1.length).toBe(1);
    expect(virtualEvents1[0].measurement.value).toBeTruthy();
  });

  test('should count', () => {
    const events1: IDataSourceMeasurementEvent[] = [
      {
        dataSource: {
          name: '',
          protocol: ''
        },
        measurement: {
          id: 'inputCounter1',
          name: '',
          value: false
        }
      }
    ];

    // false => no event
    cache.update(events1);
    const virtualEvents1 = virtualDpManager.getVirtualEvents(events1);
    expect(virtualEvents1.length).toBe(0);

    // true => count 1
    const events2: IDataSourceMeasurementEvent[] = [
      {
        dataSource: {
          name: '',
          protocol: ''
        },
        measurement: {
          id: 'inputCounter1',
          name: '',
          value: true
        }
      }
    ];
    cache.update(events2);
    const virtualEvents2 = virtualDpManager.getVirtualEvents(events2);
    expect(virtualEvents2.length).toBe(1);
    expect(virtualEvents2[0].measurement.value).toBe(1);

    // false => no event
    const events3: IDataSourceMeasurementEvent[] = [
      {
        dataSource: {
          name: '',
          protocol: ''
        },
        measurement: {
          id: 'inputCounter1',
          name: '',
          value: false
        }
      }
    ];
    cache.update(events3);
    const virtualEvents3 = virtualDpManager.getVirtualEvents(events3);
    expect(virtualEvents3.length).toBe(0);

    // true => count 2
    const events4: IDataSourceMeasurementEvent[] = [
      {
        dataSource: {
          name: '',
          protocol: ''
        },
        measurement: {
          id: 'inputCounter1',
          name: '',
          value: true
        }
      }
    ];
    cache.update(events4);
    const virtualEvents4 = virtualDpManager.getVirtualEvents(events4);
    expect(virtualEvents4.length).toBe(1);
    expect(virtualEvents4[0].measurement.value).toBe(2);
  });

  test('should calculate nested events', () => {
    const events: IDataSourceMeasurementEvent[] = [
      {
        dataSource: {
          name: '',
          protocol: ''
        },
        measurement: {
          id: 'inputAnd1',
          name: '',
          value: true
        }
      },
      {
        dataSource: {
          name: '',
          protocol: ''
        },
        measurement: {
          id: 'inputAnd2',
          name: '',
          value: true
        }
      },
      {
        dataSource: {
          name: '',
          protocol: ''
        },
        measurement: {
          id: 'inputOr1',
          name: '',
          value: false
        }
      },
      {
        dataSource: {
          name: '',
          protocol: ''
        },
        measurement: {
          id: 'inputOr2',
          name: '',
          value: true
        }
      },
      {
        dataSource: {
          name: '',
          protocol: ''
        },
        measurement: {
          id: 'inputNot1',
          name: '',
          value: true
        }
      }
    ];

    // false => true
    cache.update(events);

    const virtualEvents = virtualDpManager.getVirtualEvents(events);
    expect(virtualEvents.length).toBe(5);
    expect(virtualEvents[3].measurement.value).toBeTruthy();
    expect(virtualEvents[4].measurement.value).toBeTruthy();
  });
});
