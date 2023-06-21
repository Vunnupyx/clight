export interface TimeSeriesValue {
  ts: string;
  value: boolean | number | string;
}

export enum OpcauaErrorReasons {
  UnexpectedError = 'unexpected_error',
  WrongNodeId = 'wrong_nodeid'
}

export class DataPointLiveData {
  dataPointId!: string;
  value!: string | number | boolean;
  unit?: string;
  description?: string;
  timestamp!: number;
  timeseries?: TimeSeriesValue[];
  errorReason?: OpcauaErrorReasons;
}
