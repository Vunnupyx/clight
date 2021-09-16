import * as api from "app/api/models";
import { DATA_POINTS_MOCK } from "./data-point.service.mock";

export const DATA_SOURCES_MOCK = () => (<api.DataSourceList>{
    dataSources: [
        <api.DataSourceType>{
            connection: <api.Connection>{
                ipAddr: '192.168.214.1',
                port: 102,
                rack: 0,
                slot: 2,
            },
            dataPoints: DATA_POINTS_MOCK(),
            enabled: true,
            id: 'id1',
            name: 'name1',
            protocol: 's7nck',
        },
        <api.DataSourceType>{
            dataPoints: DATA_POINTS_MOCK(),
            enabled: true,
            id: 'id1',
            name: 'name1',
            protocol: 'ioshield',
        },
    ]
});