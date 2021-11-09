import { ObjectMap } from 'app/shared/utils';

export interface IChangesState<TKey, TEntity> {
  created: ObjectMap<TEntity>;
  updated: ObjectMap<TEntity>;
  deleted: TKey[];
  touched: boolean;
}

export interface ITrackable {
  id: string;
}

export interface IChangesAccumulatable<TKey, TEntity> {
  get isTouched(): boolean;

  init(): IChangesState<TKey, TEntity>;

  create(entity: TEntity);
  update(key: TKey, entity: TEntity);
  delete(key: TKey);

  resetState();
}

export interface IChangesAppliable {
  revert(): Promise<boolean>;
  apply(...args: any): Promise<boolean>;
}
