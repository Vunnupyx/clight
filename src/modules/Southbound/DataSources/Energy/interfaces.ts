export interface IEmProReadingResponse {
  context: string;
  id: string;
  timestamp: string;
  name: string;
  value: number;
  unit: string;
  description: string;
}

interface IBulkReadingFormat
  extends Omit<IEmProReadingResponse, 'context' | 'timestamp'> {
  href: string;
}

export interface IEmProBulkReadingResponse {
  context: string;
  timestamp: string;
  items: IBulkReadingFormat[];
}

export interface IEmProTariffChangeResponse {
  code: number;
  context: string;
  message?: string;
  error?: string;
}
