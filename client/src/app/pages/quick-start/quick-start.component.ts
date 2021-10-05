import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { DataSourceService, TemplateService } from '../../services';
import { AvailableDataSink, AvailableDataSource } from '../../models/template';
import { LocalStorageService } from '../../shared';

@Component({
  selector: 'app-quick-start',
  templateUrl: './quick-start.component.html',
  styleUrls: ['./quick-start.component.scss']
})
export class QuickStartComponent implements OnInit, OnDestroy {
  sourceForm!: FormGroup;
  applicationInterfacesForm!: FormGroup;

  sources: AvailableDataSource[] = [];
  sinks: AvailableDataSink[] = [];
  checkedSinks: { [key: string]: boolean } = {};

  sub = new Subscription();

  get currentLang() {
    return this.translate.currentLang;
  }

  constructor(
    private templateService: TemplateService,
    private dataSourceService: DataSourceService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}


  ngOnInit(): void {
    this.sub.add(
      this.templateService.dataSources.subscribe((x) => this.onDataSources(x)),
    );

    this.sub.add(
      this.templateService.dataSinks.subscribe((x) => this.onDataSinks(x)),
    );

    this.templateService.getAvailableTemplates();

    this.sourceForm = this.formBuilder.group({
      source: ['', Validators.required],
    });

    this.applicationInterfacesForm = this.formBuilder.group({
      interfaces: [[], Validators.required],
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onLanguageChange(value: string) {
    this.translate.use(value);
    this.localStorageService.set('ui-lang', value);
  }

  onSubmit() {
    const dataSource = this.sourceForm.value.source;
    const dataSinks = this.applicationInterfacesForm.value.interfaces;

    this.templateService.apply({ dataSource, dataSinks })
      .then(() => this.router.navigate(['/']));
  }

  onInterfacesChange() {
    const interfaces = Object.entries(this.checkedSinks)
      .filter(([, checked]) => checked)
      .map(([key]) => key);

    this.applicationInterfacesForm.patchValue({ interfaces });
  }

  private onDataSources(x: AvailableDataSource[]) {
    this.sources = x;
  }

  private onDataSinks(x: AvailableDataSink[]) {
    this.sinks = x;
  }
}
