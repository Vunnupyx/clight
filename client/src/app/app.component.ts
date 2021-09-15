import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { TodoItem } from './models';
import { TodoItemsService } from './services';
import { Status } from './shared/state';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    sub = new Subscription();
    items: TodoItem[];
    panelOpenState = false;

    constructor(private todoItemsService: TodoItemsService) { }

    get isBusy() { return this.todoItemsService.status != Status.Ready; }

    async ngOnInit() {
        this.sub.add(this.todoItemsService.todoItems.subscribe(x => this.onTodoItems(x)));

        this.todoItemsService.getTodoItems();
    }

    onTodoItems(arr: TodoItem[]) {
        this.items = arr;
    }

    async onAdd(obj: TodoItem) {
        await this.todoItemsService.addTodoItem(obj);
    }

    ngOnDestroy() {
        this.sub && this.sub.unsubscribe();
    }

}
