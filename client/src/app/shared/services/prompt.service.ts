import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PromptService {
  constructor(private translate: TranslateService) {}

  initWarnBeforePageUnload(condition: () => boolean) {
    window.onbeforeunload = (e) => {
      if (!condition()) {
        return;
      }

      e = e || window.event;

      // For IE and Firefox prior to version 4
      if (e) {
        e.returnValue = 'Sure?';
      }

      // For Safari
      return 'Sure?';
    };
  }

  destroyWarnBeforePageUnload() {
    window.onbeforeunload = null;
  }

  warn(textTranslationKey = 'prompt.warningText'): Promise<void> {
    const confirm = window.confirm(this.translate.instant(textTranslationKey));

    if (confirm) {
      return Promise.resolve();
    }

    return Promise.reject();
  }
}
