import { PhoenixEmProAdapter } from '../Adapter/PhoenixEmProAdapter';
import fetch from 'node-fetch';
import {
  IEmProBulkReadingResponse,
  IEmProReadingResponse
} from '../interfaces';
import { IMeasurement } from '../../interfaces';

jest.mock('winston');

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');
let mockedFetch = fetch as jest.MockedFunction<typeof fetch>;
let emProClient: PhoenixEmProAdapter;

const connection = {
  ipAddr: '1.1.1.1'
};
describe('PhoenixEmProAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    emProClient = new PhoenixEmProAdapter(connection);
  });
  it('initializes correctly', () => {
    expect(emProClient.currentTariff).toBe('0');
    //@ts-ignore  Checking hostname setting
    expect(emProClient.hostname).toBe(connection.ipAddr);
  });

  describe('getAllDatapoints', () => {
    it('reads measurement and meters data points correctly', async () => {
      let mockMeasurements = [
        {
          id: 'id',
          name: 'measurement1',
          value: 14,
          unit: 'W',
          description: ''
        }
      ];
      let mockMeters = [
        {
          id: 'id',
          name: 'meter1',
          value: 20,
          unit: 'W',
          description: ''
        }
      ];
      const mockMeasurementResponse: IEmProBulkReadingResponse = {
        context: 'context',
        timestamp: Date.now().toString(),
        items: mockMeasurements.map((x) => ({ ...x, href: '' }))
      };
      const mockMeterResponse: IEmProBulkReadingResponse = {
        context: 'context',
        timestamp: Date.now().toString(),
        items: mockMeters.map((x) => ({ ...x, href: '' }))
      };
      mockedFetch
        .mockResolvedValueOnce(
          Promise.resolve(new Response(JSON.stringify(mockMeasurementResponse)))
        )
        .mockResolvedValueOnce(
          Promise.resolve(new Response(JSON.stringify(mockMeterResponse)))
        );

      let result: IMeasurement[] = await emProClient.getAllDatapoints();
      expect(mockedFetch).toHaveBeenNthCalledWith(
        1,
        `${connection.ipAddr}${'/api/v1/measurements'}`,
        {
          method: 'GET'
        }
      );
      expect(mockedFetch).toHaveBeenNthCalledWith(
        2,
        `${connection.ipAddr}${'/api/v1/meters'}`,
        {
          method: 'GET'
        }
      );
      expect(result).toStrictEqual([...mockMeasurements, ...mockMeters]);
    });

    it('reads measurement even if meters could not be read', async () => {
      let mockMeasurements = [
        {
          id: 'id',
          name: 'measurement1',
          value: 14,
          unit: 'W',
          description: ''
        }
      ];
      const mockMeasurementResponse: IEmProBulkReadingResponse = {
        context: 'context',
        timestamp: Date.now().toString(),
        items: mockMeasurements.map((x) => ({ ...x, href: '' }))
      };

      mockedFetch
        .mockResolvedValueOnce(
          Promise.resolve(new Response(JSON.stringify(mockMeasurementResponse)))
        )
        .mockResolvedValueOnce(Promise.reject(new Response()));

      let result: IMeasurement[] = await emProClient.getAllDatapoints();
      expect(result).toStrictEqual([...mockMeasurements]);
    });

    it('reads meters even if measurements could not be read', async () => {
      let mockMeters = [
        {
          id: 'id',
          name: 'meter1',
          value: 20,
          unit: 'W',
          description: ''
        }
      ];

      const mockMeterResponse: IEmProBulkReadingResponse = {
        context: 'context',
        timestamp: Date.now().toString(),
        items: mockMeters.map((x) => ({ ...x, href: '' }))
      };
      mockedFetch
        .mockResolvedValueOnce(Promise.reject(new Response()))
        .mockResolvedValueOnce(
          Promise.resolve(new Response(JSON.stringify(mockMeterResponse)))
        );

      let result: IMeasurement[] = await emProClient.getAllDatapoints();
      expect(result).toStrictEqual([...mockMeters]);
    });

    it('reads meters even if measurements could not be read', async () => {
      mockedFetch
        .mockResolvedValueOnce(Promise.reject(new Response()))
        .mockResolvedValueOnce(Promise.reject(new Response()));

      try {
        await emProClient.getAllDatapoints();
      } catch (e) {
        expect(e.message).toBe('Could not read any values');
      }
    });
  });

  describe('getSingleDataPoint', () => {
    it('reads single data point correctly', async () => {
      let mockMeasurement = {
        id: 'p3',
        name: 'P3',
        value: 14,
        unit: 'W',
        description: 'Active power'
      };
      const mockMeasurementResponse: IEmProReadingResponse = {
        context: '/api/v1/measurements/p3?',
        timestamp: Date.now().toString(),
        ...mockMeasurement
      };

      mockedFetch.mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify(mockMeasurementResponse)))
      );

      let result: IMeasurement = await emProClient.getSingleDataPoint('p3');
      expect(mockedFetch).toHaveBeenCalledWith(
        `${connection.ipAddr}${mockMeasurementResponse.context.replace(
          '?',
          ''
        )}`,
        { method: 'GET' }
      );
      expect(result).toStrictEqual(mockMeasurement);
    });

    it('handles error reading single data point', async () => {
      mockedFetch.mockResolvedValueOnce(Promise.reject(new Error('reason')));

      try {
        let result: IMeasurement = await emProClient.getSingleDataPoint('p3');
      } catch (e) {
        expect(mockedFetch).toHaveBeenCalledWith(
          `${connection.ipAddr}${'/api/v1/measurements/p3'}`,
          { method: 'GET' }
        );
        expect(e.message).toBe('reason');
      }
    });
  });

  describe('getCurrentTariff', () => {
    it('gets current tariff number correctly', async () => {
      let mockTariffResponse = {
        id: 'tariff-number',
        name: 'Tariff number',
        value: 2,
        unit: '',
        description: ''
      };
      const mockMeasurementResponse: IEmProReadingResponse = {
        context: '/api/v1/measurement-system-control/tariff-number?',
        timestamp: Date.now().toString(),
        ...mockTariffResponse
      };

      mockedFetch.mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify(mockMeasurementResponse)))
      );

      let result: string = await emProClient.getCurrentTariff();
      expect(mockedFetch).toHaveBeenCalledWith(
        `${connection.ipAddr}${mockMeasurementResponse.context.replace(
          '?',
          ''
        )}`,
        { method: 'GET' }
      );
      expect(result).toStrictEqual(String(mockTariffResponse.value));
    });
    it('non-number value is returned as 0', async () => {
      let mockTariffResponse = {
        id: 'tariff-number',
        name: 'Tariff number',
        value: undefined as any,
        unit: '',
        description: ''
      };
      const mockMeasurementResponse: IEmProReadingResponse = {
        context: '/api/v1/measurement-system-control/tariff-number?',
        timestamp: Date.now().toString(),
        ...mockTariffResponse
      };

      mockedFetch.mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify(mockMeasurementResponse)))
      );

      let result: string = await emProClient.getCurrentTariff();
      expect(mockedFetch).toHaveBeenCalledWith(
        `${connection.ipAddr}${mockMeasurementResponse.context.replace(
          '?',
          ''
        )}`,
        { method: 'GET' }
      );
      expect(result).toStrictEqual('0');
    });

    it('handles error getting tariff number', async () => {
      mockedFetch.mockResolvedValueOnce(Promise.reject(new Error('reason')));

      try {
        await emProClient.getCurrentTariff();
      } catch (e) {
        expect(mockedFetch).toHaveBeenCalledWith(
          `${
            connection.ipAddr
          }${'/api/v1/measurement-system-control/tariff-number'}`,
          { method: 'GET' }
        );
        expect(e.message).toBe('reason');
      }
    });
  });

  describe('changeTariff', () => {
    it('changes current tariff number correctly', async () => {
      const mockedResponse = {
        code: 200,
        context: '/api/v1/measurement-system-control/tariff-number?value=3',
        message: 'OK'
      };
      mockedFetch.mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify(mockedResponse)))
      );

      let result: boolean = await emProClient.changeTariff(3);
      expect(mockedFetch).toHaveBeenCalledWith(
        `${connection.ipAddr}${mockedResponse.context}`,
        { method: 'PUT' }
      );
      expect(result).toBeTruthy();
    });

    it.each([
      { tariff: undefined },
      { tariff: null },
      { tariff: '-' },
      { tariff: 'status' },
      { tariff: 'undefined' },
      { tariff: '5' },
      { tariff: () => {} }
    ])('rejects wrong tariff number: $tariff', async ({ tariff }) => {
      try {
        await emProClient.changeTariff(tariff as any);
      } catch (e) {
        expect(mockedFetch).not.toHaveBeenCalled();
        expect(e.message).toBe('Wrong tariff number');
      }
    });

    it('handles different response code changing tariff number', async () => {
      const mockedResponse = {
        code: 400,
        context: '/api/v1/measurement-system-control/tariff-number?value=4',
        error: 'errMessage'
      };
      mockedFetch.mockResolvedValueOnce(
        Promise.resolve(new Response(JSON.stringify(mockedResponse)))
      );
      try {
        await emProClient.changeTariff(4);
      } catch (e) {
        expect(mockedFetch).toHaveBeenCalledWith(
          `${connection.ipAddr}${mockedResponse.context}`,
          { method: 'PUT' }
        );
        expect(e.message).toBe('errMessage');
      }
    });

    it('handles error changing tariff number', async () => {
      mockedFetch.mockResolvedValueOnce(Promise.reject(new Error('reason')));

      try {
        await emProClient.changeTariff(4);
      } catch (e) {
        expect(mockedFetch).toHaveBeenCalledWith(
          `${
            connection.ipAddr
          }${'/api/v1/measurement-system-control/tariff-number?value=4'}`,
          { method: 'PUT' }
        );
        expect(e.message).toBe('reason');
      }
    });
  });
});
