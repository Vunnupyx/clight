export interface TimeSeriesValue {
  ts: string;
  value: boolean | number | string;
}

export enum FanucErrorReasons {
  UnexpectedError = 'unexpected_error',
  NoResponse = 'no_response',
  NotSupported = 'not_supported',
  MachineBusy = 'machine_busy'
}

export class DataPointLiveData {
  dataPointId!: string;
  value!: string | number | boolean;
  timestamp!: number;
  timeseries?: TimeSeriesValue[];
  status?: string;
  errorReason?: FanucErrorReasons;
}
