export enum DataPointType {
    Event = 'event',
    Condition = 'condition',
}

export class DataPoint {
    enabled: boolean;
    id?: string;
    initValue: number;
    map: string[];
    name: string;
    type: DataPointType;
}