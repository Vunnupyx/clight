/* tslint:disable */
import { DataPointType } from './data-point-type';
export interface DataSinkType {
  datapoints?: Array<DataPointType>;
  enabled?: boolean;
  id?: string;
  name?: string;
}
