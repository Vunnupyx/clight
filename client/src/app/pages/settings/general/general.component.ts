import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'app/shared';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent {
  constructor(
    private translate: TranslateService,
    private localStorageService: LocalStorageService
  ) {}

  get availableLangs() {
    return this.translate.langs;
  }

  get currentLang() {
    return this.translate.currentLang;
  }

  onLanguageChange(value: string) {
    this.translate.use(value);
    this.localStorageService.set('ui-lang', value);
  }
}
