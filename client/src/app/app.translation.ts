import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService } from '@ngx-translate/core';

export const AVAILABLE_LANGS = ['de', 'en', 'ja'];
export const DEFAULT_LANG = 'en';

export function createTranslateLoader(http: HttpClient) {
  // Iterate cache buster here to avoid cached translation files
  return new TranslateHttpLoader(
    http,
    './assets/i18n/',
    '.json?cacheBuster=28'
  );
}

const translationOptions = {
  loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [HttpClient]
  }
};

@NgModule({
  imports: [TranslateModule.forRoot(translationOptions)],
  exports: [TranslateModule],
  providers: [TranslateService]
})
export class AppTranslationModule {
  constructor(translate: TranslateService) {
    translate.addLangs(AVAILABLE_LANGS);

    translate.setDefaultLang(DEFAULT_LANG);
    translate.use(DEFAULT_LANG);
  }
}
