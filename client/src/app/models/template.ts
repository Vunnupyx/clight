import { DataSourceProtocol } from './data-source';
import { DataSinkProtocol } from './data-sink';

export interface ITemplate {
  id: string;
  name: string;
  description: string;
  dataSources: DataSourceProtocol[];
  dataSinks: DataSinkProtocol[];
}

export class TemplatesStatus {
  completed!: boolean;
}
