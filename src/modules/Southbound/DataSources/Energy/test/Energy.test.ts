import { EnergyDataSource } from '..';
import fetch from 'node-fetch';
import { TariffNumbers } from '../interfaces';
import { IDataSourceParams } from '../../interfaces';
import { DataSourceProtocols } from '../../../../../common/interfaces';
import { VirtualDataPointManager } from '../../../../VirtualDataPointManager';

jest.mock('winston');
jest.mock('node-fetch');

const mockSyncSchedulerInstance = {
  addListener: jest.fn()
};
jest.mock('../../../../SyncScheduler', () => ({
  SynchronousIntervalScheduler: {
    getInstance: () => mockSyncSchedulerInstance
  }
}));
jest.mock('../Adapter/PhoenixEmProAdapter', () => {
  return {
    PhoenixEmProAdapter: jest.fn().mockImplementation(() => ({
      changeTariff: jest.fn((tariffNo: TariffNumbers) =>
        Promise.resolve(tariffNo)
      )
    }))
  };
});

const { Response } = jest.requireActual('node-fetch');
let mockedFetch = fetch as jest.MockedFunction<typeof fetch>;
let energyDataSource: EnergyDataSource;
const mockConfig: IDataSourceParams = {
  config: {
    protocol: DataSourceProtocols.ENERGY,
    dataPoints: [],
    enabled: true
  },
  termsAndConditionsAccepted: true
};
const virtualDpManager = jest.createMockFromModule(
  '../../../../VirtualDataPointManager'
) as VirtualDataPointManager;

let vdpEnergyCallback;

describe('EnergyDataSource', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    energyDataSource = new EnergyDataSource(mockConfig, virtualDpManager);
    virtualDpManager.setEnergyCallback = (cb) => {
      vdpEnergyCallback = cb;
    };
    energyDataSource.init();
  });
  describe('handleMachineStatusChange', () => {
    it.each([
      { newStatus: 'running', expectedTariffNo: '1' },
      { newStatus: 'idle', expectedTariffNo: '2' },
      { newStatus: 'waiting', expectedTariffNo: '3' },
      { newStatus: 'alarm', expectedTariffNo: '4' },
      { newStatus: '', expectedTariffNo: '0' },
      { newStatus: 'wrong', expectedTariffNo: '0' },
      { newStatus: undefined, expectedTariffNo: '0' },
      { newStatus: null, expectedTariffNo: '0' }
    ])(
      'Machine status change to $newStatus triggers tariff update to:$expectedTariffNo',
      async ({ newStatus, expectedTariffNo }) => {
        let result: TariffNumbers = await vdpEnergyCallback(newStatus);
        expect(result).toBe(expectedTariffNo);
      }
    );

    it('handles error while changing tariff', async () => {
      jest.mock('../Adapter/PhoenixEmProAdapter', () => {
        return {
          PhoenixEmProAdapter: jest.fn().mockImplementationOnce(() => ({
            changeTariff: jest.fn(() => Promise.reject(new Error('reason')))
          }))
        };
      });
      try {
        await energyDataSource.handleMachineStatusChange('running');
      } catch (e) {
        expect(e.message).toBe('reason');
      }
    });
  });
});