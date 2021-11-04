import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { DataSourceService, TemplateService } from '../../services';
import { AvailableDataSink, AvailableDataSource } from '../../models/template';
import { LocalStorageService } from '../../shared';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from "../../shared/components/confirm-dialog/confirm-dialog.component";

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

  get filteredSinks() {
    if (!this.sinks || !this.sourceForm?.value?.source) {
      return [];
    }

    return this.sinks;
  }

  constructor(
    private templateService: TemplateService,
    private dataSourceService: DataSourceService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
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

  async onSubmit() {
    const dataSource = this.sourceForm.value.source;
    const dataSinks = this.applicationInterfacesForm.value.interfaces;

    const isCompleted = await this.templateService.isCompleted();

    if (!isCompleted) {
      this.templateService.apply({ dataSource: dataSource, dataSinks })
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

      this.templateService.apply({ dataSource: dataSource, dataSinks })
        .then(() => this.router.navigate(['/']));
    });
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
