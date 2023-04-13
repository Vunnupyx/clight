import { DataPoint, DataPointType } from '../models';

export const DATA_POINTS_MOCK = (datasinkId) => [
  <DataPoint>{
    id: `id${datasinkId}1`,
    name: `name${datasinkId}1`,
    type: DataPointType.Event,
    map: { 0: 'A', 1: 'B', 2: 'C' },
    initialValue: '1',
    enabled: true
  },
  <DataPoint>{
    id: `id${datasinkId}2`,
    name: `name${datasinkId}2`,
    type: DataPointType.Event,
    map: { 0: 'Q', 1: 'W', 2: 'E' },
    initialValue: '2',
    enabled: true
  },
  <DataPoint>{
    id: `id${datasinkId}3`,
    name: `name${datasinkId}3`,
    type: DataPointType.Condition,
    map: { 0: 'X', 1: 'Y', 2: 'Z' },
    initialValue: '3',
    enabled: true
  }
];
