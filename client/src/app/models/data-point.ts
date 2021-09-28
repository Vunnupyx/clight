import { ObjectMap } from '../shared/utils';

export enum DataPointType {
  Event = 'event',
  Condition = 'condition'
}

export class DataPoint {
  enabled?: boolean;
  id?: string;
  initialValue?: string;
  map?: ObjectMap<string>;
  name?: string;
  type?: DataPointType;
  address?: string;
}
