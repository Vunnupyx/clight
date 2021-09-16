import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { TodoItem } from 'app/models';
import { HttpMockupService } from 'app/shared';
import { Status, Store, StoreFactory } from 'app/shared/state';
import { errorHandler } from 'app/shared/utils';
import { TODO_ITEMS_MOCK } from './todo-items.service.mock';

export class TodoItemsState {
    status: Status;
    todoItems: TodoItem[];
    totalItems: number;
}

class TodosHttpResponse { 
    results: TodoItem[];
    total: number;
};

@Injectable()
export class TodoItemsService {

    private _store: Store<TodoItemsState>;

    constructor(
        storeFactory: StoreFactory<TodoItemsState>,
        private httpService: HttpMockupService,
    ) {
       this._store = storeFactory.startFrom(this._emptyState());
    }

    get status() {
        return this._store.snapshot.status;
    }

    get todoItems() { 
        return this._store.state.pipe(filter(x => x.status != Status.NotInitialized)).pipe(map(x => x.todoItems));
    }

    async getTodoItems() {
        this._store.patchState(state => ({
            status: Status.Loading,
            todoItems: [],
            totalItems: 0,
        }));

        try {
            const { results, total } = await this.httpService.get<TodosHttpResponse>(`${environment.apiRoot}/todos`, undefined, TODO_ITEMS_MOCK());
            this._store.patchState(state => {
                state.status = Status.Ready;
                state.todoItems = results.map(x => this._parseTodoItem(x));
                state.totalItems = total;
            });
        } catch (err) {
            errorHandler(err);
            this._store.patchState(() => ({
                status: Status.Failed,
            }));
        }
    }

    async addTodoItem(obj: TodoItem) {
        this._store.patchState(state => {
            state.status = Status.Creating;
            state.todoItems.push(obj);
        });

        try {
            await this.httpService.post(`${environment.apiRoot}/todos`, obj);
            this._store.patchState(state => {
                state.status = Status.Ready;
            });
        } catch (err) {
            errorHandler(err);
            // TODO: Show error message (toast notification?)
            this._store.patchState(state => {
                state.status = Status.Ready;
                state.todoItems = state.todoItems.filter(x => x != obj);
            });
        }
    }

    private _parseTodoItem(obj: any) {
        return obj as TodoItem;
    }

    private _emptyState() {
        return <TodoItemsState>{
            status: Status.NotInitialized,
        };
    }

}