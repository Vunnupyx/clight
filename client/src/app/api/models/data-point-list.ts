/* tslint:disable */
import { DataPointType } from './data-point-type';
import { Uuid } from './uuid';
export interface DataPointList {
  dataPoints?: Array<DataPointType & Uuid>;
}
