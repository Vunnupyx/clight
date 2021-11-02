import {DataSourceProtocol} from './data-source';
import {DataSinkProtocol} from './data-sink';

export type AvailableDataSource = DataSourceProtocol;

export type AvailableDataSink = DataSinkProtocol

export class TemplatesStatus {
  completed!: boolean;
}
