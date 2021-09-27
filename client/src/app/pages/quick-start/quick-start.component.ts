import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { DataSource } from '../../models';
import { DataSourceService } from '../../services';

@Component({
  selector: 'app-quick-start',
  templateUrl: './quick-start.component.html',
  styleUrls: ['./quick-start.component.scss']
})
export class QuickStartComponent implements OnInit, OnDestroy {
  languageForm!: FormGroup;
  sourceForm!: FormGroup;
  applicationInterfacesForm!: FormGroup;

  sources: DataSource[] = [];

  sub = new Subscription();

  constructor(
    private dataSourceService: DataSourceService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.dataSourceService.dataSources.subscribe((x) => this.onDataSources(x))
    );

    this.dataSourceService.getDataSources();

    this.languageForm = this.formBuilder.group({
      lang: ['', Validators.required],
    });

    this.sourceForm = this.formBuilder.group({
      source: ['', Validators.required],
    });

    this.applicationInterfacesForm = this.formBuilder.group({
      // interfaces: [[], Validators.required],
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private onDataSources(x: DataSource[]) {
    this.sources = x;
  }
}
