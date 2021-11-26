import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { DataSourceService, TemplateService } from '../../services';
import { LocalStorageService } from '../../shared';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataSinkProtocol, DataSourceProtocol } from 'app/models';
import { ITemplate } from 'app/models/template';
import { array2map, ObjectMap } from 'app/shared/utils';
import { distinctUntilChanged, filter, take } from 'rxjs/operators';
import { TermsAndConditionsService } from 'app/services/terms-and-conditions.service';

@Component({
  selector: 'app-quick-start',
  templateUrl: './quick-start.component.html',
  styleUrls: ['./quick-start.component.scss']
})
export class QuickStartComponent implements OnInit, OnDestroy {
  templateForm!: FormGroup;
  sourceForm!: FormGroup;
  applicationInterfacesForm!: FormGroup;

  templates: ITemplate[] = [];
  templatesObj: ObjectMap<ITemplate> = {};
  sources: DataSourceProtocol[] = [];
  sinks: DataSinkProtocol[] = [];
  checkedSources: { [key: string]: boolean } = {};
  checkedSinks: { [key: string]: boolean } = {};

  shouldOpenTerms = true;

  sub = new Subscription();

  get currentLang() {
    return this.translate.currentLang;
  }

  get filteredSources() {
    const templateId = this.templateForm?.value?.templateId;

    if (!templateId || !this.templatesObj[templateId]) {
      return [];
    }

    return this.templatesObj[templateId].dataSources;
  }

  get filteredSinks() {
    const templateId = this.templateForm?.value?.templateId;

    if (!templateId || !this.templatesObj[templateId]) {
      return [];
    }

    return this.templatesObj[templateId].dataSinks;
  }

  get termsText$() {
    return this.termsService.termsText.pipe(distinctUntilChanged());
  }

  get termsAccepted$() {
    return this.termsService.accepted.pipe(distinctUntilChanged());
  }

  constructor(
    private templateService: TemplateService,
    private termsService: TermsAndConditionsService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.templateForm = this.formBuilder.group({
      templateId: ['', Validators.required]
    });

    this.sourceForm = this.formBuilder.group({
      sources: [[], Validators.required]
    });

    this.applicationInterfacesForm = this.formBuilder.group({
      interfaces: [[], Validators.required]
    });

    this.sub.add(
      this.templateService.templates.subscribe((x) => this.onTemplates(x))
    );

    this.sub.add(
      this.templateService.currentTemplate
        .pipe(filter((x) => !!x))
        .subscribe((templateId) => {
          this.templateForm.patchValue({ templateId });
          this.onTemplateChange();
        })
    );

    this.templateService.getAvailableTemplates();
    this.termsService
      .getTermsAndConditions(this.currentLang)
      .then((accepted) => (this.shouldOpenTerms = !accepted));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onAcceptChange(event) {
    this.termsService.accept(event.checked);
  }

  onTemplateChange() {
    const dataSources =
      this.templatesObj[this.templateForm.value.templateId].dataSources;
    const dataSinks =
      this.templatesObj[this.templateForm.value.templateId].dataSinks;

    dataSources.forEach((x) => (this.checkedSources[x] = true));
    dataSinks.forEach((x) => (this.checkedSinks[x] = true));

    this.onSourcesChange();
    this.onInterfacesChange();
  }

  onLanguageChange(value: string) {
    this.translate.use(value);
    this.localStorageService.set('ui-lang', value);
    this.termsService.getTermsAndConditions(value);
  }

  async onSubmit() {
    const templateId = this.templateForm.value.templateId;
    const dataSources = this.sourceForm.value.sources;
    const dataSinks = this.applicationInterfacesForm.value.interfaces;

    const isCompleted = await this.templateService.isCompleted();

    if (!isCompleted) {
      this.templateService
        .apply({ templateId, dataSources, dataSinks })
        .then(() => this.router.navigate(['/']));

      return;
    }

    const title = this.translate.instant('quick-start.Attention');
    const message = this.translate.instant('quick-start.AttentionMessage');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(title, message)
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (!dialogResult) {
        return;
      }

      this.templateService
        .apply({ templateId, dataSources, dataSinks })
        .then(() => this.router.navigate(['/']));
    });
  }

  onSourcesChange() {
    const sources = Object.entries(this.checkedSources)
      .filter(([, checked]) => checked)
      .map(([key]) => key);

    this.sourceForm.patchValue({ sources });
  }

  onInterfacesChange() {
    const interfaces = Object.entries(this.checkedSinks)
      .filter(([, checked]) => checked)
      .map(([key]) => key);

    this.applicationInterfacesForm.patchValue({ interfaces });
  }

  continueWithoutTemplate() {
    const title = this.translate.instant('quick-start.Attention');
    const message = this.translate.instant('quick-start.SkipMessage');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(title, message)
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (!dialogResult) {
        return;
      }

      this.templateService.skip().then(() => this.router.navigate(['/']));
    });
  }

  private onTemplates(x: ITemplate[]) {
    if (!x) return;

    this.templates = x;
    this.templatesObj = array2map(x, (x) => x.id);
  }
}
