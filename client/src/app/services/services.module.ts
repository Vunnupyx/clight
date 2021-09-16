import { NgModule } from "@angular/core";

import { TodoItemsService } from "./todo-items.service";

@NgModule({
    providers: [
        TodoItemsService,
    ]
})
export class ServicesModule { }