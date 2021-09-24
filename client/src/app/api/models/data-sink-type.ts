/* tslint:disable */
import { Uuid } from './uuid';
import { DataPointType } from './data-point-type';
export interface DataSinkType {
  datapoints?: Array<Uuid & DataPointType>;
  enabled?: boolean;
  name?: string;
}
