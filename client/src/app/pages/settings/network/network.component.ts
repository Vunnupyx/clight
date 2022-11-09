import * as moment from 'moment';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { NetworkService } from '../../../services/network.service';
import { clone } from '../../../shared/utils';
import { NetworkAdapter, NetworkType, ProxyType } from '../../../models';
import { HOST_REGEX, IP_REGEX, PORT_REGEX } from '../../../shared/utils/regex';
import { Status } from 'app/shared/state';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit, OnDestroy {
  NetworkType = NetworkType;

  adapters!: NetworkAdapter[];
  originalAdapters!: NetworkAdapter[];

  hostRegex = HOST_REGEX;
  portRegex = PORT_REGEX;
  ipRegex = IP_REGEX;

  ProxyType = ProxyType;

  get showLoading() {
    return (
      this.networkService.status !== Status.Ready &&
      this.networkService.status !== Status.Failed
    );
  }

  get timezoneOptionsSearchResults() {
    if (!this.timezoneOptions || !this.timezoneOptionKeyphrase) {
      return this.timezoneOptions;
    }
    return this.timezoneOptions.filter((x) =>
      x
        .toLocaleLowerCase()
        .includes(this.timezoneOptionKeyphrase.toLocaleLowerCase())
    );
  }

  sub: Subscription = new Subscription();
  selectedTab: number = 0;
  selectedTabContent: string;
  timezoneOptions!: string[];
  timezoneOptionKeyphrase = '';

  @ViewChild('mainForm') mainForm!: NgForm;

  constructor(private networkService: NetworkService) {}

  ngOnInit(): void {
    this.sub.add(
      this.networkService.adapters
        .pipe(filter((el) => !!el))
        .subscribe((x) => this.onAdapters(x))
    );

    this.timezoneOptions = this._getTimezoneOptions();

    this.sub.add(this.networkService.setNetworkAdaptersTimer().subscribe());

    this.networkService.getNetworkAdapters();
  }

  private onAdapters(x: NetworkAdapter[]) {
    if (this.mainForm && this.mainForm.dirty) {
      return;
    }

    this.adapters = clone(x);
    this.originalAdapters = clone(x);

    if (!this.selectedTab) {
      this.selectedTabContent = this.adapters[this.selectedTab].id;
    }
  }

  onSelectTab(tab: number, content: string) {
    this.selectedTab = tab;
    this.selectedTabContent = content;

    this.adapters = clone(this.originalAdapters);
  }

  onSaveAdapters() {
    const newAdapter = this.adapters[this.selectedTab];
    this.networkService
      .updateNetworkAdapter(newAdapter)
      .then(() => (this.originalAdapters = clone(this.adapters)));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private _getTimezoneOptions() {
    return moment.tz
      .names()
      .filter((name) =>
        [
          'Universal',
          'Africa/',
          'America/',
          'Antarctica/',
          'Arctic/',
          'Asia/',
          'Australia/',
          'Europe/',
          'Indian/',
          'Pacific/'
        ].find((x) => name.startsWith(x))
      );
  }
}
