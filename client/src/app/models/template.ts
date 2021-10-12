export class AvailableDataSource {
  id!: string;
  name!: string;
  description!: string;
}

export class AvailableDataSink {
  id!: string;
  name!: string;
  type!: string;
  description!: string;
  dataSources!: string[];
}

export class TemplatesStatus {
  completed!: boolean;
}
