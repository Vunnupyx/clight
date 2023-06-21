export interface TimeSeriesValue {
  ts: string;
  value: boolean | number | string;
}

export enum OpcuaErrorReasons {
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
  errorReason?: OpcuaErrorReasons;
}
