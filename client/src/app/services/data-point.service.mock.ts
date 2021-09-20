import * as api from "app/api/models";

export const DATA_POINTS_MOCK = datasinkId => ([
    <api.DataPointType>{
        id: `id${datasinkId}1`,
        name: `name${datasinkId}1`,
        type: 'event',
        map: ['A', 'B', 'C'],
        initValue: 1,
        enabled: true,
    },
    <api.DataPointType>{
        id: `id${datasinkId}2`,
        name: `name${datasinkId}2`,
        type: 'event',
        map: ['A', 'B', 'C'],
        initValue: 2,
        enabled: true,
    },
    <api.DataPointType>{
        id: `id${datasinkId}3`,
        name: `name${datasinkId}3`,
        type: 'condition' as any,
        map: ['A', 'B', 'C'],
        initValue: 3,
        enabled: true,
    },
]);