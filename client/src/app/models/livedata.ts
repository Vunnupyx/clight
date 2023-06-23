export interface TimeSeriesValue {
  ts: string;
  value: boolean | number | string;
}

export class DataPointLiveData {
  dataPointId!: string;
  value!: string | number | boolean;
  unit?: string;
  description?: string;
  timestamp!: number;
  timeseries?: TimeSeriesValue[];
}
