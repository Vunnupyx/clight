/* tslint:disable */
import { Connection } from './connection';
import { Sourcedatapoint } from './sourcedatapoint';
import { Uuid } from './uuid';
export interface DataSourceType {
  connection?: Connection;
  dataPoints?: Array<Sourcedatapoint & Uuid>;
  enabled?: boolean;
  machineName?: string;
  protocol?: string;
}
