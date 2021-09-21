import * as api from "app/api/models";
import { DATA_POINTS_MOCK } from "./data-point.service.mock";

export const DATA_SINKS_MOCK = () => ([
    <api.DataSinkType>{
        id: 'MTConnect',
        name: 'MTConnect',
        datapoints: DATA_POINTS_MOCK('MTConnect'),
        enabled: true,
        protocol: 'MTConnect',
    },
    <api.DataSinkType>{
        id: 'OPC',
        name: 'OPC UA',
        datapoints: DATA_POINTS_MOCK('OPC'),
        enabled: true,
        protocol: 'OPC UA',
    },
    <api.DataSinkType>{
        id: 'Data Hub',
        name: 'Data Hub',
        datapoints: DATA_POINTS_MOCK('Data Hub'),
        enabled: true,
        protocol: 'Data Hub',
    },
]);