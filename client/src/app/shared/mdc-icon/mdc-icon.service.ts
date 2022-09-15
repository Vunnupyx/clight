import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ErrorHandler, Inject, Injectable, Optional,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { mdcSvgIcons } from './mdc-icon.constants';

@Injectable({ providedIn: 'root' })
export class MdcIconRegistry extends MatIconRegistry {
  constructor(
    @Optional() private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    @Optional() @Inject(DOCUMENT) document: Document,
    private readonly errorHandler: ErrorHandler,
  ) {
    super(httpClient, sanitizer, document, errorHandler);

    for (const [name, path] of Object.entries(mdcSvgIcons)) {
      this.addSvgIconInNamespace('mdc', name, this.sanitizer.bypassSecurityTrustResourceUrl(path));
    }
  }
}
