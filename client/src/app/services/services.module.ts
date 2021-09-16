import { NgModule } from "@angular/core";

import { DataPointService } from "./data-point.service";
import { DataSourceService } from "./data-source.service";
import { TodoItemsService } from "./todo-items.service";

@NgModule({
    providers: [
        DataPointService,
        DataSourceService,
        TodoItemsService,
    ]
})
export class ServicesModule { }