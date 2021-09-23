import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class StoreFactory<TState> {
  startFrom(initialState: TState) {
    return new Store<TState>(initialState);
  }
}

export class Store<TState> {
  private _currentState: TState;
  private _stateSubject: BehaviorSubject<TState>;

  constructor(initialState: TState) {
    this._currentState = initialState;
    this._stateSubject = new BehaviorSubject<TState>(this._currentState);
  }

  get snapshot() {
    return this._currentState;
  }

  get state() {
    return this._stateSubject;
  }

  patchState(mutator?: (state: TState) => any) {
    if (mutator instanceof Function) {
      this._currentState = mutator(this._currentState) || this._currentState;
    }
    this._stateSubject.next(this._currentState);
  }
}
