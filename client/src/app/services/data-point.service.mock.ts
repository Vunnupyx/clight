import * as api from "app/api/models";

export const DATA_POINTS_MOCK = () => ([
    <api.Sourcedatapoint>{
        id: 'id01',
        name: 'name01',
        description: 'desc 01',
        type: 's7',
        address: 'address1',
        readFrequency: 1, 
    },
    <api.Sourcedatapoint>{
        id: 'id02',
        name: 'name02',
        description: 'desc 02',
        type: 's7',
        address: 'address2',
        readFrequency: 2, 
    },
    <api.Sourcedatapoint>{
        id: 'id03',
        name: 'name03',
        description: 'desc 03',
        type: 'nck',
        address: 'address3',
        readFrequency: 3,
    },
]);