export class DataPoint {
    address: string;
    description?: string;
    id: string;
    name: string;
    readFrequency: number;
    type?: 's7' | 'nck';
}