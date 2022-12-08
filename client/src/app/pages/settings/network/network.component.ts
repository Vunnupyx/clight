import * as moment from 'moment';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { NetworkService } from '../../../services/network.service';
import { clone } from '../../../shared/utils';
import {
  NetworkConfig,
  NetworkNtpReachable,
  NetworkType
} from '../../../models';
import {
  HOST_REGEX,
  IP_REGEX,
  NETMASK_REGEX,
  PORT_REGEX
} from '../../../shared/utils/regex';
import { Status } from 'app/shared/state';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit, OnDestroy {
  NetworkType = NetworkType;

  config!: NetworkConfig;
  originalConfig!: NetworkConfig;
  ntpReachable!: NetworkNtpReachable[];

  hostRegex = HOST_REGEX;
  portRegex = PORT_REGEX;
  ipRegex = IP_REGEX;
  netmaskRegex = NETMASK_REGEX;

  get showLoading() {
    return (
      this.networkService.status !== Status.Ready &&
      this.networkService.status !== Status.Failed
    );
  }

  sub: Subscription = new Subscription();
  selectedTab!: string;

  @ViewChild('mainForm') mainForm!: NgForm;

  constructor(private networkService: NetworkService) {}

  ngOnInit(): void {
    this.sub.add(
      this.networkService.config
        .pipe(filter((el) => !!el))
        .subscribe((x) => this.onConfig(x))
    );
    this.sub.add(
      this.networkService.ntpReachable
        .pipe(filter((el) => !!el))
        .subscribe((x) => this.onNtpReachable(x))
    );

    this.sub.add(this.networkService.setNetworkAdaptersTimer().subscribe());

    this.networkService
      .getNetworkAdapters()
      .then(() => this.networkService.getNetworkProxy())
      .then(() => this.networkService.getNetworkNtp())
      .then(() => this.networkService.getNetworkTimestamp());
  }

  get tabs() {
    if (!this.config) {
      return [];
    }

    return Object.keys(this.config).filter((key) => this.config[key]);
  }

  private onConfig(x: NetworkConfig) {
    if (this.mainForm && this.mainForm.dirty) {
      return;
    }

    this.config = clone(x);
    this.originalConfig = clone(x);

    if (!this.tabs.includes(this.selectedTab)) {
      this.selectedTab = this.tabs[0];
    }
  }

  private onNtpReachable(x: NetworkNtpReachable[]) {
    this.ntpReachable = x;
  }

  getNtpReachableByAddress(address: string): boolean {
    return this.ntpReachable.find(
      (obj: NetworkNtpReachable) => obj.address === address
    )?.reachable;
  }

  onSelectTab(tab: string) {
    this.selectedTab = tab;
    this.config = clone(this.originalConfig);
  }

  onSaveAdapters() {
    this.networkService
      .updateNetworkAdapter(this.config[this.selectedTab])
      .then(() => (this.originalConfig = clone(this.config)));
  }

  onSaveProxy() {
    this.networkService
      .updateNetworkProxy(this.config[NetworkType.PROXY])
      .then(() => (this.originalConfig = clone(this.config)));
  }

  onSaveNtp() {
    if (this.config[NetworkType.NTP].ntpEnabled)
      this.networkService
        .updateNetworkNtp(this.config[NetworkType.NTP].host)
        .then(() => (this.originalConfig = clone(this.config)));
    else
      this.networkService
        .updateNetworkTimestamp(this.config[NetworkType.NTP].timestamp)
        .then(() => this.networkService.updateNetworkNtp(['']))
        .then(() => (this.originalConfig = clone(this.config)));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
