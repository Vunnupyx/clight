import { VirtualDataPointManager } from '..';
import { ConfigManager } from '../../ConfigManager';
import { EventBus } from '../../EventBus';
import { IDataSourceMeasurementEvent } from '../../Southbound/DataSources/interfaces';

jest.mock('winston');
jest.mock('fs');

jest.mock('../../EventBus');
jest.mock('../../DatapointCache');
jest.mock('../../ConfigManager');
jest.mock('../../SyncScheduler');

class mockCache {
  private dataPoints = {};

  update(events) {
    events?.forEach((event) => {
      const lastEvent = this.getCurrentEvent(event.measurement.id);
      this.dataPoints[event.measurement.id] = {
        changed: lastEvent
          ? lastEvent.measurement.value !== event.measurement.value
          : false,
        event
      };
    });
  }
  getCurrentEvent(id) {
    return this.dataPoints[id]?.event;
  }

  getLastestValue(id: string) {
    return this.dataPoints[id]?.timeseries?.[
      this.dataPoints[id]?.timeseries?.length - 1
    ];
  }

  hasChanged(id) {
    return this.dataPoints[id]?.changed;
  }

  clearAll() {
    this.dataPoints = {};
  }

  getTimeSeries() {}

  resetValue() {}
}

describe('Test VirtualDataPointManager', () => {
  const mockConfigManager = new ConfigManager({
    errorEventsBus: new EventBus(),
    lifecycleEventsBus: new EventBus()
  });
  mockConfigManager.config = {
    virtualDataPoints: []
  } as any;

  mockConfigManager.config.virtualDataPoints = [
    {
      name: '',
      id: 'andResult',
      sources: ['inputAnd1', 'inputAnd2'],
      operationType: 'and'
    },
    {
      name: '',
      id: 'orResult',
      sources: ['inputOr1', 'inputOr2'],
      operationType: 'or'
    },
    {
      name: '',
      id: 'notResult',
      sources: ['inputNot1'],
      operationType: 'not'
    },
    {
      name: '',
      id: 'counterResult',
      sources: ['inputCounter1'],
      operationType: 'counter'
    },
    {
      name: '',
      id: 'nested1AndResult',
      sources: ['andResult', 'orResult'],
      operationType: 'and'
    },
    {
      name: '',
      id: 'nested2AndResult',
      sources: ['nested1AndResult', 'notResult'],
      operationType: 'or'
    }
  ];

  const cache = new mockCache() as any;
  let virtualDpManager = new VirtualDataPointManager({
    configManager: mockConfigManager,
    cache
  });

  //@ts-ignore
  virtualDpManager.updateConfig();
  mockConfigManager.emit('configsLoaded');

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
        text: 'Giving only zero works correctly',
        firstValue: 0,
        secondValue: 0,
        formula: '0',
        expectedResult: 0
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

  describe('should check validity of VDPs correctly', () => {
    test.each([
      {
        title: 'Empty array',
        vdpsList: [],
        isValid: true
      },
      {
        title: 'Non-array',
        vdpsList: '',
        isValid: false,
        error: 'wrongFormat'
      },
      {
        title: 'undefined',
        vdpsList: undefined,
        isValid: false,
        error: 'wrongFormat'
      },
      {
        title: 'single VDP without sources',
        vdpsList: [{ id: 'id1', name: '', operationType: '', sources: [] }],
        isValid: true
      },
      {
        title: 'single VDP with non-VDP source',
        vdpsList: [
          { id: 'id1', name: '', operationType: '', sources: ['non-vdp-id'] }
        ],
        isValid: true
      },
      {
        title: 'two VDP with non-VDP source',
        vdpsList: [
          { id: 'id1', name: '', operationType: '', sources: ['non-vdp-id'] },
          { id: 'id2', name: '', operationType: '', sources: ['non-vdp-id'] }
        ],
        isValid: true
      },
      {
        title: 'two VDP with correct order',
        vdpsList: [
          { id: 'id1', name: '', operationType: '', sources: ['non-vdp-id'] },
          { id: 'id2', name: '', operationType: '', sources: ['id1'] }
        ],
        isValid: true
      },
      {
        title: 'two VDP with wrong order',
        vdpsList: [
          { id: 'id2', name: '', operationType: '', sources: ['id1'] },
          { id: 'id1', name: '', operationType: '', sources: ['non-vdp-id'] }
        ],
        isValid: false,
        error: 'wrongVdpsOrder',
        vdpIdWithError: 'id2',
        notYetDefinedSourceVdpId: 'id1'
      },
      {
        title: 'many VDP with correct order',
        vdpsList: [
          { id: 'id1', name: '', operationType: '', sources: ['non-vdp-id'] },
          { id: 'id2', name: '', operationType: '', sources: ['id1'] },
          { id: 'id3', name: '', operationType: '', sources: ['non-vdp-id'] },
          { id: 'id4', name: '', operationType: '', sources: ['id1', 'id2'] },
          {
            id: 'id5',
            name: '',
            operationType: '',
            sources: ['id3', 'non-vdp-id']
          },
          {
            id: 'id6',
            name: '',
            operationType: '',
            sources: ['id3', 'non-vdp-id', 'id5']
          }
        ],
        isValid: true
      },
      {
        title: 'many VDP with wrong order',
        vdpsList: [
          { id: 'id1', name: '', operationType: '', sources: ['non-vdp-id'] },
          { id: 'id2', name: '', operationType: '', sources: ['id1'] },
          { id: 'id3', name: '', operationType: '', sources: ['non-vdp-id'] },
          { id: 'id4', name: '', operationType: '', sources: ['id1', 'id2'] },
          {
            id: 'id6',
            name: '',
            operationType: '',
            sources: ['id3', 'non-vdp-id', 'id5']
          },
          {
            id: 'id5',
            name: '',
            operationType: '',
            sources: ['id3', 'non-vdp-id']
          }
        ],
        isValid: false,
        error: 'wrongVdpsOrder',
        vdpIdWithError: 'id6',
        notYetDefinedSourceVdpId: 'id5'
      },
      {
        title: 'one VDP depends on itself which should not happen',
        vdpsList: [
          { id: 'id1', name: '', operationType: '', sources: ['non-vdp-id'] },
          { id: 'id2', name: '', operationType: '', sources: ['id1'] },
          { id: 'id3', name: '', operationType: '', sources: ['non-vdp-id'] },
          { id: 'id4', name: '', operationType: '', sources: ['id1', 'id2'] },
          {
            id: 'id5',
            name: '',
            operationType: '',
            sources: ['id5', 'non-vdp-id']
          }
        ],
        isValid: false,
        error: 'wrongVdpsOrder',
        vdpIdWithError: 'id5',
        notYetDefinedSourceVdpId: 'id5'
      }
    ])(
      '$title returns isValid=$isValid, error=$error',
      ({
        vdpsList,
        isValid,
        error,
        vdpIdWithError,
        notYetDefinedSourceVdpId
      }) => {
        const vdpValidityStatus =
          //@ts-ignore
          virtualDpManager.getVdpValidityStatus(vdpsList);
        expect(vdpValidityStatus.isValid).toEqual(isValid);
        expect(vdpValidityStatus.error).toEqual(error);
        expect(vdpValidityStatus.vdpIdWithError).toEqual(vdpIdWithError);
        expect(vdpValidityStatus.notYetDefinedSourceVdpId).toEqual(
          notYetDefinedSourceVdpId
        );
      }
    );
  });
  describe('Blink detection should work correctly', () => {
    let msTimeAmountEachIterationRepresents = 500; // each i represents 1000ms
    let i = 0;
    beforeAll(() => {
      jest.useFakeTimers();
    });
    beforeEach(() => {
      jest.clearAllTimers();
      jest.clearAllMocks();
      i = 0;
    });
    afterAll(() => {
      jest.useRealTimers();
      jest.clearAllMocks();
    });

    describe('Single VDP', () => {
      describe('Single VDP with 3 rising edges in 5000 ms', () => {
        beforeEach(() => {
          mockConfigManager.config.virtualDataPoints = [
            {
              sources: ['source1'],
              operationType: 'blink-detection',
              id: 'vdp1',
              name: 'vdp1',
              blinkSettings: {
                timeframe: 5000,
                risingEdges: 3,
                linkedBlinkDetections: []
              }
            }
          ];
          virtualDpManager = new VirtualDataPointManager({
            configManager: mockConfigManager,
            cache
          });
          //@ts-ignore
          virtualDpManager.updateConfig();
          mockConfigManager.emit('configsLoaded');
        });
        test.each([
          {
            sourceValueArray: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            testname: 'No rising edges, always OFF'
          },
          {
            sourceValueArray: [
              0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1
            ],
            testname: 'Switch from OFF to ON'
          },
          {
            sourceValueArray: [
              0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0
            ],
            testname: 'ON delayed by one time frame'
          },
          {
            sourceValueArray: [
              0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2
            ],
            testname: 'Switch from OFF TO BLINK'
          },
          {
            sourceValueArray: [
              0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0
            ],
            testname: 'Switch from BLINK to OFF',
            comment:
              'After the 2nd rising edge there are not enough rising edges anymore to fullfil the condition >= 3 in 5 seconds. This would lead to an ON/OFF switches like "2,2,2,0,1,0,1. To prevent this, after the switch from BLINK to OFF, rising edges are ignored for 5 seconds.'
          },
          {
            sourceValueArray: [
              0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0
            ],
            testname: 'Not enough rising edges, ONs are delayed'
          },
          {
            sourceValueArray: [
              0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2
            ],
            testname:
              'Blinking detected and then sometimes not enough rising edges',
            comment:
              'Because of the suppressed rising edges after switching to OFF, there is one 2 missing'
          },
          {
            sourceValueArray: [
              0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2
            ],
            testname: 'Long blinking, with sometimes not enough rising edges'
          },
          {
            sourceValueArray: [
              0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0
            ],
            testname: 'Ignoring rising edge after blink stopped'
          }
        ])('$testname', ({ sourceValueArray, expectedResult }) => {
          let resultArray: number[] = [];

          for (let sourceValue of sourceValueArray) {
            jest
              .spyOn(Date, 'now')
              .mockImplementation(
                () => 0 + i * msTimeAmountEachIterationRepresents
              );
            const events: IDataSourceMeasurementEvent[] = [
              {
                dataSource: {
                  protocol: ''
                },
                measurement: {
                  id: 'source1',
                  name: '',
                  value: sourceValue
                }
              }
            ];
            // @ts-ignore
            let result = virtualDpManager.detectBlinking(
              events,
              // @ts-ignore
              virtualDpManager.config.find((x) => x.id === 'vdp1')
            );

            resultArray.push(result);
            jest.advanceTimersByTime(msTimeAmountEachIterationRepresents);
            i++;
          }

          expect(JSON.stringify(resultArray)).toEqual(
            JSON.stringify(expectedResult)
          );
        });
      });
      describe('Single VDP with 4 rising edges in 10000 ms', () => {
        beforeEach(() => {
          mockConfigManager.config.virtualDataPoints = [
            {
              sources: ['source1'],
              operationType: 'blink-detection',
              id: 'vdp1',
              name: 'vdp1',
              blinkSettings: {
                timeframe: 5000,
                risingEdges: 4,
                linkedBlinkDetections: []
              }
            }
          ];
          virtualDpManager = new VirtualDataPointManager({
            configManager: mockConfigManager,
            cache
          });
          //@ts-ignore
          virtualDpManager.updateConfig();
          mockConfigManager.emit('configsLoaded');
        });
        test.each([
          {
            sourceValueArray: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            testname: 'No rising edges, always OFF'
          },
          {
            sourceValueArray: [
              0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1
            ],
            testname: 'constant ON after first rising edge'
          },
          {
            sourceValueArray: [
              0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
              0
            ],
            testname: 'Status 1 and then 0 last exactly timeframe amount'
          },
          {
            sourceValueArray: [
              0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0
            ],
            testname: 'Delayed ON'
          },
          {
            sourceValueArray: [
              0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0
            ],
            testname: 'Blinking detected and then not enough rising edges'
          },
          {
            sourceValueArray: [
              0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2
            ],
            testname:
              'Blink detected, always enough rising edges after blinking'
          },
          {
            sourceValueArray: [
              0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0,
              0, 0, 0, 0, 0, 0, 0
            ],
            testname: 'Blink detected, after second cycle blink stops'
          },
          {
            sourceValueArray: [
              0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0,
              0
            ],
            expectedResult: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2,
              2
            ],
            testname: 'Source rising edges keep coming'
          }
        ])('$testname', ({ sourceValueArray, expectedResult }) => {
          let resultArray: number[] = [];

          for (let sourceValue of sourceValueArray) {
            jest
              .spyOn(Date, 'now')
              .mockImplementation(
                () => 0 + i * msTimeAmountEachIterationRepresents
              );
            const events: IDataSourceMeasurementEvent[] = [
              {
                dataSource: {
                  protocol: ''
                },
                measurement: {
                  id: 'source1',
                  name: '',
                  value: sourceValue
                }
              }
            ];
            // @ts-ignore
            let result = virtualDpManager.detectBlinking(
              events,
              // @ts-ignore
              virtualDpManager.config.find((x) => x.id === 'vdp1')
            );

            resultArray.push(result);
            jest.advanceTimersByTime(msTimeAmountEachIterationRepresents);
            i++;
          }

          expect(JSON.stringify(resultArray)).toEqual(
            JSON.stringify(expectedResult)
          );
        });
      });
    });
    describe('With dependent VDP (VDP2 depends on VDP1)', () => {
      beforeEach(() => {
        mockConfigManager.config.virtualDataPoints = [
          {
            sources: ['source1'],
            operationType: 'blink-detection',
            id: 'vdp1',
            name: 'vdp1',
            blinkSettings: {
              timeframe: 5000,
              risingEdges: 3,
              linkedBlinkDetections: []
            }
          },
          {
            sources: ['source2'],
            operationType: 'blink-detection',
            id: 'vdp2',
            name: 'vdp2',
            blinkSettings: {
              timeframe: 5000,
              risingEdges: 3,
              linkedBlinkDetections: ['vdp1']
            }
          }
        ];
        virtualDpManager = new VirtualDataPointManager({
          configManager: mockConfigManager,
          cache
        });
        //@ts-ignore
        virtualDpManager.updateConfig();
        mockConfigManager.emit('configsLoaded');
      });

      test.each([
        {
          sourceValueArray1: [
            0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
          ],
          sourceValueArray2: [
            0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
          ],
          expectedResult1: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
          ],
          expectedResult2: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
          ],
          testname: 'No blinking detected as linked signal resets the main one'
        },
        {
          sourceValueArray1: [
            1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0
          ],
          sourceValueArray2: [
            0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0
          ],
          // For expectedResult1: Start value is always 0, so if the first element is 1 in sourceValueArray1 it is treated like rising edge TBD
          expectedResult1: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2
          ],
          expectedResult2: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2
          ],
          testname: 'Use case for Haas machine'
        }
      ])(
        '$testname',
        ({
          sourceValueArray1,
          sourceValueArray2,
          expectedResult1,
          expectedResult2
        }) => {
          let resultArray1: number[] = [];
          let resultArray2: number[] = [];

          for (let [index, sourceValue1] of sourceValueArray1.entries()) {
            let sourceValue2 = sourceValueArray2[index];
            jest
              .spyOn(Date, 'now')
              .mockImplementation(
                () => 0 + i * msTimeAmountEachIterationRepresents
              );
            const events1: IDataSourceMeasurementEvent[] = [
              {
                dataSource: {
                  protocol: ''
                },
                measurement: {
                  id: 'source1',
                  name: '',
                  value: sourceValue1
                }
              }
            ];
            // @ts-ignore
            let result1 = virtualDpManager.detectBlinking(
              events1,
              //@ts-ignore
              virtualDpManager.config.find((x) => x.id === 'vdp1')
            );

            const events2: IDataSourceMeasurementEvent[] = [
              {
                dataSource: {
                  protocol: ''
                },
                measurement: {
                  id: 'source2',
                  name: '',
                  value: sourceValue2
                }
              }
            ];
            // @ts-ignore
            let result2 = virtualDpManager.detectBlinking(
              events2,
              // @ts-ignore
              virtualDpManager.config.find((x) => x.id === 'vdp2')
            );
            resultArray1.push(result1);
            resultArray2.push(result2);
            jest.advanceTimersByTime(msTimeAmountEachIterationRepresents);
            i++;
          }

          expect(JSON.stringify(resultArray1)).toEqual(
            JSON.stringify(expectedResult1)
          );
          expect(JSON.stringify(resultArray2)).toEqual(
            JSON.stringify(expectedResult2)
          );
        }
      );
    });
  });
});
