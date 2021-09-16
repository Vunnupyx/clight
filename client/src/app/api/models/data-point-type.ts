/* tslint:disable */
export interface DataPointType {
  enabled?: boolean;
  id?: string;

  /**
   * index af map for the init value
   */
  initValue?: number;
  map?: Array<string>;
  name?: string;
  type?: 'event';
}
