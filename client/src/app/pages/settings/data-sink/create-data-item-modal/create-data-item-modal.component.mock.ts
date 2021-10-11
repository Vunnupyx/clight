import { ObjectMap } from 'app/shared/utils';

export interface PreDefinedDataPoint {
  name: string;
  address: string;
  type: string;
  initialValue: string;
  map: ObjectMap<string>;
}
