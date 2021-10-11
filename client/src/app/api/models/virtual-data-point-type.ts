/* tslint:disable */
export interface VirtualDataPointType {
  operationType: 'and' | 'or' | 'not' | 'counter]';
  sources: Array<string>;
}
