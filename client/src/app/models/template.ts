export class AvailableDataSource {
  id!: string;
  name!: string;
  description!: string;
  templateId!: string;
}

export class AvailableDataSink {
  id!: string;
  name!: string;
  type!: string;
  description!: string;
  templateId!: string;
}

export class TemplatesStatus {
  completed!: boolean;
}
