import { DataPointMapper } from '..';
import { ConfigManager, emptyDefaultConfig } from '../../ConfigManager';
import {
  IConfig,
  IDataSinkConfig,
  IDataSourceConfig
} from '../../ConfigManager/interfaces';
import { EventBus } from '../../EventBus';

jest.mock('fs');

describe('Test DataPointMapper', () => {
  test("should map a source to it's target", async () => {
    const config = new ConfigManager({
      errorEventsBus: new EventBus<null>(),
      lifecycleEventsBus: new EventBus<null>()
    });

    const dataSource: IDataSourceConfig = {
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
        }
      ]
    };
    const dataSink: IDataSinkConfig = {
      name: '',
      protocol: '',
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
    };

    const mapper = new DataPointMapper(config);
    const mapping = mapper.getTargets(dataSource.dataPoints[0].id);

    expect(
      mapping.find((mapping) => mapping === config.config.mapping[0])
    ).toBeTruthy();
  });
});
