import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { NetworkService } from '../../../services/network.service';
import { clone, ObjectMap } from '../../../shared/utils';
import { NetworkConfig, NetworkType } from '../../../models';
import { HOST_REGEX, PORT_REGEX } from '../../../shared/utils/regex';

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

  get tabs() {
    if (!this.config) {
      return [];
    }

    return Object.keys(this.config);
  }

  sub: Subscription = new Subscription();
  selectedTab!: string;

  constructor(private networkService: NetworkService) {}

  ngOnInit(): void {
    this.sub.add(
      this.networkService.config
        .pipe(filter((el) => !!el))
        .subscribe((x) => this.onConfig(x))
    );

    this.sub.add(this.networkService.setNetworkConfigTimer().subscribe());

    this.networkService.getNetworkConfig();
  }

  private onConfig(x: ObjectMap<NetworkConfig>) {
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

  saveChanges(mainForm: NgForm, networkType: NetworkType) {
    this.networkService
      .updateNetworkConfig(this.config)
      .then(() => (this.originalConfig = clone(this.config)))
      .then(() =>
        mainForm.resetForm({
          ...this.config[networkType],
          notToUseDhcp: !this.config[networkType]?.useDhcp
        })
      );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
