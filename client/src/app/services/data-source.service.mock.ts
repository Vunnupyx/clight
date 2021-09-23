import * as api from 'app/api/models';
import { SOURCE_DATA_POINTS_MOCK } from './source-data-point.service.mock';

export const DATA_SOURCES_MOCK = () =>
  <api.DataSourceList>{
    dataSources: [
      <api.DataSourceType>{
        connection: <api.Connection>{
          ipAddr: '192.168.214.1',
          port: 102,
          rack: 0,
          slot: 2
        },
        dataPoints: SOURCE_DATA_POINTS_MOCK('id1'),
        enabled: true,
        id: 'id1',
        name: 'Sinumerik 840D sl',
        protocol: 's7nck'
      },
      <api.DataSourceType>{
        dataPoints: SOURCE_DATA_POINTS_MOCK('id2'),
        enabled: true,
        id: 'id2',
        name: 'Digital Inputs',
        protocol: 'ioshield'
      }
    ]
  };
