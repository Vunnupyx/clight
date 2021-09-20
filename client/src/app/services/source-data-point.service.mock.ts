import * as api from "app/api/models";

export const SOURCE_DATA_POINTS_MOCK = datasourceId => ([
    <api.Sourcedatapoint>{
        id: `id${datasourceId}1`,
        name: `name${datasourceId}1`,
        description: `desc ${datasourceId}1`,
        type: 's7',
        address: `address${datasourceId}1`,
        readFrequency: 1, 
    },
    <api.Sourcedatapoint>{
        id: `id${datasourceId}2`,
        name: `name${datasourceId}2`,
        description: `desc ${datasourceId}2`,
        type: 's7',
        address: `address${datasourceId}2`,
        readFrequency: 1, 
    },
    <api.Sourcedatapoint>{
        id: `id${datasourceId}3`,
        name: `name${datasourceId}3`,
        description: `desc ${datasourceId}3`,
        type: 'nck',
        address: `address${datasourceId}3`,
        readFrequency: 1, 
    },
]);