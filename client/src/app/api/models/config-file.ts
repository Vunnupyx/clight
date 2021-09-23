/* tslint:disable */
import { DataPointType } from './data-point-type';
import { DataSinkType } from './data-sink-type';
import { DataSourceType } from './data-source-type';
import { Mapping } from './mapping';
import { VirtualDataPointType } from './virtual-data-point-type';
export interface ConfigFile {
  dataPoints: Array<DataPointType>;
  dataSinks: Array<DataSinkType>;
  dataSources: Array<DataSourceType>;
  mapping: Mapping;
  virtualDataPoints: Array<VirtualDataPointType>;
}
