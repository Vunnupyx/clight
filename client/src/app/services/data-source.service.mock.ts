import * as api from "app/api/models";
import { DATA_POINTS_MOCK } from "./data-point.service.mock";

export const DATA_SOURCES_MOCK = () => (<api.DataSourceList>{
    dataSources: [
        <api.DataSourceType>{
            connection: <api.Connection>{
                ipAddr: '10.10.4.1',
                port: 5600,
                rack: 1,
                slot: 1
            },
            dataPoints: DATA_POINTS_MOCK(),
            enabled: true,
            id: 'id1',
            name: 'name1',
            protocol: 'p_s7',
        },
    ]
});