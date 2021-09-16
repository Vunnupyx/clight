/* tslint:disable */
import { Connection } from './connection';
import { Sourcedatapoint } from './sourcedatapoint';
export interface DataSourceType {
  connection?: Connection;
  dataPoints?: Array<Sourcedatapoint>;
  enabled?: boolean;
  id?: string;
  name?: string;
  protocol?: string;
}
