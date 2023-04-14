import { MTConnectDataSource } from '..';
import fetch from 'node-fetch';
import { IMTConnectDataSourceConnection } from '../../../../ConfigManager/interfaces';
import { DataSourceProtocols } from '../../../../../common/interfaces';
import { IDataSourceParams } from '../../interfaces';
import { IHostConnectivityState } from '../interfaces';
import {
  mockCurrentResponse,
  mockSampleResponse,
  mockFailTooAhead,
  mockFailTooBehind
} from './mockXmls';

jest.mock('winston');

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');
let mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

const mockSyncSchedulerInstance = {
  addListener: jest.fn()
};
jest.mock('../../../../SyncScheduler', () => ({
  SynchronousIntervalScheduler: {
    getInstance: () => mockSyncSchedulerInstance
  }
}));

const connection: IMTConnectDataSourceConnection = {
  hostname: 'http://1.1.1.1',
  port: 1234
};
let mtconnectDataSource: MTConnectDataSource;
const mockConfig: IDataSourceParams = {
  config: {
    protocol: DataSourceProtocols.MTCONNECT,
    connection,
    dataPoints: [],
    type: 'Agent',
    enabled: true,
    machineName: undefined
  },
  termsAndConditionsAccepted: true
};

describe('MTConnectDataSource', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    //@ts-ignore
    mtconnectDataSource = undefined;
  });

  describe('Instantiation', () => {
    describe('Setting hostname correctly', () => {
      it.each([
        { hostname: '', port: 1, machineName: '', expectedResult: '' },
        { hostname: undefined, port: 1, machineName: '', expectedResult: '' },
        { hostname: null, port: 1, machineName: '', expectedResult: '' },
        { hostname: 'sudo rm', port: 1, machineName: '', expectedResult: '' },
        { hostname: '$abc', port: 1, machineName: '', expectedResult: '' },
        {
          hostname: 'abcd',
          port: 123,
          machineName: '',
          expectedResult: 'http://abcd:123'
        },
        {
          hostname: 'dmgmori.com',
          port: 123,
          machineName: '',
          expectedResult: 'http://dmgmori.com:123'
        },
        {
          hostname: 'dmgmori.com',
          port: 123,
          machineName: 'machine1',
          expectedResult: 'http://dmgmori.com:123/machine1'
        },
        {
          hostname: 'https://dmgmori.com',
          port: 123,
          machineName: 'machine1',
          expectedResult: 'https://dmgmori.com:123/machine1'
        }
      ])(
        'Instantiation with $hostname:$port and machineName:$machineName is successful',
        async ({ hostname, port, machineName, expectedResult }) => {
          mtconnectDataSource = new MTConnectDataSource({
            ...mockConfig,
            config: {
              ...mockConfig.config,
              machineName,
              //@ts-ignore
              connection: { hostname, port }
            }
          });

          //@ts-ignore
          expect(mtconnectDataSource.hostname).toBe(expectedResult);
        }
      );
    });
  });

  describe('Initialization', () => {
    describe('Tests host connectivity at init', () => {
      it('Reachable host', async () => {
        mtconnectDataSource = new MTConnectDataSource(mockConfig);
        //@ts-ignore
        mtconnectDataSource.getAndProcessCurrentResponse = jest.fn();
        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(new Response(JSON.stringify({})))
        );
        await mtconnectDataSource.init();
        //@ts-ignore
        expect(mtconnectDataSource.hostConnectivityState).toBe(
          IHostConnectivityState.OK
        );
        expect(
          //@ts-ignore
          mtconnectDataSource.getAndProcessCurrentResponse
        ).toHaveBeenCalled();
      });
      it('Unreachable host', async () => {
        mtconnectDataSource = new MTConnectDataSource(mockConfig);
        //@ts-ignore
        mtconnectDataSource.getAndProcessCurrentResponse = jest.fn();
        jest.useFakeTimers();
        mockedFetch.mockResolvedValueOnce(Promise.reject(new Response()));
        await mtconnectDataSource.init();
        jest.runAllTimers();

        //@ts-ignore
        expect(mtconnectDataSource.hostConnectivityState).toBe(
          IHostConnectivityState.ERROR
        );
        expect(
          //@ts-ignore
          mtconnectDataSource.getAndProcessCurrentResponse
        ).not.toHaveBeenCalled();
      });
    });
  });

  describe('Reading streams', () => {
    let mockEmitMeasurement = jest.fn();

    describe('Reading sequence numbers', () => {
      it('ready sequence numbers from /current response', async () => {
        mtconnectDataSource = new MTConnectDataSource(mockConfig);

        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(new Response(mockCurrentResponse))
        );
        //@ts-ignore
        await mtconnectDataSource.getAndProcessCurrentResponse();
        //@ts-ignore
        expect(mtconnectDataSource.nextSequenceNumber).toBe(9558169);
        //@ts-ignore
        expect(mtconnectDataSource.lastSequenceNumber).toBe(9558168);
        //@ts-ignore
        expect(mtconnectDataSource.requestCount).toBe(1);
      });

      it('updates count number correctly', async () => {
        mtconnectDataSource = new MTConnectDataSource(mockConfig);
        //@ts-ignore
        mtconnectDataSource.onDataPointMeasurement = mockEmitMeasurement;

        mockedFetch.mockResolvedValueOnce(
          // make last sequence ahead by 200
          Promise.resolve(
            new Response(mockCurrentResponse.replace('9558168', '9558368'))
          )
        );
        //@ts-ignore
        await mtconnectDataSource.getAndProcessCurrentResponse();
        //@ts-ignore
        expect(mtconnectDataSource.nextSequenceNumber).toBe(9558169);
        //@ts-ignore
        expect(mtconnectDataSource.lastSequenceNumber).toBe(9558368);
        //@ts-ignore
        expect(mtconnectDataSource.requestCount).toBe(9558368 - 9558169);
      });

      it('reads sequence numbers from /sample response', async () => {
        mtconnectDataSource = new MTConnectDataSource(mockConfig);

        mockedFetch
          .mockResolvedValueOnce(
            Promise.resolve(new Response(mockCurrentResponse))
          )
          .mockResolvedValueOnce(
            Promise.resolve(new Response(mockSampleResponse))
          );
        //First current response is read to get sequence numbers
        //@ts-ignore
        await mtconnectDataSource.getAndProcessCurrentResponse();
        //@ts-ignore
        await mtconnectDataSource.getAndProcessSampleResponse();
        //@ts-ignore
        expect(mtconnectDataSource.nextSequenceNumber).toBe(9558200);
        //@ts-ignore
        expect(mtconnectDataSource.lastSequenceNumber).toBe(9558199);
        //@ts-ignore
        expect(mtconnectDataSource.requestCount).toBe(1);
      });

      it('handles when sequence number is too behind', async () => {
        mtconnectDataSource = new MTConnectDataSource(mockConfig);

        mockedFetch
          .mockResolvedValueOnce(
            Promise.resolve(new Response(mockCurrentResponse))
          )
          .mockResolvedValueOnce(
            Promise.resolve(new Response(mockFailTooBehind))
          );
        //First current response is read to get sequence numbers
        //@ts-ignore
        await mtconnectDataSource.getAndProcessCurrentResponse();
        //@ts-ignore
        await mtconnectDataSource.getAndProcessSampleResponse();
        //@ts-ignore
        expect(mtconnectDataSource.nextSequenceNumber).toBe(9554240); // Next sequence is updated to the given number in error response
        //@ts-ignore
        expect(mtconnectDataSource.lastSequenceNumber).toBe(9558168); //Last sequence is still the same from /current response
        //@ts-ignore
        expect(mtconnectDataSource.requestCount).toBe(1);
      });

      it('handles when sequence number is too behind', async () => {
        mtconnectDataSource = new MTConnectDataSource(mockConfig);

        mockedFetch
          .mockResolvedValueOnce(
            Promise.resolve(new Response(mockCurrentResponse))
          )
          .mockResolvedValueOnce(
            Promise.resolve(new Response(mockFailTooAhead))
          );
        //First current response is read to get sequence numbers
        //@ts-ignore
        await mtconnectDataSource.getAndProcessCurrentResponse();
        //@ts-ignore
        await mtconnectDataSource.getAndProcessSampleResponse();
        //@ts-ignore
        expect(mtconnectDataSource.nextSequenceNumber).toBe(9558341); // Next sequence is updated to the given number in error response
        //@ts-ignore
        expect(mtconnectDataSource.lastSequenceNumber).toBe(9558168); //Last sequence is still the same from /current response
        //@ts-ignore
        expect(mtconnectDataSource.requestCount).toBe(1);
      });
    });

    describe('Reading /current stream', () => {
      it('no event emitted if there are no data points in config', async () => {
        mtconnectDataSource = new MTConnectDataSource(mockConfig);
        //@ts-ignore
        mtconnectDataSource.onDataPointMeasurement = mockEmitMeasurement;

        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(new Response(mockCurrentResponse))
        );
        //@ts-ignore
        await mtconnectDataSource.getAndProcessCurrentResponse();

        expect(mockEmitMeasurement).not.toHaveBeenCalled();
      });
      it('emits events for set data points', async () => {
        mtconnectDataSource = new MTConnectDataSource({
          ...mockConfig,
          config: {
            ...mockConfig.config,
            dataPoints: [
              {
                address: 'agent_avail',
                id: 'test',
                name: 'test',
                type: 'event'
              },
              {
                address: '_c62b3518e4_asset_update_rate',
                id: 'test',
                name: 'test',
                type: 'sample'
              }
            ]
          }
        });
        //@ts-ignore
        mtconnectDataSource.onDataPointMeasurement = mockEmitMeasurement;

        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(new Response(mockCurrentResponse))
        );
        //@ts-ignore
        await mtconnectDataSource.getAndProcessCurrentResponse();
        //due to only 2 datapoint requested, only 2 events are emitted
        expect(mockEmitMeasurement).toHaveBeenCalledTimes(2);
      });
      it('handles events with Entry', async () => {
        mtconnectDataSource = new MTConnectDataSource({
          ...mockConfig,
          config: {
            ...mockConfig.config,
            dataPoints: [
              {
                address: 'maintcheck',
                id: 'maintcheck',
                name: 'test',
                type: 'event'
              },
              {
                address: 'cvars',
                id: 'cvars',
                name: 'test',
                type: 'sample'
              }
            ]
          }
        });
        //@ts-ignore
        mtconnectDataSource.onDataPointMeasurement = mockEmitMeasurement;

        mockedFetch.mockResolvedValueOnce(
          Promise.resolve(new Response(mockCurrentResponse))
        );
        //@ts-ignore
        await mtconnectDataSource.getAndProcessCurrentResponse();

        //due to only 2 datapoint requested, only 2 events are emitted
        expect(mockEmitMeasurement).toHaveBeenCalledTimes(2);
        expect(mockEmitMeasurement).nthCalledWith(
          1,
          expect.arrayContaining([
            expect.objectContaining({
              id: 'maintcheck',
              entries: expect.objectContaining({
                'DAILY-1': expect.objectContaining({
                  NAME: 'Checking the slideway lubricant'
                })
              })
            })
          ])
        );
        expect(mockEmitMeasurement).nthCalledWith(
          2,
          expect.arrayContaining([
            expect.objectContaining({
              id: 'cvars',
              entries: expect.objectContaining({ 101: '0.860050000000001' })
            })
          ])
        );
      });
    });
    describe('Reading /sample stream', () => {
      it('emits multiple events for a data point', async () => {
        mtconnectDataSource = new MTConnectDataSource({
          ...mockConfig,
          config: {
            ...mockConfig.config,
            dataPoints: [
              {
                address: '_c62b3518e4_asset_update_rate',
                id: 'test',
                name: 'test',
                type: 'event'
              }
            ]
          }
        });
        //@ts-ignore
        mtconnectDataSource.onDataPointMeasurement = mockEmitMeasurement;

        mockedFetch
          .mockResolvedValueOnce(
            Promise.resolve(new Response(mockCurrentResponse))
          )
          .mockResolvedValueOnce(
            Promise.resolve(new Response(mockSampleResponse))
          );
        //@ts-ignore
        await mtconnectDataSource.getAndProcessCurrentResponse();
        //@ts-ignore
        await mtconnectDataSource.getAndProcessSampleResponse();

        // _c62b3518e4_asset_update_rate data point is once read at /current endpoint and then 14 events are from /sample endpoint
        expect(mockEmitMeasurement).toHaveBeenCalledTimes(15);
      });
    });
  });
});
