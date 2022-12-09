export interface TimeSeriesValue {
  ts: string;
  value: boolean | number | string;
}

export class DataPointLiveData {
  dataPointId!: string;
  value!: string | number | boolean;
  timestamp!: number;
  timeseries?: TimeSeriesValue[];
  status?: string;
  errorReason?: string;
}
