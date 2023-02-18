import { ObjectMap } from 'app/shared/utils';

export interface IChangesState<TKey, TEntity> {
  created: ObjectMap<TEntity>;
  updated: ObjectMap<TEntity>;
  deleted: TKey[];
  replace: TEntity[];
  touched: boolean;
}

export interface ITrackable {
  id: string;
}

export interface IChangesAppliable {
  revert(): Promise<boolean>;
  apply(...args: any): Promise<boolean>;
}
