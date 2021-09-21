import { SourceDataPoint } from "./source-data-point";

export enum DataSourceProtocol {
    S7 = 's7',
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
    dataPoints?: SourceDataPoint[];
    enabled?: boolean;
    id?: string;
    name?: string;
    protocol?: DataSourceProtocol;
}
