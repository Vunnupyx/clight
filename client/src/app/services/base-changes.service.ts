import { IChangesState, ITrackable } from 'app/models/core/data-changes';
import { Store, StoreFactory } from 'app/shared/state';
import { v4 as uuidv4 } from 'uuid';

export class BaseChangesService<TEntity extends ITrackable> {
  protected _changes: Store<IChangesState<string, TEntity>>;

  get isTouched(): boolean {
    return this._changes.snapshot.touched;
  }

  get payload(): IChangesState<string, TEntity> {
    return this._changes.snapshot;
  }

  constructor(changesFactory: StoreFactory<IChangesState<string, TEntity>>) {
    this._changes = changesFactory.startFrom(this.init());
  }

  init(): IChangesState<string, TEntity> {
    return {
      created: {},
      updated: {},
      deleted: [],
      replace: [],
      touched: false
    };
  }

  create(entity: TEntity) {
    entity.id = uuidv4();

    this._changes.patchState((state) => {
      state.created[entity.id] = entity;
      state.touched = true;
    });
  }

  update(key: string, entity: TEntity) {
    this._changes.patchState((state) => {
      if (state.created[key]) {
        state.created[key] = {
          ...state.created[key],
          ...entity
        };

        state.touched = true;
      } else {
        state.updated[key] = {
          ...entity
        } as TEntity;

        state.touched = true;
      }
    });
  }

  updateOrder(entities: TEntity[]) {
    this._changes.patchState((state) => {
      state.touched =
        !!Object.keys(state.created).length ||
        !!Object.keys(state.updated).length ||
        !!state.deleted.length ||
    });
  }

  delete(key: string) {
    this._changes.patchState((state) => {
      if (!state.created[key]) {
        state.deleted.push(key);
        state.touched = true;
      }

      delete state.created[key];
      delete state.updated[key];

      state.touched =
        !!Object.keys(state.created).length ||
        !!Object.keys(state.updated).length ||
        !!state.deleted.length;
    });
  }

  resetState() {
    this._changes.patchState((state) => {
      const emptyState = this.init();

      Object.assign(state, emptyState);
    });
  }
}
