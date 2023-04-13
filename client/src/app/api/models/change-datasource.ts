/* tslint:disable */
import { Connection } from './connection';

/**
 * JSON type for change enable state or connection
 */
export interface ChangeDatasource {
  connection?: Connection;
  enabled?: boolean;
}
