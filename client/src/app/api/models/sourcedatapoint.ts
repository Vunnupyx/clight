/* tslint:disable */
export interface Sourcedatapoint {
  address: string;
  description?: string;
  id: string;
  name: string;
  readFrequency: number;
  type?: 's7' | 'nck';
}
