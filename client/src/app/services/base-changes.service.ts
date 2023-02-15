import { IChangesState, ITrackable } from 'app/models/core/data-changes';
import { Store, StoreFactory } from 'app/shared/state';

export class BaseChangesService<TEntity extends ITrackable> {
  protected _changes: Store<IChangesState<string, TEntity>>;

  get isTouched(): boolean {
    return this._changes.snapshot.touched;
  }

  constructor(changesFactory: StoreFactory<IChangesState<string, TEntity>>) {
    this._changes = changesFactory.startFrom(this.init());
  }

  init(): IChangesState<string, TEntity> {
    return {
      created: {},
      updated: {},
      deleted: [],
      list: [],
      touched: false
    };
  }

  create(entity: TEntity) {
    // creates temporary ID:
    entity.id = `unsaved:${Date.now().toString()}`;

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
      state.list = entities;
      state.touched =
        !!Object.keys(state.created).length ||
        !!Object.keys(state.updated).length ||
        !!state.deleted.length ||
        !!state.list.length;
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

  getPayload(): Partial<IChangesState<string, TEntity>> {
    const payload: Partial<IChangesState<string, TEntity>> = {};

    if (Object.keys(this._changes.snapshot.created).length) {
      payload.created = this._changes.snapshot.created;
    }

    if (Object.keys(this._changes.snapshot.updated).length) {
      payload.updated = this._changes.snapshot.updated;
    }

    if (this._changes.snapshot.deleted.length) {
      payload.deleted = this._changes.snapshot.deleted;
    }

    if (this._changes.snapshot.list.length) {
      payload.list = this._changes.snapshot.list;
    }

    return payload;
  }
}
