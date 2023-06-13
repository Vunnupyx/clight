import {
  IDataSinkConfig,
  IDataSourceConfig
} from '../../ConfigManager/interfaces';
import { DataPointMapper } from '..';
import { ConfigManager } from '../../ConfigManager';
import emptyDefaultConfig from '../../../../_mdclight/runtime-files/templates/empty.json';
import { EventBus } from '../../EventBus';
import {
  DataSinkProtocols,
  DataSourceProtocols
} from '../../../common/interfaces';

jest.mock('fs', () => {
  return {
    promises: {
      writeFile: jest.fn().mockImplementation(() => Promise.resolve())
    }
  };
});
jest.mock('winston');
jest.mock('../../EventBus');
jest.mock('../../ConfigManager');

describe('Test DataPointMapper', () => {
  test("should map a source to it's target", async () => {
    const config = new ConfigManager({
      errorEventsBus: new EventBus(),
      lifecycleEventsBus: new EventBus()
    });

    const dataSource: IDataSourceConfig = {
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
        }
      ]
    };
    const dataSink: IDataSinkConfig = {
      protocol: DataSinkProtocols.DATAHUB,
      enabled: true,
      dataPoints: [
        { id: 'target1', name: '', type: 'event', map: {}, address: '' }
      ]
    };
    config.config = {
      ...emptyDefaultConfig,
      dataSources: [dataSource],
      dataSinks: [dataSink],
      mapping: [
        {
          id: '',
          source: 'source1',
          target: 'target1'
        }
      ]
    } as any;

    const mapper = new DataPointMapper(config.config.mapping);
    config.emit('configsLoaded');
    const mapping = mapper.getTargets(dataSource.dataPoints[0].id);

    expect(
      mapping.find((mapping) => mapping === config.config.mapping[0])
    ).toBeTruthy();
  });
});
