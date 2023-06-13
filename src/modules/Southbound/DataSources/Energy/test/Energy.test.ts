import { EnergyDataSource } from '..';
import { IHostConnectivityState, ITariffNumbers } from '../interfaces';
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
const mockChangeTariffFn = jest.fn((tariffNo: ITariffNumbers) =>
  Promise.resolve(tariffNo)
);
jest.mock('../Adapter/PhoenixEmProAdapter', () => {
  return {
    PhoenixEmProAdapter: jest.fn().mockImplementation(() => ({
      isReady: true,
      changeTariff: mockChangeTariffFn,
      testHostConnectivity: jest.fn(),
      hostConnectivityState: IHostConnectivityState.OK
    }))
  };
});

let energyDataSource: EnergyDataSource;
const mockConfig: IDataSourceParams = {
  config: {
    protocol: DataSourceProtocols.ENERGY,
    dataPoints: [],
    type: 'PhoenixEMpro',
    enabled: true
  },
  termsAndConditionsAccepted: true
};
const virtualDpManager = jest.createMockFromModule(
  '../../../../VirtualDataPointManager'
) as VirtualDataPointManager;

let vdpEnergyCallback: Function;

describe('EnergyDataSource', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    energyDataSource = new EnergyDataSource(mockConfig, virtualDpManager);
    virtualDpManager.setEnergyCallback = (cb) => {
      vdpEnergyCallback = cb;
    };
    await energyDataSource.init();
  });
  describe('handleMachineStatusChange', () => {
    it.each([
      { newStatus: 'STANDBY', expectedTariffNo: '1' },
      { newStatus: 'READY_FOR_PROCESSING', expectedTariffNo: '2' },
      { newStatus: 'WARM_UP', expectedTariffNo: '3' },
      { newStatus: 'PROCESSING', expectedTariffNo: '4' },
      { newStatus: 'unknown', expectedTariffNo: '0' },
      { newStatus: '', expectedTariffNo: '0' },
      { newStatus: 'wrong', expectedTariffNo: '0' },
      { newStatus: undefined, expectedTariffNo: '0' },
      { newStatus: null, expectedTariffNo: '0' }
    ])(
      'Machine status change to $newStatus triggers tariff update to:$expectedTariffNo',
      async ({ newStatus, expectedTariffNo }) => {
        await vdpEnergyCallback(newStatus);
        expect(mockChangeTariffFn).toHaveBeenCalledWith(expectedTariffNo);
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
        //@ts-ignore
        await energyDataSource.handleMachineStatusChange('running');
      } catch (e) {
        expect((e as Error).message).toBe('reason');
      }
    });
  });
});
