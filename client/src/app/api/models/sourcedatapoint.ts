/* tslint:disable */
export interface Sourcedatapoint {
  address: string;
  description?: string;
  name: string;
  readFrequency?: number;
  type?:
    | 's7'
    | 'nck'
    | 'measurement'
    | 'meter'
    | 'device'
    | 'event'
    | 'sample'
    | 'condition';
}
