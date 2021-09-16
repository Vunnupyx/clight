import { DataPoint } from "./data-point";

export enum DataSourceProtocol {
    S7 = 's7nck',
    IOShield = 'ioshield',
}


export class Connection {
    ipAddr?: string;
    port?: number;
    rack?: number;
    slot?: number;
}

export class DataSource {
    connection?: Connection;
    dataPoints?: DataPoint[];
    enabled?: boolean;
    id?: string;
    name?: string;
    protocol?: DataSourceProtocol;
}