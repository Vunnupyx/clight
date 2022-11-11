import { VirtualDataPointManager } from '..';
import { ConfigManager } from '../../ConfigManager';
import { DataPointCache } from '../../DatapointCache';
import { IDataSourceMeasurementEvent } from '../../Southbound/DataSources/interfaces';
import { EventBus } from '../../EventBus';
import { IErrorEvent, ILifecycleEvent } from '../../../common/interfaces';

jest.mock('winston');
jest.mock('fs');

describe('Test VirtualDataPointManager', () => {
  const config = new ConfigManager({
    errorEventsBus: new EventBus<IErrorEvent>(),
    lifecycleEventsBus: new EventBus<ILifecycleEvent>()
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

  afterAll(() => {
    //@ts-ignore
    virtualDpManager.scheduler.shutdown();
  });

  config.emit('configsLoaded');

  afterEach(() => {
    cache.clearAll();
  });

  describe('should calculate custom calculation expressions', () => {
    let defaultFormula =
      '( a6cc9e0e-34a8-456a-85ac-f8780b6dd52b / b6723asd-34a8-456a-85ac-f8780b6dd52b ) + 20';
    test.each([
      {
        text: '(60 / 20) + 20',
        firstValue: 60,
        secondValue: 20,
        formula: defaultFormula,
        expectedResult: 23
      },
      {
        text: 'value of one variable is correctly shown',
        firstValue: 60,
        secondValue: 20,
        formula: 'a6cc9e0e-34a8-456a-85ac-f8780b6dd52b',
        expectedResult: 60
      },
      {
        text: 'Giving only one number is working correctly',
        firstValue: 0,
        secondValue: 0,
        formula: '70',
        expectedResult: 70
      },
      {
        // handle true as 1
        text: 'true + 1',
        firstValue: true,
        secondValue: 20,
        formula: 'a6cc9e0e-34a8-456a-85ac-f8780b6dd52b + 1',
        expectedResult: 2
      },
      {
        // handle false as 0
        text: 'false + 1',
        firstValue: false,
        secondValue: 20,
        formula: 'a6cc9e0e-34a8-456a-85ac-f8780b6dd52b + 1',
        expectedResult: 1
      },
      {
        text: 'boolean values in formula',
        firstValue: false,
        secondValue: true,
        formula: defaultFormula,
        expectedResult: 20
      },
      {
        text: 'using variables multiple times in a formula',
        firstValue: 60,
        secondValue: 20,
        formula:
          '( a6cc9e0e-34a8-456a-85ac-f8780b6dd52b / b6723asd-34a8-456a-85ac-f8780b6dd52b ) + a6cc9e0e-34a8-456a-85ac-f8780b6dd52b * b6723asd-34a8-456a-85ac-f8780b6dd52b',
        expectedResult: 1203
      },
      {
        text: 'multiple divisions',
        firstValue: 60,
        secondValue: 20,
        formula:
          'a6cc9e0e-34a8-456a-85ac-f8780b6dd52b / b6723asd-34a8-456a-85ac-f8780b6dd52b / b6723asd-34a8-456a-85ac-f8780b6dd52b / b6723asd-34a8-456a-85ac-f8780b6dd52b',
        expectedResult: 0.0075
      },
      {
        text: 'Decimal result: (10 / 3) + 20',
        firstValue: 10,
        secondValue: 3,
        formula: defaultFormula,
        expectedResult: 23.3333
      },
      {
        text: 'Formula does not include variables: (10 / 4)',
        firstValue: 10,
        secondValue: 3,
        formula: '10 / 4',
        expectedResult: 2.5
      },
      {
        text: 'number/0 division',
        firstValue: 26,
        secondValue: 0,
        formula: defaultFormula,
        expectedResult: null
      },
      {
        text: '0/0 division',
        firstValue: 0,
        secondValue: 0,
        formula: defaultFormula,
        expectedResult: null
      },
      {
        text: 'number/Infinity division',
        firstValue: 26,
        secondValue: Infinity,
        formula: defaultFormula,
        expectedResult: null
      },
      {
        text: 'number/-Infinity division',
        firstValue: 26,
        secondValue: -Infinity,
        formula: defaultFormula,
        expectedResult: null
      },
      {
        text: 'Infinitiy/-Infinity division',
        firstValue: Infinity,
        secondValue: -Infinity,
        formula: defaultFormula,
        expectedResult: null
      },
      {
        text: 'variable values are string',
        firstValue: 'string1',
        secondValue: 'string2',
        formula: defaultFormula,
        expectedResult: null
      },
      {
        text: 'boolean values causes 0/0',
        firstValue: false,
        secondValue: false,
        formula: defaultFormula,
        expectedResult: null
      },
      {
        text: 'invalid variable id',
        firstValue: 10,
        secondValue: 20,
        formula:
          '34a8-4454-85ac-dgdthtt / b6723asd-34a8-456a-85ac-f8780b6dd52b',
        expectedResult: null
      },
      {
        text: 'malicious string',
        firstValue: 10,
        secondValue: 20,
        formula:
          'process.exit(); a6cc9e0e-34a8-456a-85ac-f8780b6dd52b / b6723asd-34a8-456a-85ac-f8780b6dd52b',
        expectedResult: null
      },
      {
        text: 'two operators together +-',
        firstValue: 10,
        secondValue: 20,
        formula:
          ' a6cc9e0e-34a8-456a-85ac-f8780b6dd52b +- b6723asd-34a8-456a-85ac-f8780b6dd52b',
        expectedResult: null
      },
      {
        text: 'four operators together +/*-',
        firstValue: 10,
        secondValue: 20,
        formula:
          ' a6cc9e0e-34a8-456a-85ac-f8780b6dd52b +/*- b6723asd-34a8-456a-85ac-f8780b6dd52b',
        expectedResult: null
      },
      {
        text: 'operator with quotes',
        firstValue: 10,
        secondValue: 20,
        formula:
          ' a6cc9e0e-34a8-456a-85ac-f8780b6dd52b "+" b6723asd-34a8-456a-85ac-f8780b6dd52b',
        expectedResult: null
      }
    ])(
      '$text should result in $expectedResult',
      ({ text, firstValue, secondValue, formula, expectedResult }) => {
        const events: IDataSourceMeasurementEvent[] = [
          {
            dataSource: {
              name: '',
              protocol: ''
            },
            measurement: {
              id: 'a6cc9e0e-34a8-456a-85ac-f8780b6dd52b',
              name: '',
              value: firstValue
            }
          },
          {
            dataSource: {
              name: '',
              protocol: ''
            },
            measurement: {
              id: 'b6723asd-34a8-456a-85ac-f8780b6dd52b',
              name: '',
              value: secondValue
            }
          }
        ];

        // @ts-ignore
        const result = virtualDpManager.calculation(events, {
          sources: [
            'a6cc9e0e-34a8-456a-85ac-f8780b6dd52b',
            'b6723asd-34a8-456a-85ac-f8780b6dd52b'
          ],
          operationType: 'calculation',
          //name: 'MyFancyCalculation',
          id: 'dd88cdb9-994c-40ce-be60-1d37f3aa755a',
          formula
        });
        expect(result).toEqual(expectedResult);
      }
    );
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
    expect(virtualEvents1[0].measurement.value).toBe(0);

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
    expect(virtualEvents3[0].measurement.value).toBe(1);

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
