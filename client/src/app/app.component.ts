import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './shared';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(
        private translate: TranslateService,
        private localStorageService: LocalStorageService,
    ) {}

    ngOnInit() {
        const savedLang = this.localStorageService.get<string>('ui-lang');
        if (savedLang) {
            this.translate.setDefaultLang(savedLang);
            this.translate.use(savedLang);
        }
    }
}
