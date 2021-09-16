export enum DataPointType {
    PLC = 's7',
    NCK = 'nck',
}

export class DataPoint {
    address: string;
    description?: string;
    id: string;
    name: string;
    readFrequency: number;
    type?: DataPointType;
}