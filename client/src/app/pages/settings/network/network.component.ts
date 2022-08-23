import * as moment from 'moment';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { NetworkService } from '../../../services/network.service';
import { clone, ObjectMap } from '../../../shared/utils';
import { NetworkConfig, NetworkType, ProxyType } from '../../../models';
import { HOST_REGEX, IP_REGEX, PORT_REGEX } from '../../../shared/utils/regex';
import { Status } from 'app/shared/state';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit, OnDestroy {
  NetworkType = NetworkType;

  config!: ObjectMap<NetworkConfig>;
  originalConfig!: ObjectMap<NetworkConfig>;

  hostRegex = HOST_REGEX;
  portRegex = PORT_REGEX;
  ipRegex = IP_REGEX;

  ProxyType = ProxyType;

  get showLoading() {
    return this.networkService.status !== Status.Ready
        && this.networkService.status !== Status.Failed;
  }

  get tabs() {
    if (!this.config) {
      return [];
    }

    return Object.keys(this.config);
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
  selectedTab!: string;
  timezoneOptions!: string[];
  timezoneOptionKeyphrase = '';

  @ViewChild('mainForm') mainForm!: NgForm;

  constructor(private networkService: NetworkService) {}

  ngOnInit(): void {
    this.sub.add(
      this.networkService.config
        .pipe(filter((el) => !!el))
        .subscribe((x) => this.onConfig(x))
    );

    this.timezoneOptions = this._getTimezoneOptions();

    this.sub.add(this.networkService.setNetworkConfigTimer().subscribe());

    this.networkService.getNetworkConfig();
  }

  private onConfig(x: ObjectMap<NetworkConfig>) {
    if (this.mainForm && this.mainForm.dirty) {
      return;
    }

    this.config = clone(x);
    this.originalConfig = clone(x);

    if (!this.selectedTab) {
      this.selectedTab = this.tabs[0];
    }
  }

  onSelectTab(tab: string) {
    this.selectedTab = tab;

    this.config = clone(this.originalConfig);
  }

  async saveChanges(mainForm: NgForm, networkType: NetworkType) {
    
    await this.networkService.updateNetworkConfig(this.config);

    this.originalConfig = clone(this.config);

    mainForm.resetForm({
      ...this.config[networkType],
      notToUseDhcp: !this.config[networkType]?.useDhcp
    });
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
