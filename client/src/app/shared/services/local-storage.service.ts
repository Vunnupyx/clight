import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { LocalStorageService as Ng2LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class LocalStorageService {

    constructor(private localStorageService: Ng2LocalStorageService) { }

    get<T>(key: string, defaultValue?: T) {
        return parse<T>(this.localStorageService.retrieve(key)) || defaultValue;
    }

    set(key: string, value: any) {
        this.localStorageService.store(key, stringify(value));
    }

    observe<T>(key: string) {
        return Observable.create((observer: Observer<T | undefined>) => {
            
            this.localStorageService
                .observe(key)
                .subscribe((value: string) => {
                    observer.next(parse<T>(value));
                });
        });
    }

    clear(key?: string) {
        this.localStorageService.clear(key);
    }

}

function stringify(input: any) {
    return JSON.stringify(input);
}

function parse<T>(str: string) {
    return str ? JSON.parse(str) as T : undefined;
}
