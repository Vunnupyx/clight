import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { BackupService, TemplateService } from 'app/services';
import { LocalStorageService } from 'app/shared';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  constructor(
    private backupService: BackupService,
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
    private templatesService: TemplateService,
    private toastr: ToastrService
  ) {}

  get availableLangs() {
    return this.translate.langs;
  }

  get currentLang() {
    return this.translate.currentLang;
  }

  get currentTemplate() {
    return this.templatesService.currentTemplate;
  }

  ngOnInit() {
    this.templatesService.getAvailableTemplates();
  }

  onLanguageChange(value: string) {
    this.translate.use(value);
    this.localStorageService.set('ui-lang', value);
  }

  async download() {
    await this.backupService.download();
  }

  async onRestoreFileChange(event: any) {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      await this.backupService.upload(file);
      this.toastr.success(
        this.translate.instant('settings-general.BackupHasBeenUploaded')
      );
      event.target.value = null;
    }
  }
}
