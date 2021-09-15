import { NgModule } from '@angular/core';
import { StoreFactory } from './state';

@NgModule({
    providers: [
        StoreFactory,
    ],
})
export class StateModule { }
